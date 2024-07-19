import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { ActionListRuntime } from 'src/runtime/action-list/ActionListRuntime';
import { SettingsProvider } from 'src/settings/settings';
import type { ContainerContents, Item5e } from 'src/types/item.types';
import type {
  ActionItem,
  ActionSection,
  Actor5e,
  SortMode,
} from 'src/types/types';
import { isNil } from 'src/utils/data';
import { scaleCantripDamageFormula, simplifyFormula } from 'src/utils/formula';
import { debug, error } from 'src/utils/logging';
import { SpellUtils } from 'src/utils/SpellUtils';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { Container } from '../containers/Container';

export type ActionSets = Record<string, Set<ActionItem>>;

const itemTypeSortValues: Record<string, number> = {
  weapon: 1,
  equipment: 2,
  feat: 3,
  spell: 4,
  consumable: 5,
  tool: 6,
  class: 8,
  loot: 9,
};

const activationTypeSortValues: Record<string, number> = {
  action: 1,
  bonus: 2,
  reaction: 3,
  legendary: 4,
  mythic: 5,
  lair: 6,
  crew: 7,
  special: 8,
};

export async function getActorActionSections(
  actor: Actor5e
): Promise<ActionSection[]> {
  try {
    let eligibleItems: ActionItem[] = [];

    for (let item of actor.items) {
      if (!isItemInActionList(item)) {
        continue;
      }

      eligibleItems.push(await mapActionItem(item));
    }

    return buildActionSections(actor, eligibleItems);
  } catch (e) {
    error('An error occurred while getting actions', false, e);
    return [];
  }
}

export function sortActions(section: ActionSection, sortMode: SortMode) {
  section.actions.sort(({ item: a }, { item: b }) => {
    if (sortMode === 'a') {
      return a.name.localeCompare(b.name);
    }

    // Sort by Arbitrary Action List Rules
    if (a.type !== b.type) {
      return itemTypeSortValues[a.type] - itemTypeSortValues[b.type];
    }
    if (a.type === 'spell' && b.type === 'spell') {
      return a.system.level - b.system.level;
    }
    return (a.sort || 0) - (b.sort || 0);
  });
}

function buildActionSections(
  actor: Actor5e,
  actionItems: ActionItem[]
): ActionSection[] {
  const customMappings = ActionListRuntime.getActivationTypeMappings();

  let actionSections: Record<string, ActionSection> = {};

  // Initialize the default sections in their default order.
  Object.keys(activationTypeSortValues).forEach((activationType) => {
    actionSections[activationType] = {
      actions: [],
      dataset: {},
      label: FoundryAdapter.getActivationTypeLabel(activationType),
      key: activationType,
      show: true,
    };
  });

  // partition items into sections
  for (let actionItem of actionItems) {
    const customSectionName = TidyFlags.actionSection.get(actionItem.item);
    if (customSectionName) {
      const customSection = (actionSections[customSectionName] ??= {
        actions: [],
        dataset: {},
        key: customSectionName,
        label: FoundryAdapter.localize(customSectionName),
        show: true,
        custom: {
          creationItemTypes: [],
          section: customSectionName,
        },
      });
      customSection.actions.push(actionItem);
    } else {
      const activationType = getActivationType(
        actionItem.item.system.activation?.type,
        customMappings
      );
      const section = (actionSections[activationType] ??= {
        actions: [],
        dataset: {},
        key: activationType,
        label: FoundryAdapter.getActivationTypeLabel(activationType),
        show: true,
      });
      section.actions.push(actionItem);
    }
  }

  return Object.values(actionSections);
}

