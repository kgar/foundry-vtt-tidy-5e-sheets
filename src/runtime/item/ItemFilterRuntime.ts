import { CONSTANTS } from 'src/constants';
import type { ItemFilter } from '../types';
import { defaultItemFilters } from './default-item-filters';
import type { Actor5e } from 'src/types/types';

export class ItemFilterRuntime {
  static _registeredItemFilters: Record<string, ItemFilter> = {
    ...defaultItemFilters,
  };

  static _actorTabFilters: Record<string, Record<string, ItemFilter[]>> = {
    [CONSTANTS.SHEET_TYPE_CHARACTER]: {
      [CONSTANTS.TAB_CHARACTER_INVENTORY]: [
        defaultItemFilters.action,
        defaultItemFilters.bonus,
        defaultItemFilters.reaction,
        defaultItemFilters.equipped,
        // Item Rarities
      ],
      [CONSTANTS.TAB_CHARACTER_SPELLBOOK]: [
        defaultItemFilters.action,
        defaultItemFilters.bonus,
        defaultItemFilters.reaction,
        defaultItemFilters.verbal,
        defaultItemFilters.somatic,
        defaultItemFilters.material,
        defaultItemFilters.concentration,
        defaultItemFilters.ritual,
        defaultItemFilters.prepared,
      ],
      [CONSTANTS.TAB_CHARACTER_FEATURES]: [
        defaultItemFilters.action,
        defaultItemFilters.bonus,
        defaultItemFilters.reaction,
      ],
    },
    [CONSTANTS.SHEET_TYPE_NPC]: {
      [CONSTANTS.TAB_NPC_SPELLBOOK]: [
        defaultItemFilters.action,
        defaultItemFilters.bonus,
        defaultItemFilters.reaction,
        defaultItemFilters.verbal,
        defaultItemFilters.somatic,
        defaultItemFilters.material,
        defaultItemFilters.concentration,
        defaultItemFilters.ritual,
        defaultItemFilters.prepared,
      ],
      [CONSTANTS.TAB_NPC_ABILITIES]: [
        defaultItemFilters.action,
        defaultItemFilters.bonus,
        defaultItemFilters.reaction,
      ],
    },
    [CONSTANTS.SHEET_TYPE_VEHICLE]: {
      // No filters yet ☹
    },
  };

  static getFilter(filterName: ItemFilter['name']): ItemFilter | undefined {
    return ItemFilterRuntime._registeredItemFilters[filterName];
  }

  static getActorFilters(actor: Actor5e): Record<string, ItemFilter[]> {
    return this._actorTabFilters[actor.type] ?? {};
  }
}
