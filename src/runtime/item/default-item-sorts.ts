import { CONSTANTS } from 'src/constants';
import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import type { SortGroup, SortMethodScheme } from 'src/types/sort.types';

export const defaultItemSortSchemes = {
  [CONSTANTS.ITEM_SORT_METHOD_KEY_ALPHABETICAL_ASCENDING]: {
    key: CONSTANTS.ITEM_SORT_METHOD_KEY_ALPHABETICAL_ASCENDING,
    icon: 'fa-solid fa-arrow-down-a-z',
    name: 'alpha-ascending',
    onClick: async (_, doc, currentTabId) => {
      await SheetPreferencesService.setDocumentTypeTabPreference(
        doc.type,
        currentTabId,
        'sort',
        CONSTANTS.ITEM_SORT_METHOD_KEY_ALPHABETICAL_DESCENDING
      );
    },
    tooltip: 'TIDY5E.SortMethod.AlphabeticalAscending',
    comparator: (a, b) => a.name.localeCompare(b.name, game.i18n.lang),
    group: CONSTANTS.ITEM_SORT_GROUP_KEY_ALPHABETICAL,
  },
  [CONSTANTS.ITEM_SORT_METHOD_KEY_ALPHABETICAL_DESCENDING]: {
    key: CONSTANTS.ITEM_SORT_METHOD_KEY_ALPHABETICAL_DESCENDING,
    icon: 'fa-solid fa-arrow-up-z-a',
    name: 'alpha-descending',
    onClick: async (_, doc, currentTabId) => {
      await SheetPreferencesService.setDocumentTypeTabPreference(
        doc.type,
        currentTabId,
        'sort',
        CONSTANTS.ITEM_SORT_METHOD_KEY_ALPHABETICAL_ASCENDING
      );
    },
    tooltip: 'TIDY5E.SortMethod.AlphabeticalDescending',
    comparator: (a, b) => b.name.localeCompare(a.name, game.i18n.lang),
    group: CONSTANTS.ITEM_SORT_GROUP_KEY_ALPHABETICAL,
  },
  [CONSTANTS.ITEM_SORT_METHOD_KEY_MANUAL]: {
    key: CONSTANTS.ITEM_SORT_METHOD_KEY_MANUAL,
    icon: 'fa-solid fa-arrow-down-short-wide',
    name: 'manual',
    onClick: 'menu',
    tooltip: 'SIDEBAR.SortModeManual',
    comparator: (a, b) => (a.sort || 0) - (b.sort || 0),
    group: CONSTANTS.ITEM_SORT_GROUP_KEY_MANUAL,
  },
  [CONSTANTS.ITEM_SORT_METHOD_KEY_PRIORITY]: {
    key: CONSTANTS.ITEM_SORT_METHOD_KEY_PRIORITY,
    icon: 'fa-solid fa-arrow-down-1-9',
    name: 'priority',
    onClick: 'menu',
    tooltip: 'SIDEBAR.SortModePriority',
    comparator: (a, b) =>
      a.linkedName?.localeCompare(b.linkedName, game.i18n.lang) ||
      a.level - b.level ||
      a.preparationMode - b.preparationMode ||
      a.prepared - b.prepared ||
      a.name.localeCompare(b.name, game.i18n.lang),
    group: CONSTANTS.ITEM_SORT_GROUP_KEY_PRIORITY,
  },
  [CONSTANTS.ITEM_SORT_METHOD_KEY_EQUIPPED]: {
    key: CONSTANTS.ITEM_SORT_METHOD_KEY_EQUIPPED,
    icon: 'fa-solid fa-hand-fist equip-icon',
    name: 'priority',
    onClick: 'menu',
    tooltip: 'DND5E.Equipped',
    comparator: (a, b) =>
      b.system.equipped - a.system.equipped ||
      a.name.localeCompare(b.name, game.i18n.lang),
    group: CONSTANTS.ITEM_SORT_GROUP_KEY_EQUIPPED,
  },
  [CONSTANTS.ITEM_SORT_METHOD_KEY_PREPARED]: {
    key: CONSTANTS.ITEM_SORT_METHOD_KEY_PREPARED,
    icon: 'fa-solid fa-book',
    name: 'prepared',
    onClick: 'menu',
    tooltip: 'DND5E.Prepared',
    comparator: (a, b) =>
      b.system.preparation?.prepared - a.system.preparation?.prepared ||
      +(b.system.preparation.mode === 'always') -
        +(a.system.preparation.mode === 'always') ||
      a.name.localeCompare(b.name, game.i18n.lang),
    group: CONSTANTS.ITEM_SORT_GROUP_KEY_PREPARED,
  },
} satisfies Record<string, SortMethodScheme>;

export const defaultItemSortGroups = {
  [CONSTANTS.ITEM_SORT_GROUP_KEY_ALPHABETICAL]: {
    key: CONSTANTS.ITEM_SORT_GROUP_KEY_ALPHABETICAL,
    label: 'TIDY5E.SortMenu.OptionAlphabetical',
    onSelect: async (doc, currentTabId) => {
      await SheetPreferencesService.setDocumentTypeTabPreference(
        doc.type,
        currentTabId,
        'sort',
        CONSTANTS.ITEM_SORT_METHOD_KEY_ALPHABETICAL_ASCENDING
      );
    },
  },
  [CONSTANTS.ITEM_SORT_GROUP_KEY_MANUAL]: {
    key: CONSTANTS.ITEM_SORT_GROUP_KEY_MANUAL,
    label: 'TIDY5E.SortMenu.OptionManual',
    onSelect: async (doc, currentTabId) => {
      await SheetPreferencesService.setDocumentTypeTabPreference(
        doc.type,
        currentTabId,
        'sort',
        CONSTANTS.ITEM_SORT_METHOD_KEY_MANUAL
      );
    },
  },
  [CONSTANTS.ITEM_SORT_GROUP_KEY_PRIORITY]: {
    key: CONSTANTS.ITEM_SORT_GROUP_KEY_PRIORITY,
    label: 'TIDY5E.SortMenu.OptionPriority',
    onSelect: async (doc, currentTabId) => {
      await SheetPreferencesService.setDocumentTypeTabPreference(
        doc.type,
        currentTabId,
        'sort',
        CONSTANTS.ITEM_SORT_METHOD_KEY_PRIORITY
      );
    },
  },
  [CONSTANTS.ITEM_SORT_GROUP_KEY_EQUIPPED]: {
    key: CONSTANTS.ITEM_SORT_GROUP_KEY_EQUIPPED,
    label: 'DND5E.Equipped',
    onSelect: async (doc, currentTabId) => {
      await SheetPreferencesService.setDocumentTypeTabPreference(
        doc.type,
        currentTabId,
        'sort',
        CONSTANTS.ITEM_SORT_METHOD_KEY_EQUIPPED
      );
    },
  },
  [CONSTANTS.ITEM_SORT_GROUP_KEY_PREPARED]: {
    key: CONSTANTS.ITEM_SORT_GROUP_KEY_PREPARED,
    label: 'DND5E.Prepared',
    onSelect: async (doc, currentTabId) => {
      await SheetPreferencesService.setDocumentTypeTabPreference(
        doc.type,
        currentTabId,
        'sort',
        CONSTANTS.ITEM_SORT_METHOD_KEY_PREPARED
      );
    },
  },
} satisfies Record<string, SortGroup>;
