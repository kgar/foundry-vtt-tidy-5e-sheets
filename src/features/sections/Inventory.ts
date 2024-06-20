import { CONSTANTS } from 'src/constants';

export class Inventory {
  static get inventoryItemTypes() {
    return [
      CONSTANTS.ITEM_TYPE_WEAPON,
      CONSTANTS.ITEM_TYPE_EQUIPMENT,
      CONSTANTS.ITEM_TYPE_CONSUMABLE,
      CONSTANTS.ITEM_TYPE_TOOL,
      CONSTANTS.ITEM_TYPE_CONTAINER,
      CONSTANTS.ITEM_TYPE_LOOT,
    ];
  }

  static getInventoryTypeLabel(type: string) {
    return `${CONFIG.Item.typeLabels[type]}Pl`;
  }
}
