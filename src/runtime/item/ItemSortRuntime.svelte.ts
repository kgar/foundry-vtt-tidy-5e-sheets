import type {
  SortMethodKeyQuadrone,
  SortMethodScheme,
} from 'src/types/sort.types';
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

  static init() {
    ItemSortRuntime._registeredItemSorts = {
      ...defaultItemSortSchemes,
      // Add more later; include ability to add them through the API when I'm able to clean up the design
    };
  }

  static _documentTabSortSchemesQuadrone: DocumentTypesToSortMethodTabs = {
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
    [CONSTANTS.SHEET_TYPE_CONTAINER]: {
      [CONSTANTS.TAB_CONTAINER_CONTENTS]: [
        defaultItemSortGroups.alphabetical,
        defaultItemSortGroups.manual,
        defaultItemSortGroups.equipped,
      ],
    },
  };

  static getDocumentSortGroupsQuadrone(document: any): SortTabsToSortGroups {
    return ItemSortRuntime._documentTabSortGroupsQuadrone[document.type] ?? {};
  }

  static getDocumentSortMethodsQuadrone(document: any): SortTabsToSortSchemes {
    return ItemSortRuntime._documentTabSortSchemesQuadrone[document.type] ?? {};
  }
}
