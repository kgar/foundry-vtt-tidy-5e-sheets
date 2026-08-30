import { CONSTANTS } from 'src/constants';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { InventoryColumnRuntime } from 'src/runtime/table-columns/InventoryColumnRuntime';
import type { ColumnSpecificationConditionArgs } from 'src/types/columns.types';
import type { Item5e } from 'src/types/item.types';
import type {
  Actor5e,
  ContainerCapacityContext,
  ContainerPanelItemContext,
  InventorySection,
} from 'src/types/types';
import { error } from 'src/utils/logging';

export class Inventory {
  static getInventoryDataModelEntries(): [string, any][] {
    return Object.entries<any>(CONFIG.Item.dataModels)
      .filter(
        ([type, model]) => 'inventorySection' in model && type !== 'backpack',
      )
      .toSorted(
        ([, lhs], [, rhs]) =>
          lhs.inventorySection.order - rhs.inventorySection.order,
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
    sheetDocument: Actor5e | Item5e,
    // TODO: gotta simplify this code
    columnOptions: Omit<ColumnSpecificationConditionArgs, 'sheetDocument'>,
    options: Partial<InventorySection> = {},
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
        sectionActions: [],
        columns: InventoryColumnRuntime.getColumnSpecifications({
          ...columnOptions,
          sheetDocument: sheetDocument,
          tabId: CONSTANTS.TAB_ACTOR_INVENTORY,
          sectionKey: type,
        }),
        ...options,
      };
    }

    return inventory;
  }

  static applyInventoryItemToSection(params: {
    /** The sheet document where the items are to be presented. */
    sheetDocument: Actor5e | Item5e;
    /** Universally shared column options. */
    columnOptions: Omit<ColumnSpecificationConditionArgs, 'sheetDocument'>;
    /** The tab ID where the items will be shown. */
    tabId: string;
    /** The current inventory state to be updated by this function. */
    inventory: Record<string, InventorySection>;
    /** The item to be applied to the inventory sections. */
    item: Item5e;
    /** The default inventory types to show when triggering item creation from a custom section. */
    defaultInventoryTypes: string[];
    /** When creating a custom section during this operation, merge in these options over the defaults.  */
    customSectionOptions?: Partial<InventorySection>;
    /** 
     * The custom section flag to use when looking for a custom section name. 
     * @deprecated game.release.generation < 14
    */
    customSectionFlag?: 'section' | 'actionSection';
  }) {
    const {
      sheetDocument,
      tabId,
      inventory,
      columnOptions,
      item,
      defaultInventoryTypes,
      customSectionOptions,
      customSectionFlag = 'section',
    } = params;

    const customSectionName = TidyFlags[customSectionFlag].get(item);

    if (!customSectionName) {
      let partition = inventory[item.type];
      partition?.items.push(item);

      return;
    }

    const customSection: InventorySection = (inventory[customSectionName] ??=
      Inventory.createInventorySection(
        sheetDocument,
        columnOptions,
        tabId,
        customSectionName,
        defaultInventoryTypes,
        customSectionOptions,
      ));

    customSection.items.push(item);
  }

  static createInventorySection(
    sheetDocument: Actor5e | Item5e,
    columnOptions: Omit<ColumnSpecificationConditionArgs, 'sheetDocument'>,
    tabId: string,
    customSectionName: string,
    defaultInventoryTypes: string[],
    customSectionOptions: Partial<InventorySection> = {},
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
      sectionActions: [],
      columns: InventoryColumnRuntime.getColumnSpecifications({
        sheetDocument: sheetDocument,
        tabId,
        sectionKey: customSectionName,
        ...columnOptions,
      }),
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
        e,
      );
    }
    return containerPanelItems;
  }

  static async getContainerContentsInventory(
    container: Item5e,
    columnOptions: Omit<ColumnSpecificationConditionArgs, 'sheetDocument'>,
    options: Partial<InventorySection> = {
      canCreate: false,
    },
  ): Promise<InventorySection[]> {
    const containerItems = (await container.system.contents).values();

    const inventory = Inventory.getDefaultInventorySections(
      container,
      columnOptions,
      options,
    );

    const inventoryTypes = Inventory.getInventoryTypes();

    for (let item of containerItems) {
      Inventory.applyInventoryItemToSection({
        sheetDocument: container,
        tabId: CONSTANTS.TAB_CONTAINER_CONTENTS,
        columnOptions,
        inventory,
        item,
        defaultInventoryTypes: inventoryTypes,
        customSectionOptions: options,
      });
    }

    return Object.values(inventory);
  }
}
