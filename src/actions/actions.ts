import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { SettingsProvider } from 'src/settings/settings';
import type { Item5e } from 'src/types/item';
import type { Actor5e, ActorActions } from 'src/types/types';
import { debug, error } from 'src/utils/logging';

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
  const filteredItems: any[] = actor.items
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
    .map((item: Item5e) => {
      if (item.labels) {
        item.labels.type = FoundryAdapter.localize(
          `ITEM.Type${item.type.titleCase()}`
        );
      }

      // removes any in-formula flavor text from the formula in the label
      if (item.labels?.derivedDamage?.length) {
        item.labels.derivedDamage = item.labels.derivedDamage.map(
          ({ formula, ...rest }: any) => ({
            formula: formula?.replace(/\[.+?\]/, '') || '0',
            ...rest,
          })
        );
      }
      return item;
    });

  const initial: ActionSets = {
    action: new Set(),
    bonus: new Set(),
    crew: new Set(),
    lair: new Set(),
    legendary: new Set(),
    reaction: new Set(),
    other: new Set(),
    mythic: new Set(),
    special: new Set(),
  };
  const actionsData = filteredItems.reduce<ActionSets>((acc, item) => {
    try {
      debug('digesting item', {
        item,
      });

      if (['backpack', 'tool'].includes(item.type)) {
        return acc;
      }

      const activationType = getActivationType(item.system.activation?.type);
      acc[activationType].add(item);
      return acc;
    } catch (e) {
      error('error trying to digest item', true, { name: item.name, e });
      return acc;
    }
  }, initial);
  return actionsData;
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
