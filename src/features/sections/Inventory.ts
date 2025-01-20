import { CONSTANTS } from 'src/constants';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type { Item5e } from 'src/types/item.types';
import type {
  ContainerCapacityContext,
  ContainerPanelItemContext,
  InventorySection,
} from 'src/types/types';
import { error } from 'src/utils/logging';
import { SheetSections } from './SheetSections';

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

  static isInventoryType(item: Item5e) {
    return !!CONFIG.Item.dataModels[item.type]?.metadata?.inventoryItem;
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
        label: `${
          CONFIG.Item.typeLabels[type as keyof typeof CONFIG.Item.typeLabels]
        }Pl`,
        show: true,
        custom: undefined,
        isExternal: false,
        ...options,
      };
    }

    return inventory;
  }

  static applyInventoryItemToSection(
    inventory: Record<string, InventorySection>,
    item: Item5e,
    defaultInventoryTypes: string[],
    customSectionOptions: Partial<InventorySection>
  ) {
    const customSectionName = TidyFlags.section.get(item);

    if (!customSectionName) {
      inventory[item.type].items.push(item);
      return;
    }

    const customSection: InventorySection = (inventory[customSectionName] ??=
      Inventory.createInventorySection(
        customSectionName,
        defaultInventoryTypes,
        customSectionOptions
      ));

    customSection.items.push(item);
  }

  static createInventorySection(
    customSectionName: string,
    defaultInventoryTypes: string[],
    customSectionOptions: Partial<InventorySection>
  ): InventorySection {
    return {
      dataset: { [TidyFlags.section.prop]: customSectionName },
      items: [],
      label: customSectionName,
      canCreate: true,
      key: customSectionName,
      custom: {
        section: customSectionName,
        creationItemTypes: [...defaultInventoryTypes],
      },
      show: true,
      ...customSectionOptions,
    };
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

  static async getContainerContentsInventory(
    container: Item5e,
    options: Partial<InventorySection> = {
      canCreate: false,
    }
  ): Promise<InventorySection[]> {
    const containerItems = (await container.system.contents).values();

    const inventory = Inventory.getDefaultInventorySections();

    const inventoryTypes = Inventory.getDefaultInventoryTypes();

    for (let item of containerItems) {
      Inventory.applyInventoryItemToSection(
        inventory,
        item,
        inventoryTypes,
        options
      );
    }

    // TODO: Revisit this feature after the overhaul and determine how "Always Show",
    // if relevant would affect container inventories. It may be more appropriate
    // to suggest "Always Shown" custom sections for containers in the "Add Item" dialog
    // from the One Add Button.
    // SheetSections.getFilteredGlobalSectionsToShowWhenEmpty(
    //   container,
    //   CONSTANTS.TAB_CONTAINER_CONTENTS
    // ).forEach((s) => {
    //   inventory[s] ??= Inventory.createInventorySection(s, inventoryTypes, {
    //     canCreate: true,
    //   });
    // });

    return Object.values(inventory);
  }
}
