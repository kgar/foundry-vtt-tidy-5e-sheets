import { TidyFlags } from 'src/api';
import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Item5e } from 'src/types/item.types';
import type { ActorInventoryTypes, ContainerCapacityContext, ContainerPanelItemContext, InventorySection } from 'src/types/types';
import { error } from 'src/utils/logging';

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

  static applyInventoryItemToSection(
    inventory: Record<string, InventorySection>,
    item: Item5e,
    customSectionOptions: Partial<InventorySection>
  ) {
    const customSectionName = TidyFlags.section.get(item);

    if (!customSectionName) {
      inventory[item.type].items.push(item);
      return;
    }

    const customSection: InventorySection = (inventory[customSectionName] ??= {
      dataset: { [TidyFlags.section.prop]: customSectionName },
      items: [],
      label: customSectionName,
      canCreate: true,
      key: customSectionName,
      custom: {
        section: customSectionName,
        creationItemTypes: Inventory.inventoryItemTypes,
      },
      show: true,
      ...customSectionOptions,
    });

    customSection.items.push(item);
  }

  static getInventoryTypeLabel(type: string) {
    return `${CONFIG.Item.typeLabels[type]}Pl`;
  }

  static createDefaultActorInventoryTypes(
    options: Partial<InventorySection> = {}
  ) {
    const inventory: ActorInventoryTypes = {};
    for (const type of Inventory.inventoryItemTypes) {
      inventory[type] = FoundryAdapter.mergeObject(
        {
          label: Inventory.getInventoryTypeLabel(type),
          items: [],
          dataset: { type },
          canCreate: true,
          key: type,
          show: true,
        },
        options
      );
    }
    return inventory;
  }

  static async getContainerPanelItems(items: Item5e[]) {
    let containerPanelItems: ContainerPanelItemContext[] = [];
    try {
      let containers = items
        .filter((i: Item5e) => i.type === CONSTANTS.ITEM_TYPE_CONTAINER)
        .toSorted((a: Item5e, b: Item5e) => a.sort - b.sort);

      for (let container of containers) {
        const capacity =
          (await container.system.computeCapacity()) as ContainerCapacityContext;
        containerPanelItems.push({
          container,
          ...capacity,
        });
      }
    } catch (e) {
      error(
        'An error occurred while preparing containers for the container panel',
        false,
        e
      );
    }
    return containerPanelItems;
  }
}