export function isItemInActionList(item: Item5e): boolean {
  // check our override
  const override = TidyFlags.actionFilterOverride.get(item);

  if (override !== undefined && override !== null) {
    return override;
  }

  // perform normal filtering logic
  switch (item.type) {
    case CONSTANTS.ITEM_TYPE_WEAPON: {
      return item.system.equipped;
    }
    case CONSTANTS.ITEM_TYPE_EQUIPMENT: {
      return item.system.equipped && isActiveItem(item.system.activation?.type);
    }
    case CONSTANTS.ITEM_TYPE_CONSUMABLE: {
      return (
        SettingsProvider.settings.actionListIncludeConsumables.get() &&
        isActiveItem(item.system.activation?.type)
      );
    }
    case CONSTANTS.ITEM_TYPE_SPELL: {
      const limitToCantrips =
        SettingsProvider.settings.actionListLimitActionsToCantrips.get();

      // only exclude spells which need to be prepared but aren't
      if (
        !SpellUtils.isCantrip(item) &&
        (limitToCantrips || SpellUtils.isUnprepared(item))
      ) {
        return false;
      }
      const isReaction =
        item.system.activation?.type === CONSTANTS.ACTIVATION_COST_REACTION;
      const isBonusAction =
        item.system.activation?.type === CONSTANTS.ACTIVATION_COST_BONUS;

      //ASSUMPTION: If the spell causes damage, it will have damageParts
      const isDamageDealer = item.system.damage?.parts?.length > 0;
      let shouldInclude = isReaction || isBonusAction || isDamageDealer;
      if (
        SettingsProvider.settings.actionListIncludeMinuteLongSpellsAsActions.get()
      ) {
        const isOneMinuter =
          item.system?.duration?.units === 'minute' &&
          item.system?.duration?.value === 1;
        const isOneRounder =
          item.system?.duration?.units === 'round' &&
          item.system?.duration?.value === 1;
        shouldInclude = shouldInclude || isOneMinuter || isOneRounder;
      }
      if (
        SettingsProvider.settings.actionListIncludeSpellsWithActiveEffects.get()
      ) {
        const hasEffects = !!item.effects.size;
        shouldInclude = shouldInclude || hasEffects;
      }
      return shouldInclude;
    }
    case CONSTANTS.ITEM_TYPE_FEAT: {
      return !!item.system.activation?.type;
    }
    default: {
      return false;
    }
  }
}

async function mapActionItem(item: Item5e): Promise<ActionItem> {
  try {
    let calculatedDerivedDamage = Array.isArray(item.labels.derivedDamage)
      ? [...item.labels.derivedDamage].map(
          ({ formula, label, damageType }: any, i: number) => {
            const rawDamagePartFormula = item.system.damage?.parts[i]?.[0];

            if (rawDamagePartFormula?.trim() === '') {
              formula = '';
            }

            formula = simplifyFormula(formula, true);

            const damageHealingTypeLabel =
              FoundryAdapter.lookupDamageType(damageType) ??
              FoundryAdapter.lookupHealingType(damageType) ??
              '';

            if (
              item.type === 'spell' &&
              item.system.scaling?.mode === 'cantrip' &&
              SettingsProvider.settings.actionListScaleCantripDamage.get()
            ) {
              formula = scaleCantripDamageFormula(item, formula);
              label = `${formula} ${damageHealingTypeLabel}`;
            }

            return {
              label,
              formula,
              damageType,
              damageHealingTypeLabel,
            };
          }
        )
      : [];

    let containerContents: ContainerContents | undefined = undefined;
    if (item.type === CONSTANTS.ITEM_TYPE_CONTAINER) {
      containerContents = await Container.getContainerContents(item);
    }

    return {
      item,
      typeLabel: FoundryAdapter.localize(`ITEM.Type${item.type.titleCase()}`),
      calculatedDerivedDamage,
      containerContents,
      ...getRangeTitles(item),
    };
  } catch (e) {
    error(
      'An error occurred while processing an item for the action list',
      false,
      e
    );
    debug('Action list mapping error troubleshooting info', { item });

    return {
      item,
      typeLabel: FoundryAdapter.localize(`ITEM.Type${item.type.titleCase()}`),
      calculatedDerivedDamage: [],
      rangeTitle: '',
      rangeSubtitle: '',
    };
  }
}

