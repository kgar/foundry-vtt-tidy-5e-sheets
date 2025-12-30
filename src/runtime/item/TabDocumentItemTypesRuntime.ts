import type {
  TabIdDocumentItemTypesOptions,
  TabIdDocumentItemTypesParams,
} from 'src/api';
import { CONSTANTS } from 'src/constants';
import { Inventory } from 'src/features/sections/Inventory';

export class TabDocumentItemTypesRuntime {
  private static _registeredTypes: Record<string, string[]> = {};

  static initOnReady() {
    this._registeredTypes = {
      [CONSTANTS.TAB_CHARACTER_FEATURES]: [CONSTANTS.ITEM_TYPE_FEAT],
      [CONSTANTS.TAB_STATBLOCK]: [CONSTANTS.ITEM_TYPE_FEAT],
      [this.getDocumentTypeKey(
        CONSTANTS.TAB_STATBLOCK,
        CONSTANTS.DOCUMENT_NAME_ACTOR,
        CONSTANTS.SHEET_TYPE_VEHICLE
      )]: [
        CONSTANTS.ITEM_TYPE_FEAT,
        CONSTANTS.ITEM_TYPE_WEAPON,
        CONSTANTS.ITEM_TYPE_EQUIPMENT,
      ],
      [CONSTANTS.TAB_ACTOR_INVENTORY]: Inventory.getInventoryTypes(),
      [CONSTANTS.TAB_ACTOR_SPELLBOOK]: [CONSTANTS.ITEM_TYPE_SPELL],
    };
  }

  static getTypes(tabId: string, document: any): string[] {
    const docSpecificTypeKey = this.getDocumentTypeKey(
      tabId,
      document.documentName,
      document.type
    );
    return (
      this._registeredTypes[docSpecificTypeKey] ??
      this._registeredTypes[tabId] ??
      []
    );
  }

  static getDocumentTypeKey(
    tabId: string,
    documentName: string,
    documentType: string
  ) {
    return `${documentName}-${documentType}|${tabId}`;
  }

  static registerTypes(
    { tabId, documentItemTypes, documentFilter }: TabIdDocumentItemTypesParams,
    options?: TabIdDocumentItemTypesOptions
  ) {
    const key = documentFilter
      ? this.getDocumentTypeKey(
          tabId,
          documentFilter.documentName,
          documentFilter.documentType
        )
      : tabId;

    if (options?.mode === 'override') {
      this._registeredTypes[key] = documentItemTypes;
    } else {
      this._registeredTypes[key] = Array.from(
        new Set((this._registeredTypes[key] ?? []).concat(documentItemTypes))
      );
    }
  }
}
