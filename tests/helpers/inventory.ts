import { CONSTANTS } from 'src/constants';

/**
 * TESTS ONLY. Helpers related to inventory.
 */
export class InventoryHelpers {
  static getSupportedInventoryTypesForTest(): string[] {
    return [
      CONSTANTS.ITEM_TYPE_WEAPON,
      CONSTANTS.ITEM_TYPE_EQUIPMENT,
      CONSTANTS.ITEM_TYPE_CONSUMABLE,
      CONSTANTS.ITEM_TYPE_TOOL,
      CONSTANTS.ITEM_TYPE_CONTAINER,
      CONSTANTS.ITEM_TYPE_LOOT,
    ];
  }
}
