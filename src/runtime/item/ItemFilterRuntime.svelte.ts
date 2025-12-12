import { CONSTANTS } from 'src/constants';
import type {
  ConfiguredItemFilter,
  DocumentFilters,
  DocumentTypesToFilterTabs,
  FilterTabsToCategories,
} from './item.types';
import {
  defaultItemFilters,
  getActionListFilterCategories,
  getAttunementFilters,
  getItemRarityFilters,
  getSourceClassFilters,
  getStandardSpellSchoolFilterCategories,
} from './default-item-filters';
import { debug, error } from 'src/utils/logging';

export class ItemFilterRuntime {
  // TODO: Consider shifting to a singleton class instance rather than static class, to enable runes.
  static init() {}

  static defaultFilterPinsQuadrone: Record<
    string,
    Record<string, Set<string>>
  > = {
    [CONSTANTS.SHEET_TYPE_CONTAINER]: {
      [CONSTANTS.TAB_CONTAINER_CONTENTS]: new Set<string>([
        defaultItemFilters.activationCostAction.name,
        defaultItemFilters.activationCostBonus.name,
        defaultItemFilters.activationCostReaction.name,
        defaultItemFilters.canUse.name,
        defaultItemFilters.magical.name,
      ]),
    },
    [CONSTANTS.SHEET_TYPE_CHARACTER]: {
      [CONSTANTS.TAB_ACTOR_INVENTORY]: new Set<string>([
        defaultItemFilters.activationCostAction.name,
        defaultItemFilters.activationCostBonus.name,
        defaultItemFilters.activationCostReaction.name,
        defaultItemFilters.equipped.name,
      ]),
      [CONSTANTS.TAB_ACTOR_SPELLBOOK]: new Set<string>([
        defaultItemFilters.activationCostAction.name,
        defaultItemFilters.activationCostBonus.name,
        defaultItemFilters.activationCostReaction.name,
        defaultItemFilters.concentration.name,
        defaultItemFilters.canCastSpell.name,
      ]),
      [CONSTANTS.TAB_CHARACTER_FEATURES]: new Set<string>([
        defaultItemFilters.activationCostAction.name,
        defaultItemFilters.activationCostBonus.name,
        defaultItemFilters.activationCostReaction.name,
        defaultItemFilters.canUse.name,
      ]),
      [CONSTANTS.TAB_ACTOR_ACTIONS]: new Set<string>([
        defaultItemFilters.activationCostAction.name,
        defaultItemFilters.activationCostBonus.name,
        defaultItemFilters.activationCostReaction.name,
      ]),
    },
    [CONSTANTS.SHEET_TYPE_NPC]: {
      [CONSTANTS.TAB_NPC_STATBLOCK]: new Set<string>([
        defaultItemFilters.activationCostAction.name,
        defaultItemFilters.activationCostBonus.name,
        defaultItemFilters.activationCostReaction.name,
      ]),
      [CONSTANTS.TAB_ACTOR_INVENTORY]: new Set<string>([
        defaultItemFilters.activationCostAction.name,
        defaultItemFilters.activationCostBonus.name,
        defaultItemFilters.activationCostReaction.name,
        defaultItemFilters.equipped.name,
      ]),
      [CONSTANTS.TAB_ACTOR_SPELLBOOK]: new Set<string>([
        defaultItemFilters.activationCostAction.name,
        defaultItemFilters.activationCostBonus.name,
        defaultItemFilters.activationCostReaction.name,
        defaultItemFilters.concentration.name,
        defaultItemFilters.canCastSpell.name,
      ]),
    },
    [CONSTANTS.SHEET_TYPE_GROUP]: {
      [CONSTANTS.TAB_ACTOR_INVENTORY]: new Set<string>([
        defaultItemFilters.activationCostAction.name,
        defaultItemFilters.activationCostBonus.name,
        defaultItemFilters.activationCostReaction.name,
      ]),
    },
    [CONSTANTS.SHEET_TYPE_ENCOUNTER]: {
      [CONSTANTS.TAB_ACTOR_INVENTORY]: new Set<string>([
        defaultItemFilters.activationCostAction.name,
        defaultItemFilters.activationCostBonus.name,
        defaultItemFilters.activationCostReaction.name,
      ]),
    },
  };

