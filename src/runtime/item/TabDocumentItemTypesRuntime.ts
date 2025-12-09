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
      [CONSTANTS.TAB_CHARACTER_FEATURES]: ['feat'],
      [CONSTANTS.TAB_STATBLOCK]: ['feat'],
      [CONSTANTS.TAB_ACTOR_INVENTORY]: Inventory.getInventoryTypes(),
      [CONSTANTS.TAB_ACTOR_SPELLBOOK]: ['spell'],
    };
  }

  static getTypes(tabId: string): string[] {
    return this._registeredTypes[tabId] ?? [];
  }

  static registerTypes(
    { tabId, documentItemTypes }: TabIdDocumentItemTypesParams,
    options?: TabIdDocumentItemTypesOptions
  ) {
    if (options?.mode === 'override') {
      this._registeredTypes[tabId] = documentItemTypes;
    } else {
      this._registeredTypes[tabId] = Array.from(
        new Set((this._registeredTypes[tabId] ?? []).concat(documentItemTypes))
      );
    }
  }
}
