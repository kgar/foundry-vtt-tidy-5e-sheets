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
  getSpellSchoolFilters,
  getSpellSchoolFiltersAsObject,
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
        'DND5E.ItemActivationCost': [
          defaultItemFilters.action,
          defaultItemFilters.bonus,
          defaultItemFilters.reaction,
        ],
        'DND5E.SpellComponents': [
          defaultItemFilters.verbal,
          defaultItemFilters.somatic,
          defaultItemFilters.material,
          defaultItemFilters.ritual,
          defaultItemFilters.concentration,
        ],
        'DND5E.SpellPreparationMode': [defaultItemFilters.prepared],
        'DND5E.SpellSchool': () => getSpellSchoolFilters(),
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
        'DND5E.ItemActivationCost': [
          defaultItemFilters.action,
          defaultItemFilters.bonus,
          defaultItemFilters.reaction,
        ],
        'DND5E.SpellComponents': [
          defaultItemFilters.verbal,
          defaultItemFilters.somatic,
          defaultItemFilters.material,
          defaultItemFilters.concentration,
          defaultItemFilters.ritual,
        ],
        'DND5E.SpellPreparationMode': [defaultItemFilters.prepared],
        'DND5E.SpellSchool': () => getSpellSchoolFilters(),
      },
      [CONSTANTS.TAB_NPC_ABILITIES]: {
        'DND5E.ItemActivationCost': [
          defaultItemFilters.action,
          defaultItemFilters.bonus,
          defaultItemFilters.reaction,
        ],
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
