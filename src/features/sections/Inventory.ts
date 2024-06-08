import { CONSTANTS } from 'src/constants';
import type { InventorySection } from 'src/types/types';

export class Inventory {
  // TODO: Consider providing this kind of list specifically for testing so that tests can be prepared before having access to the Page object.
  // static get inventoryItemTypes() {
  //   return [
  //     CONSTANTS.ITEM_TYPE_WEAPON,
  //     CONSTANTS.ITEM_TYPE_EQUIPMENT,
  //     CONSTANTS.ITEM_TYPE_CONSUMABLE,
  //     CONSTANTS.ITEM_TYPE_TOOL,
  //     CONSTANTS.ITEM_TYPE_CONTAINER,
  //     CONSTANTS.ITEM_TYPE_LOOT,
  //   ];
  // }

  static getInventoryMetadataSections(
    options?: Partial<InventorySection>
  ): Record<string, InventorySection> {
    const inventoryTypes = Object.entries(CONFIG.Item.dataModels)
      .filter(([, model]: [any, any]) => model.metadata?.inventoryItem)
      .sort(
        ([, lhs]: [any, any], [, rhs]: [any, any]) =>
          lhs.metadata.inventoryOrder - rhs.metadata.inventoryOrder
      );

    const inventory: Record<string, InventorySection> = {};

    for (const [type] of inventoryTypes) {
      inventory[type] = {
        canCreate: true,
        dataset: { type },
        items: [],
        key: type,
        label: `${CONFIG.Item.typeLabels[type]}Pl`,
        show: true,
        custom: undefined,
        isExternal: false,
      };
    }

    return inventory;
  }

  static getInventoryTypeLabel(type: string) {
    return `${CONFIG.Item.typeLabels[type]}Pl`;
  }
}
