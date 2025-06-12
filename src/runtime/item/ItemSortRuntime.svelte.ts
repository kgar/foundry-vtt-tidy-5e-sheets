import type { SortGroup, SortMethodScheme } from 'src/types/sort.types';
import {
  defaultItemSortGroups,
  defaultItemSortSchemes,
} from './default-item-sorts';
import { CONSTANTS } from 'src/constants';
import type {
  DocumentTypesToSortGroupTabs,
  DocumentTypesToSortMethodTabs,
  SortTabsToSortGroups,
  SortTabsToSortSchemes,
} from './item.types';

export class ItemSortRuntime {
  static _registeredItemSorts: Record<string, SortMethodScheme> = {};
  static _registeredItemSortGroups: Record<string, SortGroup> = {};

  static init() {
    ItemSortRuntime._registeredItemSorts = {
      ...defaultItemSortSchemes,
      // Add more later; include ability to add them through the API when I'm able to clean up the design
    };
    ItemSortRuntime._registeredItemSortGroups = {
      ...defaultItemSortGroups,
      // Add more later; include ability to add them through the API when I'm able to clean up the design
    };
  }

  static _documentTabSortSchemesQuadrone: DocumentTypesToSortMethodTabs = {
    [CONSTANTS.SHEET_TYPE_CHARACTER]: {
      [CONSTANTS.TAB_ACTOR_INVENTORY]: [
        defaultItemSortSchemes[
          CONSTANTS.ITEM_SORT_METHOD_KEY_ALPHABETICAL_ASCENDING
        ],
        defaultItemSortSchemes[
          CONSTANTS.ITEM_SORT_METHOD_KEY_ALPHABETICAL_DESCENDING
        ],
        defaultItemSortSchemes[CONSTANTS.ITEM_SORT_METHOD_KEY_MANUAL],
        defaultItemSortSchemes[CONSTANTS.ITEM_SORT_METHOD_KEY_EQUIPPED],
      ],
      [CONSTANTS.TAB_ACTOR_SPELLBOOK]: [
        defaultItemSortSchemes[
          CONSTANTS.ITEM_SORT_METHOD_KEY_ALPHABETICAL_ASCENDING
        ],
        defaultItemSortSchemes[
          CONSTANTS.ITEM_SORT_METHOD_KEY_ALPHABETICAL_DESCENDING
        ],
        defaultItemSortSchemes[CONSTANTS.ITEM_SORT_METHOD_KEY_MANUAL],
        defaultItemSortSchemes[CONSTANTS.ITEM_SORT_METHOD_KEY_PREPARED],
        defaultItemSortSchemes[CONSTANTS.ITEM_SORT_METHOD_KEY_PRIORITY],
      ],
    },
    [CONSTANTS.SHEET_TYPE_CONTAINER]: {
      [CONSTANTS.TAB_CONTAINER_CONTENTS]: [
        defaultItemSortSchemes[
          CONSTANTS.ITEM_SORT_METHOD_KEY_ALPHABETICAL_ASCENDING
        ],
        defaultItemSortSchemes[
          CONSTANTS.ITEM_SORT_METHOD_KEY_ALPHABETICAL_DESCENDING
        ],
        defaultItemSortSchemes[CONSTANTS.ITEM_SORT_METHOD_KEY_MANUAL],
        defaultItemSortSchemes[CONSTANTS.ITEM_SORT_METHOD_KEY_EQUIPPED],
      ],
    },
  };

  static _documentTabSortGroupsQuadrone: DocumentTypesToSortGroupTabs = {
    [CONSTANTS.SHEET_TYPE_CHARACTER]: {
      [CONSTANTS.TAB_ACTOR_INVENTORY]: [
        defaultItemSortGroups[CONSTANTS.ITEM_SORT_GROUP_KEY_ALPHABETICAL],
        defaultItemSortGroups[CONSTANTS.ITEM_SORT_GROUP_KEY_MANUAL],
        defaultItemSortGroups[CONSTANTS.ITEM_SORT_GROUP_KEY_EQUIPPED],
      ],
      [CONSTANTS.TAB_ACTOR_SPELLBOOK]: [
        defaultItemSortGroups[CONSTANTS.ITEM_SORT_GROUP_KEY_ALPHABETICAL],
        defaultItemSortGroups[CONSTANTS.ITEM_SORT_GROUP_KEY_MANUAL],
        defaultItemSortGroups[CONSTANTS.ITEM_SORT_GROUP_KEY_PREPARED],
        defaultItemSortGroups[CONSTANTS.ITEM_SORT_GROUP_KEY_PRIORITY],
      ],
    },
    [CONSTANTS.SHEET_TYPE_CONTAINER]: {
      [CONSTANTS.TAB_CONTAINER_CONTENTS]: [
        defaultItemSortGroups[CONSTANTS.ITEM_SORT_GROUP_KEY_ALPHABETICAL],
        defaultItemSortGroups[CONSTANTS.ITEM_SORT_GROUP_KEY_MANUAL],
        defaultItemSortGroups[CONSTANTS.ITEM_SORT_GROUP_KEY_EQUIPPED],
      ],
    },
  };

  static getDocumentSortGroupsQuadrone(document: any): SortTabsToSortGroups {
    return ItemSortRuntime._documentTabSortGroupsQuadrone[document.type] ?? {};
  }

  static getDocumentSortGroupQuadrone(
    document: any,
    tabId: string
  ): SortGroup[] {
    return (
      ItemSortRuntime._documentTabSortGroupsQuadrone[document.type]?.[
        tabId
      ] ?? [
        defaultItemSortGroups[CONSTANTS.ITEM_SORT_GROUP_KEY_ALPHABETICAL],
        defaultItemSortGroups[CONSTANTS.ITEM_SORT_GROUP_KEY_MANUAL],
      ]
    );
  }

  static getDocumentSortMethodsQuadrone(
    document: any,
    tabId: string
  ): SortMethodScheme[] {
    return (
      ItemSortRuntime._documentTabSortSchemesQuadrone[document.type]?.[
        tabId
      ] ?? [
        defaultItemSortSchemes[
          CONSTANTS.ITEM_SORT_METHOD_KEY_ALPHABETICAL_ASCENDING
        ],
        defaultItemSortSchemes[
          CONSTANTS.ITEM_SORT_METHOD_KEY_ALPHABETICAL_DESCENDING
        ],
        defaultItemSortSchemes[CONSTANTS.ITEM_SORT_METHOD_KEY_MANUAL],
      ]
    );
  }

  static getGroupFromMethod(method: string): SortGroup | undefined {
    return ItemSortRuntime._registeredItemSortGroups[
      this._registeredItemSorts[method]?.key
    ];
  }
}
