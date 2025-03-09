import { CONSTANTS } from 'src/constants';
import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import type {
  SortGroup,
  SortMethodKeyQuadrone,
  SortMethodScheme,
} from 'src/types/sort.types';

export const defaultItemSortSchemes = {
  [CONSTANTS.ITEM_SORT_METHOD_KEY_ALPHABETICAL_ASCENDING]: {
    key: 'a',
    icon: 'fa-solid fa-arrow-down-a-z',
    name: 'alpha-ascending',
    onClick: async (_, doc, currentTabId) => {
      await SheetPreferencesService.setDocumentTypeTabPreference(
        doc.type,
        currentTabId,
        'sort',
        'd'
      );
    },
    tooltip: 'TIDY5E.SortMethod.AlphabeticalAscending',
    comparator: (a, b) => a.name.localeCompare(b.name, game.i18n.lang),
  },
  [CONSTANTS.ITEM_SORT_METHOD_KEY_ALPHABETICAL_DESCENDING]: {
    key: 'd',
    icon: 'fa-solid fa-arrow-up-z-a',
    name: 'alpha-descending',
    onClick: async (_, doc, currentTabId) => {
      await SheetPreferencesService.setDocumentTypeTabPreference(
        doc.type,
        currentTabId,
        'sort',
        'a'
      );
    },
    tooltip: 'TIDY5E.SortMethod.AlphabeticalDescending',
    comparator: (a, b) => b.name.localeCompare(a.name, game.i18n.lang),
  },
  [CONSTANTS.ITEM_SORT_METHOD_KEY_MANUAL]: {
    key: 'm',
    icon: 'fa-solid fa-arrow-down-short-wide',
    name: 'manual',
    onClick: 'menu',
    tooltip: 'SIDEBAR.SortModeManual',
    comparator: (a, b) => (a.sort || 0) - (b.sort || 0),
  },
  [CONSTANTS.ITEM_SORT_METHOD_KEY_PRIORITY]: {
    key: 'priority',
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
  },
  [CONSTANTS.ITEM_SORT_METHOD_KEY_EQUIPPED]: {
    key: 'equipped',
    icon: 'fa-solid fa-hand-fist equip-icon',
    name: 'priority',
    onClick: 'menu',
    tooltip: 'SIDEBAR.SortModePriority',
    comparator: (a, b) =>
      b.system.equipped - a.system.equipped ||
      a.name.localeCompare(b.name, game.i18n.lang),
  },
  [CONSTANTS.ITEM_SORT_METHOD_KEY_PREPARED]: {
    key: 'prepared',
    icon: 'fa-solid fa-book',
    name: 'prepared',
    onClick: 'menu',
    tooltip: 'DND5E.Prepared',
    comparator: (a, b) =>
      b.system.preparation?.prepared - a.system.preparation?.prepared ||
      a.name.localeCompare(b.name, game.i18n.lang),
  },
} satisfies Record<SortMethodKeyQuadrone, SortMethodScheme>;

export const defaultItemSortGroups = {
  alphabetical: {
    key: 'a',
    label: 'TIDY5E.SortMenu.OptionAlphabetical',
    onSelect: async (doc, currentTabId) => {
      await SheetPreferencesService.setDocumentTypeTabPreference(
        doc.type,
        currentTabId,
        'sort',
        'a'
      );
    },
  },
  manual: {
    key: 'm',
    label: 'TIDY5E.SortMenu.OptionManual',
    onSelect: async (doc, currentTabId) => {
      await SheetPreferencesService.setDocumentTypeTabPreference(
        doc.type,
        currentTabId,
        'sort',
        'm'
      );
    },
  },
  priority: {
    key: 'priority',
    label: 'TIDY5E.SortMenu.OptionPriority',
    onSelect: async (doc, currentTabId) => {
      await SheetPreferencesService.setDocumentTypeTabPreference(
        doc.type,
        currentTabId,
        'sort',
        'priority'
      );
    },
  },
  equipped: {
    key: 'equipped',
    label: 'DND5E.Equipped',
    onSelect: async (doc) => {
      await SheetPreferencesService.setDocumentTypeTabPreference(
        doc.type,
        CONSTANTS.TAB_CONTAINER_CONTENTS,
        'sort',
        'equipped'
      );
    },
  },
  prepared: {
    key: 'prepared',
    label: 'DND5E.Prepared',
    onSelect: async (doc) => {
      await SheetPreferencesService.setDocumentTypeTabPreference(
        doc.type,
        CONSTANTS.TAB_CONTAINER_CONTENTS,
        'sort',
        'prepared'
      );
    },
  },
} satisfies Record<string, SortGroup>;
