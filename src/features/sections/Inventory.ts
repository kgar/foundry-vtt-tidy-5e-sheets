import type { InventorySection } from 'src/types/types';

export class Inventory {
  static getDefaultInventoryTypes(): string[] {
    return Object.entries(CONFIG.Item.dataModels)
      .filter(([, model]: [string, any]) => model.metadata?.inventoryItem)
      .sort(
        ([, lhs]: [string, any], [, rhs]: [string, any]) =>
          lhs.metadata.inventoryOrder - rhs.metadata.inventoryOrder
      )
      .map((entry) => entry[0]);
  }

  static getDefaultInventorySections(
    options: Partial<InventorySection> = {}
  ): Record<string, InventorySection> {
    const inventoryTypes = Inventory.getDefaultInventoryTypes();

    const inventory: Record<string, InventorySection> = {};

    for (const type of inventoryTypes) {
      inventory[type] = {
        canCreate: true,
        dataset: { type },
        items: [],
        key: type,
        label: `${CONFIG.Item.typeLabels[type]}Pl`,
        show: true,
        custom: undefined,
        isExternal: false,
        ...options,
      };
    }

    return inventory;
  }
}
