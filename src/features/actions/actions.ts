import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { ActionListRuntime } from 'src/runtime/action-list/ActionListRuntime';
import { SettingsProvider } from 'src/settings/settings';
import type { Item5e } from 'src/types/item.types';
import type { ActionItem, Actor5e, ActorActions } from 'src/types/types';
import { isNil } from 'src/utils/data';
import { scaleCantripDamageFormula, simplifyFormula } from 'src/utils/formula';
import { debug, error } from 'src/utils/logging';
import { SheetPreferencesService } from '../user-preferences/SheetPreferencesService';
import type { ItemFilterService } from '../filtering/ItemFilterService';

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

export function getActorActions(
  actor: Actor5e,
  itemFilterService: ItemFilterService
): ActorActions {
  try {
    const sheetPreferences = SheetPreferencesService.getByType(actor.type);

    const actionSortMode =
      sheetPreferences.tabs?.[CONSTANTS.TAB_ACTOR_ACTIONS]?.sort ?? 'm';

    let filteredItems = actor.items.filter(isItemInActionList);

    filteredItems = itemFilterService.filter(
      filteredItems,
      CONSTANTS.TAB_ACTOR_ACTIONS
    );

    filteredItems = filteredItems
      .sort((a: Item5e, b: Item5e) => {
        if (actionSortMode === 'a') {
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
      })
      .map((item: Item5e) => mapActionItem(item));

    return buildActionSets(filteredItems);
  } catch (e) {
    error('An error occurred while getting actions', false, e);
    return {};
  }
}

export function isItemInActionList(item: Item5e): boolean {
  // check our override
  const override = FoundryAdapter.tryGetFlag<boolean>(
    item,
    'action-filter-override'
  );

  if (override !== undefined && override !== null) {
    return override;
  }

  // perform normal filtering logic
  switch (item.type) {
    case 'weapon': {
      return item.system.equipped;
    }
    case 'equipment': {
      return item.system.equipped && isActiveItem(item.system.activation?.type);
    }
    case 'consumable': {
      return (
        SettingsProvider.settings.actionListIncludeConsumables.get() &&
        isActiveItem(item.system.activation?.type)
      );
    }
    case 'spell': {
      const limitToCantrips =
        SettingsProvider.settings.actionListLimitActionsToCantrips.get();

      // only exclude spells which need to be prepared but aren't
      const notPrepared =
        item.system.preparation?.mode === 'prepared' &&
        !item.system.preparation?.prepared;
      const isCantrip = item.system.level === 0;
      if (!isCantrip && (limitToCantrips || notPrepared)) {
        return false;
      }
      const isReaction = item.system.activation?.type === 'reaction';
      const isBonusAction = item.system.activation?.type === 'bonus';

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
    case 'feat': {
      return !!item.system.activation?.type;
    }
    default: {
      return false;
    }
  }
}

function mapActionItem(item: Item5e): ActionItem {
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

    return {
      item,
      typeLabel: FoundryAdapter.localize(`ITEM.Type${item.type.titleCase()}`),
      calculatedDerivedDamage,
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
        const activationType = getActivationType(
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
  const selectedTabIds = FoundryAdapter.tryGetFlag<string[] | undefined>(
    actor,
    'selected-tabs'
  );

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

export function toggleActionFilterOverride(item: Item5e) {
  FoundryAdapter.setFlag(
    item,
    'action-filter-override',
    !isItemInActionList(item)
  );
}
