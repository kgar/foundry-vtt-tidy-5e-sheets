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

  private static readonly standardSortGroups = [
    defaultItemSortGroups[CONSTANTS.ITEM_SORT_GROUP_KEY_ALPHABETICAL],
    defaultItemSortGroups[CONSTANTS.ITEM_SORT_GROUP_KEY_MANUAL],
    defaultItemSortGroups[CONSTANTS.ITEM_SORT_GROUP_KEY_EQUIPPED],
  ];

  private static readonly standardSortSchemes = [
    defaultItemSortSchemes[
      CONSTANTS.ITEM_SORT_METHOD_KEY_ALPHABETICAL_ASCENDING
    ],
    defaultItemSortSchemes[
      CONSTANTS.ITEM_SORT_METHOD_KEY_ALPHABETICAL_DESCENDING
    ],
    defaultItemSortSchemes[CONSTANTS.ITEM_SORT_METHOD_KEY_MANUAL],
    defaultItemSortSchemes[CONSTANTS.ITEM_SORT_METHOD_KEY_EQUIPPED],
  ];

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

  // TODO: populate this on sort settings changed / sort admin API calls
  static _documentTabSortSchemesQuadrone: DocumentTypesToSortMethodTabs = {};

  // TODO: populate this on sort settings changed / sort admin API calls
  static _documentTabSortGroupsQuadrone: DocumentTypesToSortGroupTabs = {};

  static getDocumentSortGroupsQuadrone(document: any): SortTabsToSortGroups {
    return ItemSortRuntime._documentTabSortGroupsQuadrone[document.type] ?? {};
  }

  static getDocumentSortGroupQuadrone(
    document: any,
    tabId: string
  ): SortGroup[] {
    return (
      ItemSortRuntime._documentTabSortGroupsQuadrone[document.type]?.[tabId] ??
      this.standardSortGroups
    );
  }

  static getDocumentSortMethodsQuadrone(
    document: any,
    tabId: string
  ): SortMethodScheme[] {
    return (
      ItemSortRuntime._documentTabSortSchemesQuadrone[document.type]?.[tabId] ??
      this.standardSortSchemes
    );
  }

  static getGroupFromMethod(method: string): SortGroup | undefined {
    return ItemSortRuntime._registeredItemSortGroups[
      this._registeredItemSorts[method]?.key
    ];
  }
}
