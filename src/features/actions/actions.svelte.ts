import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { ActionListRuntime } from 'src/runtime/action-list/ActionListRuntime';
import { settings } from 'src/settings/settings.svelte';
import type { Item5e } from 'src/types/item.types';
import type {
  ActionItem,
  Actor5e,
  TidyItemSectionBase,
} from 'src/types/types';
import { error } from 'src/utils/logging';
import { SpellUtils } from 'src/utils/SpellUtils';
import { TidyFlags } from 'src/foundry/TidyFlags';

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

export async function getActorActionSectionsQuadrone(
  actor: Actor5e,
  options?: Partial<TidyItemSectionBase>
): Promise<TidyItemSectionBase[]> {
  try {
    let eligibleItems: Item5e[] = [];

    for (let item of actor.items) {
      if (!isItemInActionList(item)) {
        continue;
      }

      eligibleItems.push(item);
    }

    return buildActionSectionsQuadrone(eligibleItems, options);
  } catch (e) {
    error('An error occurred while getting actions', false, e);
    return [];
  }
}

export function getSortedActionsQuadrone(
  section: TidyItemSectionBase,
  sortMode: string
) {
  return section.items.toSorted((a, b) => {
    if (sortMode === CONSTANTS.ITEM_SORT_METHOD_KEY_ALPHABETICAL_ASCENDING) {
      return a.name.localeCompare(b.name, game.i18n.lang);
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

function buildActionSectionsQuadrone(
  items: Item5e[],
  options?: Partial<TidyItemSectionBase>
): TidyItemSectionBase[] {
  const customMappings = ActionListRuntime.getActivationTypeMappings();

  let actionSections: Record<string, TidyItemSectionBase> = {};

  // Initialize the default sections in their default order.
  Object.keys(activationTypeSortValues).forEach((activationType) => {
    actionSections[activationType] = {
      items: [],
      dataset: {},
      label: FoundryAdapter.getActivationTypeLabel(activationType),
      key: activationType,
      show: true,
      rowActions: [],
      sectionActions: [],
      ...options,
    };
  });

  // partition items into sections
  for (let item of items) {
    const customSectionName = TidyFlags.actionSection.get(item);
    if (customSectionName) {
      const customSection = (actionSections[customSectionName] ??= {
        items: [],
        dataset: {},
        key: customSectionName,
        label: FoundryAdapter.localize(customSectionName),
        show: true,
        custom: {
          creationItemTypes: [],
          section: customSectionName,
        },
        rowActions: [],
        sectionActions: [],
        ...options,
      });
      customSection.items.push(item);
    } else {
      const activationType = getActivationType(
        item.system.activities?.contents[0]?.activation.type,
        customMappings
      );

      const section = (actionSections[activationType] ??= {
        items: [],
        dataset: {},
        key: activationType,
        label: FoundryAdapter.getActivationTypeLabel(activationType),
        show: true,
        rowActions: [],
        sectionActions: [],
        ...options,
      });
      section.items.push(item);
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
      return (
        item.system.equipped &&
        isActiveItem(item.system.activities?.contents[0]?.activation.type)
      );
    }
    case CONSTANTS.ITEM_TYPE_CONSUMABLE: {
      return (
        settings.value.actionListIncludeConsumables &&
        isActiveItem(item.system.activities?.contents[0]?.activation.type)
      );
    }
    case CONSTANTS.ITEM_TYPE_SPELL: {
      const limitToCantrips = settings.value.actionListLimitActionsToCantrips;

      // only exclude spells which need to be prepared but aren't
      const activitySpellItem = item.system.linkedActivity?.item;

      const isEligibleActivitySpell =
        !!activitySpellItem &&
        (activitySpellItem.system.attunement !==
          CONSTANTS.ATTUNEMENT_REQUIRED ||
          activitySpellItem.system.attuned);

      const levelledSpellIsEligible =
        SpellUtils.isCastableSpell(item) || isEligibleActivitySpell;

      const isCantrip = SpellUtils.isCantrip(item);

      // Non-cantrip spells must be permitted via settings and castable by either
      // preparation mode rules or by Cast Activity item rules.
      if (!isCantrip && (limitToCantrips || !levelledSpellIsEligible)) {
        return false;
      }

      // Cantrips fron Cast Activity item rules
      // must respect attunement settings.
      if (!!activitySpellItem && isCantrip && !isEligibleActivitySpell) {
        return false;
      }

      const isReaction =
        item.system.activities?.contents[0]?.activation.type ===
        CONSTANTS.ACTIVATION_COST_REACTION;
      const isBonusAction =
        item.system.activities?.contents[0]?.activation.type ===
        CONSTANTS.ACTIVATION_COST_BONUS;

      //ASSUMPTION: If the spell causes damage, it will have damageParts
      const damage = getActivityFirstDamage(item);
      const isDamageDealer = damage?.parts?.length > 0;
      let shouldInclude = isReaction || isBonusAction || isDamageDealer;
      if (settings.value.actionListIncludeMinuteLongSpellsAsActions) {
        const isOneMinuter =
          item.system?.duration?.units === 'minute' &&
          item.system?.duration?.value === 1;
        const isOneRounder =
          item.system?.duration?.units === 'round' &&
          item.system?.duration?.value === 1;
        shouldInclude = shouldInclude || isOneMinuter || isOneRounder;
      }
      if (settings.value.actionListIncludeSpellsWithActiveEffects) {
        const hasEffects = !!item.effects.size;
        shouldInclude = shouldInclude || hasEffects;
      }
      return shouldInclude;
    }
    case CONSTANTS.ITEM_TYPE_FEAT: {
      return !!item.system.activities?.contents[0]?.activation.type;
    }
    default: {
      return false;
    }
  }
}

function getActivityFirstDamage(item: Item5e) {
  const activity =
    item.system.activities?.getByType('attack')[0] ||
    item.system.activities?.getByType('damage')[0] ||
    item.system.activities?.getByType('save')[0];
  return {
    parts:
      activity?.damage.parts.map((d: any) => [
        d.formula,
        d.types.first() ?? '',
      ]) ?? [],
    versatile: '',
  };
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