  static _documentTabFilters: DocumentTypesToFilterTabs = {
    [CONSTANTS.SHEET_TYPE_CHARACTER]: {
      [CONSTANTS.TAB_CHARACTER_ATTRIBUTES]: {
        'DND5E.ItemActivationCost': [
          defaultItemFilters.activationCostAction,
          defaultItemFilters.activationCostBonus,
          defaultItemFilters.activationCostReaction,
          defaultItemFilters.activationCostOther,
        ],
        'DND5E.SpellComponents': [
          defaultItemFilters.verbal,
          defaultItemFilters.somatic,
          defaultItemFilters.material,
          defaultItemFilters.concentration,
          defaultItemFilters.ritual,
        ],
        'DND5E.SpellPreparation.Label': [
          defaultItemFilters.prepared,
          defaultItemFilters.canCastSpell,
        ],
        'TIDY5E.ItemFilters.Category.Miscellaneous': () => [
          defaultItemFilters.equipped,
          defaultItemFilters.canUse,
        ],
      },
      [CONSTANTS.TAB_ACTOR_INVENTORY]: {
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
      [CONSTANTS.TAB_ACTOR_SPELLBOOK]: {
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
        'TIDY5E.ItemFilters.Category.Miscellaneous': () => [
          defaultItemFilters.canUse,
        ],
      },
      [CONSTANTS.TAB_ACTOR_ACTIONS]: { ...getActionListFilterCategories() },
    },
    [CONSTANTS.SHEET_TYPE_NPC]: {
      [CONSTANTS.TAB_ACTOR_SPELLBOOK]: {
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
      [CONSTANTS.TAB_ACTOR_INVENTORY]: {
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
    [CONSTANTS.SHEET_TYPE_GROUP]: {
      [CONSTANTS.TAB_ACTOR_INVENTORY]: {
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
    [CONSTANTS.SHEET_TYPE_ENCOUNTER]: {
      [CONSTANTS.TAB_ACTOR_INVENTORY]: {
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

  static _documentTabFiltersQuadrone: DocumentTypesToFilterTabs = {
    [CONSTANTS.SHEET_TYPE_CONTAINER]: {
      [CONSTANTS.TAB_CONTAINER_CONTENTS]: {
        'DND5E.ItemActivationCost': [
          {
            ...defaultItemFilters.activationCostAction,
            pinnedFilterClass: 'hide-under-450',
          },
          {
            ...defaultItemFilters.activationCostBonus,
            pinnedFilterClass: 'hide-under-450',
          },
          {
            ...defaultItemFilters.activationCostReaction,
            pinnedFilterClass: 'hide-under-450',
          },
          { ...defaultItemFilters.canUse, pinnedFilterClass: 'hide-under-400' },
          defaultItemFilters.magical,
        ],
        'DND5E.Rarity': () => getItemRarityFilters(),
        'TIDY5E.ItemFilters.Category.Miscellaneous': () => [
          defaultItemFilters.equipped,
          ...getAttunementFilters(),
        ],
      },
    },
    [CONSTANTS.SHEET_TYPE_CHARACTER]: {
      [CONSTANTS.TAB_ACTOR_INVENTORY]: {
        'DND5E.ItemActivationCost': [
          {
            ...defaultItemFilters.activationCostAction,
            pinnedFilterClass: 'hide-under-400',
          },
          {
            ...defaultItemFilters.activationCostBonus,
            pinnedFilterClass: 'hide-under-400',
          },
          {
            ...defaultItemFilters.activationCostReaction,
            pinnedFilterClass: 'hide-under-400',
          },
          defaultItemFilters.canUse,
          defaultItemFilters.magical,
        ],
        'DND5E.Rarity': () => getItemRarityFilters(),
        'TIDY5E.ItemFilters.Category.Miscellaneous': () => [
          defaultItemFilters.equipped,
          ...getAttunementFilters(),
        ],
      },
      [CONSTANTS.TAB_ACTOR_SPELLBOOK]: {
        'DND5E.ItemActivationCost': [
          {
            ...defaultItemFilters.activationCostAction,
            pinnedFilterClass: 'hide-under-450',
          },
          {
            ...defaultItemFilters.activationCostBonus,
            pinnedFilterClass: 'hide-under-450',
          },
          {
            ...defaultItemFilters.activationCostReaction,
            pinnedFilterClass: 'hide-under-450',
          },
          defaultItemFilters.activationCostOther,
        ],
        ...getStandardSpellSchoolFilterCategories(),
        'DND5E.SpellSourceClass': (document) => getSourceClassFilters(document),
      },
      [CONSTANTS.TAB_CHARACTER_FEATURES]: {
        'DND5E.ItemActivationCost': [
          {
            ...defaultItemFilters.activationCostAction,
            pinnedFilterClass: 'hide-under-400',
          },
          {
            ...defaultItemFilters.activationCostBonus,
            pinnedFilterClass: 'hide-under-400',
          },
          {
            ...defaultItemFilters.activationCostReaction,
            pinnedFilterClass: 'hide-under-400',
          },
        ],
        'TIDY5E.ItemFilters.Category.Miscellaneous': () => [
          defaultItemFilters.canUse,
        ],
      },
      [CONSTANTS.TAB_ACTOR_ACTIONS]: {
        'DND5E.ItemActivationCost': [
          defaultItemFilters.activationCostAction,
          defaultItemFilters.activationCostBonus,
          defaultItemFilters.activationCostReaction,
          defaultItemFilters.activationCostLegendary,
          defaultItemFilters.activationCostMythic,
          defaultItemFilters.activationCostLair,
          defaultItemFilters.activationCostCrew,
          defaultItemFilters.activationCostSpecial,
        ],
        'DND5E.SpellComponents': [
          defaultItemFilters.verbal,
          defaultItemFilters.somatic,
          defaultItemFilters.material,
          defaultItemFilters.concentration,
          defaultItemFilters.ritual,
        ],
        'DND5E.SpellPreparation.Label': [
          defaultItemFilters.prepared,
          defaultItemFilters.canCastSpell,
        ],
        'TIDY5E.ItemFilters.Category.Miscellaneous': () => [
          defaultItemFilters.equipped,
          defaultItemFilters.canUse,
        ],
      },
    },
    [CONSTANTS.SHEET_TYPE_NPC]: {
      [CONSTANTS.TAB_NPC_STATBLOCK]: {
        'DND5E.ItemActivationCost': [
          {
            ...defaultItemFilters.activationCostAction,
            pinnedFilterClass: 'hide-under-400',
          },
          {
            ...defaultItemFilters.activationCostBonus,
            pinnedFilterClass: 'hide-under-400',
          },
          {
            ...defaultItemFilters.activationCostReaction,
            pinnedFilterClass: 'hide-under-400',
          },
          defaultItemFilters.activationCostLegendary,
          defaultItemFilters.activationCostMythic,
          defaultItemFilters.activationCostLair,
          defaultItemFilters.activationCostCrew,
          defaultItemFilters.activationCostSpecial,
        ],
        'DND5E.SpellComponents': [
          defaultItemFilters.verbal,
          defaultItemFilters.somatic,
          defaultItemFilters.material,
          defaultItemFilters.concentration,
          defaultItemFilters.ritual,
        ],
        'DND5E.SpellPreparation.Mode': [
          defaultItemFilters.prepared,
          defaultItemFilters.canCastSpell,
        ],
        'TIDY5E.ItemFilters.Category.Miscellaneous': () => [
          defaultItemFilters.equipped,
          defaultItemFilters.canUse,
        ],
      },
      [CONSTANTS.TAB_ACTOR_INVENTORY]: {
        'DND5E.ItemActivationCost': [
          {
            ...defaultItemFilters.activationCostAction,
            pinnedFilterClass: 'hide-under-450',
          },
          {
            ...defaultItemFilters.activationCostBonus,
            pinnedFilterClass: 'hide-under-450',
          },
          {
            ...defaultItemFilters.activationCostReaction,
            pinnedFilterClass: 'hide-under-450',
          },
          defaultItemFilters.canUse,
          defaultItemFilters.magical,
        ],
        'DND5E.Rarity': () => getItemRarityFilters(),
        'TIDY5E.ItemFilters.Category.Miscellaneous': () => [
          defaultItemFilters.equipped,
          ...getAttunementFilters(),
        ],
      },
      [CONSTANTS.TAB_ACTOR_SPELLBOOK]: {
        'DND5E.ItemActivationCost': [
          {
            ...defaultItemFilters.activationCostAction,
            pinnedFilterClass: 'hide-under-450',
          },
          {
            ...defaultItemFilters.activationCostBonus,
            pinnedFilterClass: 'hide-under-450',
          },
          {
            ...defaultItemFilters.activationCostReaction,
            pinnedFilterClass: 'hide-under-450',
          },
          defaultItemFilters.activationCostOther,
        ],
        ...getStandardSpellSchoolFilterCategories(),
        'DND5E.SpellSourceClass': (document) => getSourceClassFilters(document),
      },
    },
    [CONSTANTS.SHEET_TYPE_GROUP]: {
      [CONSTANTS.TAB_ACTOR_INVENTORY]: {
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
    [CONSTANTS.SHEET_TYPE_ENCOUNTER]: {
      [CONSTANTS.TAB_ACTOR_INVENTORY]: {
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

  static getDocumentFilters(document: any): FilterTabsToCategories {
    return ItemFilterRuntime._documentTabFilters[document.type] ?? {};
  }

  static getDocumentFiltersQuadrone(document: any): FilterTabsToCategories {
    return ItemFilterRuntime._documentTabFiltersQuadrone[document.type] ?? {};
  }

  static getPinnedFiltersForTab(
    filterPins: Record<string, Set<string>>,
    filterData: DocumentFilters,
    tabId: string
  ) {
    let pinnedFilters = new Map<string, ConfiguredItemFilter>();

    try {
      let tabFilterPins = filterPins[tabId] ?? new Set<string>();

      for (let categoryFilters of Object.values(filterData[tabId] ?? {})) {
        for (let filter of categoryFilters) {
          if (tabFilterPins.has(filter.name)) {
            pinnedFilters.set(filter.name, filter);
          }
        }
      }
    } catch (e) {
      error(
        `An error occurred while searching for pinned filters on the ${tabId} tab.`,
        false,
        e
      );
      debug('Filter pins error troubleshooting info', {
        filterData,
        filterPins,
        tabId,
      });
    }

    return Array.from(pinnedFilters.values());
  }
}
