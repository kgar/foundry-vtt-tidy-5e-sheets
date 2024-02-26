import { CONSTANTS } from 'src/constants';
import type {
  ActorTypesToFilterTabs,
  FilterTabsToCategories,
  ItemFilter,
} from './item.types';
import {
  defaultItemFilters,
  getActionListFilterCategories,
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
          defaultItemFilters.activationCostAction,
          defaultItemFilters.activationCostBonus,
          defaultItemFilters.activationCostReaction,
        ],
        'DND5E.Rarity': () => getItemRarityFilters(),
        'TIDY5E.ItemFilters.Category.Miscellaneous': () => [
          defaultItemFilters.equipped,
          ...getAttunementFilters(),
        ],
      },
      [CONSTANTS.TAB_CHARACTER_SPELLBOOK]: {
        'DND5E.ItemActivationCost': [
          defaultItemFilters.activationCostAction,
          defaultItemFilters.activationCostBonus,
          defaultItemFilters.activationCostReaction,
          defaultItemFilters.activationCostOther,
        ],
        ...getStandardSpellSchoolFilterCategories(),
      },
      [CONSTANTS.TAB_CHARACTER_FEATURES]: {
        'DND5E.ItemActivationCost': [
          defaultItemFilters.activationCostAction,
          defaultItemFilters.activationCostBonus,
          defaultItemFilters.activationCostReaction,
        ],
      },
      [CONSTANTS.TAB_ACTOR_ACTIONS]: { ...getActionListFilterCategories() },
    },
    [CONSTANTS.SHEET_TYPE_NPC]: {
      [CONSTANTS.TAB_NPC_SPELLBOOK]: {
        'DND5E.ItemActivationCost': [
          defaultItemFilters.activationCostAction,
          defaultItemFilters.activationCostBonus,
          defaultItemFilters.activationCostReaction,
          defaultItemFilters.activationCostOther,
        ],
        ...getStandardSpellSchoolFilterCategories(),
      },
      [CONSTANTS.TAB_NPC_ABILITIES]: {
        // TODO: Upgrade the filter system so that it's easier to dynamically graft in additional filter sets rather than hardcoding them in
        'DND5E.ItemActivationCost': [
          defaultItemFilters.activationCostAction,
          defaultItemFilters.activationCostBonus,
          defaultItemFilters.activationCostReaction,
          defaultItemFilters.activationCostLegendary,
          defaultItemFilters.activationCostMythic,
          defaultItemFilters.activationCostLair,
          defaultItemFilters.activationCostOther,
        ],
        ...getStandardSpellSchoolFilterCategories(),
      },
      [CONSTANTS.TAB_ACTOR_ACTIONS]: { ...getActionListFilterCategories() },
    },
    [CONSTANTS.SHEET_TYPE_VEHICLE]: {
      [CONSTANTS.TAB_ACTOR_ACTIONS]: { ...getActionListFilterCategories() },
    },
  };

  static getFilter(filterName: ItemFilter['name']): ItemFilter | undefined {
    return ItemFilterRuntime._registeredItemFilters[filterName];
  }

  static getActorFilters(actor: Actor5e): FilterTabsToCategories {
    return ItemFilterRuntime._actorTabFilters[actor.type] ?? {};
  }
}
