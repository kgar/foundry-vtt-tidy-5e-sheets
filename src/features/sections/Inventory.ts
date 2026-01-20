import { CONSTANTS } from 'src/constants';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type { Item5e } from 'src/types/item.types';
import type {
  ContainerCapacityContext,
  ContainerPanelItemContext,
  InventorySection,
} from 'src/types/types';
import { error } from 'src/utils/logging';

export class Inventory {
  static getInventoryDataModelEntries(): [string, any][] {
    return Object.entries<any>(CONFIG.Item.dataModels)
      .filter(
        ([type, model]) => 'inventorySection' in model && type !== 'backpack'
      )
      .toSorted(
        ([, lhs], [, rhs]) =>
          lhs.inventorySection.order - rhs.inventorySection.order
      );
  }

  static getInventoryTypes(): string[] {
    return this.getInventoryDataModelEntries().map((entry) => entry[0]);
  }

  static isItemInventoryType(item: Item5e) {
    return this.isInventoryType(CONFIG.Item.dataModels[item.type], item.type);
  }

  static isInventoryType(model: any, type: string) {
    return !!model && 'inventorySection' in model && type !== 'backpack';
  }

  static getDefaultInventorySections(
    options: Partial<InventorySection> = {}
  ): Record<string, InventorySection> {
    const inventoryTypes = Inventory.getInventoryTypes();

    const inventory: Record<string, InventorySection> = {};

    for (const type of inventoryTypes) {
      inventory[type] = {
        type: CONSTANTS.SECTION_TYPE_INVENTORY,
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
        rowActions: [],
        sectionActions: [],
        ...options,
      };
    }

    return inventory;
  }

  static applyInventoryItemToSection(
    inventory: Record<string, InventorySection>,
    item: Item5e,
    defaultInventoryTypes: string[],
    customSectionOptions: Partial<InventorySection>,
    fallbackInventoryKey: string = '',
  ) {
    const customSectionName = TidyFlags.section.get(item);

    if (!customSectionName) {
      let partition = inventory[item.type] ?? inventory[fallbackInventoryKey];
      partition?.items.push(item);
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
      type: CONSTANTS.SECTION_TYPE_INVENTORY,
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
      rowActions: [],
      sectionActions: [],
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

    const inventory = Inventory.getDefaultInventorySections(options);

    const inventoryTypes = Inventory.getInventoryTypes();

    for (let item of containerItems) {
      Inventory.applyInventoryItemToSection(
        inventory,
        item,
        inventoryTypes,
        options
      );
    }

    return Object.values(inventory);
  }
}
