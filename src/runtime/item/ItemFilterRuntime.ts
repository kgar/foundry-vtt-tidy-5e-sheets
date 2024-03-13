import { CONSTANTS } from 'src/constants';
import type {
  DocumentTypesToFilterTabs,
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

  static defaultFilterPins: Record<string, Record<string, Set<string>>> = {
    [CONSTANTS.SHEET_TYPE_CHARACTER]: {
      [CONSTANTS.TAB_CHARACTER_INVENTORY]: new Set<string>([
        defaultItemFilters.activationCostAction.name,
        defaultItemFilters.activationCostBonus.name,
        defaultItemFilters.activationCostReaction.name,
        defaultItemFilters.equipped.name,
      ]),
      [CONSTANTS.TAB_CHARACTER_FEATURES]: new Set<string>([
        defaultItemFilters.activationCostAction.name,
        defaultItemFilters.activationCostBonus.name,
        defaultItemFilters.activationCostReaction.name,
      ]),
      [CONSTANTS.TAB_CHARACTER_SPELLBOOK]: new Set<string>([
        defaultItemFilters.activationCostAction.name,
        defaultItemFilters.activationCostBonus.name,
        defaultItemFilters.activationCostReaction.name,
        defaultItemFilters.concentration.name,
        defaultItemFilters.ritual.name,
        defaultItemFilters.prepared.name,
      ]),
      [CONSTANTS.TAB_ACTOR_ACTIONS]: new Set<string>([
        defaultItemFilters.activationCostAction.name,
        defaultItemFilters.activationCostBonus.name,
        defaultItemFilters.activationCostReaction.name,
      ]),
    },
    [CONSTANTS.SHEET_TYPE_NPC]: {
      [CONSTANTS.TAB_NPC_ABILITIES]: new Set<string>([
        defaultItemFilters.activationCostAction.name,
        defaultItemFilters.activationCostBonus.name,
        defaultItemFilters.activationCostReaction.name,
      ]),
      [CONSTANTS.TAB_NPC_SPELLBOOK]: new Set<string>([
        defaultItemFilters.activationCostAction.name,
        defaultItemFilters.activationCostBonus.name,
        defaultItemFilters.activationCostReaction.name,
        defaultItemFilters.concentration.name,
        defaultItemFilters.ritual.name,
        defaultItemFilters.prepared.name,
      ]),
      [CONSTANTS.TAB_ACTOR_ACTIONS]: new Set<string>([
        defaultItemFilters.activationCostAction.name,
        defaultItemFilters.activationCostBonus.name,
        defaultItemFilters.activationCostReaction.name,
      ]),
    },
    [CONSTANTS.SHEET_TYPE_VEHICLE]: {
      [CONSTANTS.TAB_ACTOR_ACTIONS]: new Set<string>([
        defaultItemFilters.activationCostAction.name,
        defaultItemFilters.activationCostBonus.name,
        defaultItemFilters.activationCostReaction.name,
      ]),
    },
    [CONSTANTS.SHEET_TYPE_CONTAINER]: {
      [CONSTANTS.TAB_CONTAINER_CONTENTS]: new Set<string>([
        defaultItemFilters.activationCostAction.name,
        defaultItemFilters.activationCostBonus.name,
        defaultItemFilters.activationCostReaction.name,
        defaultItemFilters.equipped.name,
      ]),
    },
  };

  static _documentTabFilters: DocumentTypesToFilterTabs = {
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
    [CONSTANTS.SHEET_TYPE_CONTAINER]: {
      [CONSTANTS.TAB_CONTAINER_CONTENTS]: {
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
    },
  };

  static getFilter(filterName: ItemFilter['name']): ItemFilter | undefined {
    return ItemFilterRuntime._registeredItemFilters[filterName];
  }

  static getDocumentFilters(document: any): FilterTabsToCategories {
    return ItemFilterRuntime._documentTabFilters[document.type] ?? {};
  }
}