function getRangeTitles(item: Item5e): {
  rangeTitle: string | null;
  rangeSubtitle: string | null;
} {
  const rangeSubtitle =
    item.system.target?.type !== 'self' && item.labels?.target
      ? item.labels.target
      : null;

  const rangeTitle =
    item.system.target?.type === 'self'
      ? item.labels.target
      : hasRange(item)
      ? item.labels.range
      : rangeSubtitle !== null
      ? '—'
      : null;

  return {
    rangeTitle,
    rangeSubtitle,
  };
}

function hasRange(item: Item5e): boolean {
  return !isNil(item.system.range?.units);
}

function buildActionSets(filteredItems: any): ActionSets {
  const customMappings = ActionListRuntime.getActivationTypeMappings();

  // Build action sets based on what items are available.
  let actionSets = filteredItems.reduce(
    (acc: ActionSets, actionItem: ActionItem) => {
      try {
        /* 
          Priority 1: Custom Action Sections
          Priority 2: Custom Mappings via the Tidy API
          Priority 3: Item Activation Type
        */
        const customActionSection = TidyFlags.actionSection.get(
          actionItem.item
        );

        const activationType = customActionSection
          ? customActionSection
          : getActivationType(
              actionItem.item.system.activation?.type,
              customMappings
            );

        if (!acc[activationType]) {
          acc[activationType] = new Set<ActionItem>();
        }
        acc[activationType].add(actionItem);
        return acc;
      } catch (e) {
        error('error trying to digest item', true, {
          name: actionItem.item.name,
          e,
        });
        return acc;
      }
    },
    {}
  );

  // Sort action sets deterministically.
  return Object.keys(actionSets)
    .sort(
      (a, b) =>
        (activationTypeSortValues[a] || Number.MAX_VALUE) -
        (activationTypeSortValues[b] || Number.MAX_VALUE)
    )
    .reduce<ActionSets>((result, key) => {
      result[key] = actionSets[key];
      return result;
    }, {});
}

function getActivationType(
  activationType: string,
  customMappings: Record<string, string>
) {
  const customMapping = customMappings[activationType];
  if (customMapping) {
    return customMapping;
  }

  if (activationType in activationTypeSortValues) {
    return activationType;
  }

  return 'other';
}

function isActiveItem(activationType: string) {
  if (!activationType) {
    return false;
  }
  if (['minute', 'hour', 'day', 'none'].includes(activationType)) {
    return false;
  }
  return true;
}

// TODO: Put more Actions stuff into the static class
export class Actions {
  static get damageAndHealingTypesIconSrcMap(): Record<string, string> {
    const damageTypes = Object.entries(CONFIG.DND5E.damageTypes).reduce<
      Record<string, string>
    >((obj, [key, damageType]: [string, any]) => {
      obj[key] = damageType.icon;
      return obj;
    }, {});
    const healingTypes = Object.entries(CONFIG.DND5E.healingTypes).reduce<
      Record<string, string>
    >((obj, [key, damageType]: [string, any]) => {
      obj[key] = damageType.icon;
      return obj;
    }, {});
    return {
      ...damageTypes,
      ...healingTypes,
    };
  }
}

export function actorUsesActionFeature(actor: Actor5e) {
  const selectedTabIds = TidyFlags.selectedTabs.get(actor);

  if (selectedTabIds) {
    return selectedTabIds.includes(CONSTANTS.TAB_ACTOR_ACTIONS);
  }

  const defaultTabIds =
    actor.type === CONSTANTS.SHEET_TYPE_CHARACTER
      ? SettingsProvider.settings.defaultCharacterSheetTabs.get()
      : actor.type === CONSTANTS.SHEET_TYPE_NPC
      ? SettingsProvider.settings.defaultNpcSheetTabs.get()
      : actor.type === CONSTANTS.SHEET_TYPE_VEHICLE
      ? SettingsProvider.settings.defaultVehicleSheetTabs.get()
      : [];

  return defaultTabIds.includes(CONSTANTS.TAB_ACTOR_ACTIONS);
}
