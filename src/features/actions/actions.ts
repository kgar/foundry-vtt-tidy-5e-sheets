import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { SettingsProvider } from 'src/settings/settings';
import type { Item5e } from 'src/types/item';
import type { ActionItem, Actor5e, ActorActions } from 'src/types/types';
import { scaleCantripDamageFormula, simplifyFormula } from 'src/utils/formula';
import { error } from 'src/utils/logging';

export type ActionSets = {
  action: Set<Item5e>;
  bonus: Set<Item5e>;
  crew: Set<Item5e>;
  lair: Set<Item5e>;
  legendary: Set<Item5e>;
  mythic: Set<Item5e>;
  special: Set<Item5e>;
  reaction: Set<Item5e>;
  other: Set<Item5e>;
};

const itemTypeSortValues: Record<string, number> = {
  weapon: 1,
  equipment: 2,
  feat: 3,
  spell: 4,
  consumable: 5,
  tool: 6,
  backpack: 7,
  class: 8,
  loot: 9,
};

export function getActorActions(actor: Actor5e): ActorActions {
  const actorRollData = actor.getRollData();

  const filteredItems = actor.items
    .filter(isItemInActionList)
    .sort((a: Item5e, b: Item5e) => {
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
  let calculatedDerivedDamage = Array.isArray(item.labels.derivedDamage)
    ? [...item.labels.derivedDamage].map(
        ({ formula, label, damageType }: any) => {
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
  };
}

function buildActionSets(filteredItems: any) {
  const initial: ActionSets = {
    action: new Set(),
    bonus: new Set(),
    crew: new Set(),
    lair: new Set(),
    legendary: new Set(),
    reaction: new Set(),
    mythic: new Set(),
    special: new Set(),
    other: new Set(),
  };

  return filteredItems.reduce((acc: ActionSets, actionItem: ActionItem) => {
    try {
      if (['backpack', 'tool'].includes(actionItem.item.type)) {
        return acc;
      }

      const activationType = getActivationType(
        actionItem.item.system.activation?.type
      );
      acc[activationType].add(actionItem);
      return acc;
    } catch (e) {
      error('error trying to digest item', true, {
        name: actionItem.item.name,
        e,
      });
      return acc;
    }
  }, initial);
}

function getActivationType(activationType: string) {
  switch (activationType) {
    case 'action':
    case 'bonus':
    case 'crew':
    case 'lair':
    case 'legendary':
    case 'mythic':
    case 'special':
    case 'reaction':
      return activationType;
    default:
      return 'other';
  }
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

export const damageTypeIconMap: Record<string, string> = {
  acid: '<i class="fas fa-hand-holding-water"></i>',
  bludgeoning: '<i class="fas fa-gavel"></i>',
  cold: '<i class="fas fa-snowflake"></i>',
  fire: '<i class="fas fa-fire-alt"></i>',
  force: '<i class="fas fa-hat-wizard"></i>',
  lightning: '<i class="fas fa-bolt"></i>',
  necrotic: '<i class="fas fa-skull"></i>',
  piercing: '<i class="fas fa-thumbtack"></i>',
  poison: '<i class="fas fa-skull-crossbones"></i>',
  psychic: '<i class="fas fa-brain"></i>',
  radiant: '<i class="fas fa-sun"></i>',
  slashing: '<i class="fas fa-cut"></i>',
  thunder: '<i class="fas fa-wind"></i>',
  healing: '<i class="fas fa-heart"></i>',
  temphp: '<i class="fas fa-shield-alt"></i>',
};

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
