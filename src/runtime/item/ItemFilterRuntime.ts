import { CONSTANTS } from 'src/constants';
import type {
  ActorTypesToFilterTabs,
  FilterTabsToCategories,
  ItemFilter,
} from '../types';
import {
  defaultItemFilters,
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
          // Item Rarities
        ],
        'DND5E.Rarity': () => getItemRarityFilters(),
        'TIDY5E.ItemFilters.Category.Miscellaneous': [
          defaultItemFilters.equipped,
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
          defaultItemFilters.concentration,
          defaultItemFilters.ritual,
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
    // TODO: Figure out how to materialize registered item filters
    return ItemFilterRuntime._registeredItemFilters[filterName];
  }

  static getActorFilters(actor: Actor5e): FilterTabsToCategories {
    return ItemFilterRuntime._actorTabFilters[actor.type] ?? {};
  }
}
