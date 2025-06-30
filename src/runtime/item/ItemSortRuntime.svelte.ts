import type { SortMethodScheme } from 'src/types/sort.types';
import { defaultItemSortSchemes } from './default-item-sorts';
import { CONSTANTS } from 'src/constants';
import type { DocumentTypesToSortMethodTabs } from './item.types';

export class ItemSortRuntime {
  static _registeredItemSorts: Record<string, SortMethodScheme> = {};

  static init() {
    ItemSortRuntime._registeredItemSorts = {
      ...defaultItemSortSchemes,
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
}
