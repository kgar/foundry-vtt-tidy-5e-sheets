import type { ContainerItemContext, Item5e } from 'src/types/item.types';
import type {
  InventorySection,
  ItemContextContainerContents,
} from 'src/types/types';
import { Inventory } from './Inventory';
import { SheetSections } from './SheetSections';
import { CONSTANTS } from 'src/constants';
import type { SectionConfig } from './sections.types';

export class Container {
  static async getContainerContents(
    item: Item5e
  ): Promise<ItemContextContainerContents> {
    return {
      capacity: await item.system.computeCapacity(),
      currency: item.system.currency,
      inventory: getInventory(item.system.contents.values()),
    };
  }

  static async applySectionConfigsToContainerItemContexts(
    itemContext: Record<string, ContainerItemContext>,
    sectionConfig?: SectionConfig,
    
  ) {
    // go through each item context and process their inventory if they have one
    for (const ctx of Object.values(itemContext)) {
      if (!ctx.containerContents?.inventory?.length) {
        continue;
      }

      // Find a common place for this
      ctx.containerContents.inventory = SheetSections.sortKeyedSections(
        ctx.containerContents.inventory,
        sectionConfigs?.[CONSTANTS.TAB_CONTAINER_CONTENTS]
      );
    }
  }
}

function getInventory(items: Iterable<Item5e>): InventorySection[] {
  const inventory = Inventory.getDefaultInventorySections();
  const inventoryTypes = Inventory.getDefaultInventoryTypes();

  for (const item of items) {
    Inventory.applyInventoryItemToSection(inventory, item, inventoryTypes, {
      canCreate: false,
    });
  }

  return Object.values(inventory);
}
