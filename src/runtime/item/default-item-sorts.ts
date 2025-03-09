import { CONSTANTS } from 'src/constants';
import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import type {
  SortGroup,
  SortMethodKeyQuadrone,
  SortMethodScheme,
} from 'src/types/sort.types';
import { getContext } from 'svelte';

export const defaultItemSortSchemes = {
  alphaAscending: {
    key: 'a',
    icon: 'fa-solid fa-arrow-down-a-z',
    name: 'alpha-ascending',
    onClick: async (_, doc) => {
      const tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);
      await SheetPreferencesService.setDocumentTypeTabPreference(
        doc.type,
        tabId,
        'sort',
        'd'
      );
    },
    tooltip: 'TIDY5E.SortMethod.AlphabeticalAscending',
    comparator: (a, b) => a.name.localeCompare(b.name, game.i18n.lang),
  },
  alphaDescending: {
    key: 'd',
    icon: 'fa-solid fa-arrow-up-z-a',
    name: 'alpha-descending',
    onClick: async (_, doc) => {
      const tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);
      await SheetPreferencesService.setDocumentTypeTabPreference(
        doc.type,
        tabId,
        'sort',
        'a'
      );
    },
    tooltip: 'TIDY5E.SortMethod.AlphabeticalDescending',
    comparator: (a, b) => b.name.localeCompare(a.name, game.i18n.lang),
  },
  manual: {
    key: 'm',
    icon: 'fa-solid fa-arrow-down-short-wide',
    name: 'manual',
    onClick: 'menu',
    tooltip: 'SIDEBAR.SortModeManual',
    comparator: (a, b) => (a.sort || 0) - (b.sort || 0),
  },
  priority: {
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
  equipped: {
    key: 'equipped',
    icon: 'fa-solid fa-hand-fist equip-icon',
    name: 'priority',
    onClick: 'menu',
    tooltip: 'SIDEBAR.SortModePriority',
    comparator: (a, b) =>
      b.system.equipped - a.system.equipped ||
      a.name.localeCompare(b.name, game.i18n.lang),
  },
  prepared: {
    key: 'prepared',
    icon: 'fa-solid fa-book',
    name: 'prepared',
    onClick: 'menu',
    tooltip: 'DND5E.Prepared',
    comparator: (a, b) =>
      b.system.preparation?.prepared - a.system.preparation?.prepared ||
      a.name.localeCompare(b.name, game.i18n.lang),
  },
} satisfies Record<string, SortMethodScheme>;

export const defaultItemSortGroups = {
  alphabetical: {
    key: 'a',
    label: 'TIDY5E.SortMenu.OptionAlphabetical',
    onSelect: async (doc, group) => {
      await SheetPreferencesService.setDocumentTypeTabPreference(
        doc.type,
        CONSTANTS.TAB_CONTAINER_CONTENTS,
        'sort',
        'a'
      );
    },
  },
  manual: {
    key: 'm',
    label: 'TIDY5E.SortMenu.OptionManual',
    onSelect: async (doc) => {
      await SheetPreferencesService.setDocumentTypeTabPreference(
        doc.type,
        CONSTANTS.TAB_CONTAINER_CONTENTS,
        'sort',
        'm'
      );
    },
  },
  priority: {
    key: 'priority',
    label: 'TIDY5E.SortMenu.OptionPriority',
    onSelect: async (doc) => {
      await SheetPreferencesService.setDocumentTypeTabPreference(
        doc.type,
        CONSTANTS.TAB_CONTAINER_CONTENTS,
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
