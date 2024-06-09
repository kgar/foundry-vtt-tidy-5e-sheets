import { CONSTANTS } from 'src/constants';
import type { InventorySection } from 'src/types/types';

export class Inventory {
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
