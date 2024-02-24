import { CONSTANTS } from 'src/constants';
import type {
  ActorTypesToFilterTabs,
  FilterTabsToCategories,
  ItemFilter,
} from './item.types';
import {
  defaultItemFilters,
  getAttunementFilters,
  getAttunementFiltersAsObject,
  getItemRarityFilters,
  getItemRarityFiltersAsObject,
  getSpellSchoolFiltersAsObject,
  getStandardSpellSchoolFilterCategories,
} from './default-item-filters';
import type { Actor5e } from 'src/types/types';

export class ItemFilterRuntime {
  static _registeredItemFilters: Record<string, ItemFilter> = {};

  static init() {
    ItemFilterRuntime._registeredItemFilters = {
      ...defaultItemFilters,
      ...getAttunementFiltersAsObject(),
      ...getItemRarityFiltersAsObject(),
      ...getSpellSchoolFiltersAsObject(),
    };
  }

  static _actorTabFilters: ActorTypesToFilterTabs = {
    [CONSTANTS.SHEET_TYPE_CHARACTER]: {
      [CONSTANTS.TAB_CHARACTER_INVENTORY]: {
        'DND5E.ItemActivationCost': [
          defaultItemFilters.action,
          defaultItemFilters.bonus,
          defaultItemFilters.reaction,
        ],
        'DND5E.Rarity': () => getItemRarityFilters(),
        'TIDY5E.ItemFilters.Category.Miscellaneous': () => [
          defaultItemFilters.equipped,
          ...getAttunementFilters(),
        ],
      },
      [CONSTANTS.TAB_CHARACTER_SPELLBOOK]: {
        ...getStandardSpellSchoolFilterCategories(),
      },
      [CONSTANTS.TAB_CHARACTER_FEATURES]: {
        'DND5E.ItemActivationCost': [
          defaultItemFilters.action,
          defaultItemFilters.bonus,
          defaultItemFilters.reaction,
        ],
      },
    },
    [CONSTANTS.SHEET_TYPE_NPC]: {
      [CONSTANTS.TAB_NPC_SPELLBOOK]: {
        ...getStandardSpellSchoolFilterCategories(),
      },
      [CONSTANTS.TAB_NPC_ABILITIES]: {
        'DND5E.ItemActivationCost': [
          defaultItemFilters.action,
          defaultItemFilters.bonus,
          defaultItemFilters.reaction,
          // Legendary/Mythical/Lair/etc.
        ],
        // Spells, but limit them to only when the spellbook tab is hidden
      },
    },
    [CONSTANTS.SHEET_TYPE_VEHICLE]: {
      // No filters yet ☹
    },
  };

  static getFilter(filterName: ItemFilter['name']): ItemFilter | undefined {
    return ItemFilterRuntime._registeredItemFilters[filterName];
  }

  static getActorFilters(actor: Actor5e): FilterTabsToCategories {
    return ItemFilterRuntime._actorTabFilters[actor.type] ?? {};
  }
}
