import { CONSTANTS } from 'src/constants';
import EquipmentSheet from 'src/sheets/item/EquipmentSheet.svelte';
import type { CustomContent, Tab } from 'src/types/types';
import itemSheetTabs from './item-sheet-tabs';
import BackgroundSheet from 'src/sheets/item/BackgroundSheet.svelte';
import ClassSheet from 'src/sheets/item/ClassSheet.svelte';
import ConsumableSheet from 'src/sheets/item/ConsumableSheet.svelte';
import ContainerSheet from 'src/sheets/item/ContainerSheet.svelte';
import FeatSheet from 'src/sheets/item/FeatSheet.svelte';
import LootSheet from 'src/sheets/item/LootSheet.svelte';
import SpellSheet from 'src/sheets/item/SpellSheet.svelte';
import SubclassSheet from 'src/sheets/item/SubclassSheet.svelte';
import ToolSheet from 'src/sheets/item/ToolSheet.svelte';
import WeaponSheet from 'src/sheets/item/WeaponSheet.svelte';
import RaceSheet from 'src/sheets/item/RaceSheet.svelte';
import type { ComponentType } from 'svelte';
import type { RegisteredContent, RegisteredTab } from '../types';
import type { ItemSheetContext } from 'src/types/item.types';
import { CustomContentManager } from '../content/CustomContentManager';
import type { RegisteredEquipmentTypeGroup } from './item.types';

export class ItemSheetRuntime {
  private static _content: RegisteredContent<ItemSheetContext>[] = [];
  private static _customTabs: RegisteredTab<ItemSheetContext>[] = [];
  private static _customItemEquipmentTypeGroups: RegisteredEquipmentTypeGroup[] =
    [];

  static async getContent(context: ItemSheetContext): Promise<CustomContent[]> {
    return await CustomContentManager.prepareContentForRender(
      context,
      ItemSheetRuntime._content
    );
  }

  static registerContent(
    registeredContent: RegisteredContent<ItemSheetContext>
  ) {
    this._content.push(registeredContent);
  }

  static registerTab(tab: RegisteredTab<ItemSheetContext>) {
    ItemSheetRuntime._customTabs.push(tab);
  }

  static getCustomItemTabs(context: any) {
    return ItemSheetRuntime._customTabs.filter(
      (s) => s.enabled === undefined || s.enabled(context)
    );
  }

  static sheets: Record<string, ItemSheetInfo> = {
    [CONSTANTS.ITEM_TYPE_EQUIPMENT]: {
      Sheet: EquipmentSheet,
      defaultTabs: () => [
        itemSheetTabs.descriptionWithSidebar,
        itemSheetTabs.equipmentDetails,
        itemSheetTabs.effects,
      ],
    },
    [CONSTANTS.ITEM_TYPE_BACKGROUND]: {
      Sheet: BackgroundSheet,
      defaultTabs: () => [itemSheetTabs.description, itemSheetTabs.advancement],
    },
    [CONSTANTS.ITEM_TYPE_CLASS]: {
      Sheet: ClassSheet,
      defaultTabs: () => [
        itemSheetTabs.description,
        itemSheetTabs.classDetails,
        itemSheetTabs.advancement,
      ],
    },
    [CONSTANTS.ITEM_TYPE_CONSUMABLE]: {
      Sheet: ConsumableSheet,
      defaultTabs: () => [
        itemSheetTabs.descriptionWithSidebar,
        itemSheetTabs.consumableDetails,
        itemSheetTabs.effects,
      ],
    },
    [CONSTANTS.ITEM_TYPE_CONTAINER]: {
      Sheet: ContainerSheet,
      defaultTabs: () => [
        itemSheetTabs.containerContents,
        itemSheetTabs.descriptionWithSidebar,
        itemSheetTabs.containerDetails,
      ],
    },
    [CONSTANTS.ITEM_TYPE_FEAT]: {
      Sheet: FeatSheet,
      defaultTabs: () => [
        itemSheetTabs.descriptionWithSidebar,
        itemSheetTabs.featDetails,
        itemSheetTabs.effects,
      ],
    },
    [CONSTANTS.ITEM_TYPE_LOOT]: {
      Sheet: LootSheet,
      defaultTabs: () => [
        itemSheetTabs.descriptionWithSidebar,
        itemSheetTabs.lootDetails,
      ],
    },
    [CONSTANTS.ITEM_TYPE_SPELL]: {
      Sheet: SpellSheet,
      defaultTabs: () => [
        itemSheetTabs.descriptionWithSidebar,
        itemSheetTabs.spellDetails,
        itemSheetTabs.effects,
      ],
    },
    [CONSTANTS.ITEM_TYPE_SUBCLASS]: {
      Sheet: SubclassSheet,
      defaultTabs: () => [
        itemSheetTabs.description,
        itemSheetTabs.subclassDetails,
        itemSheetTabs.advancement,
      ],
    },
    [CONSTANTS.ITEM_TYPE_TOOL]: {
      Sheet: ToolSheet,
      defaultTabs: () => [
        itemSheetTabs.descriptionWithSidebar,
        itemSheetTabs.toolDetails,
        itemSheetTabs.effects,
      ],
    },
    [CONSTANTS.ITEM_TYPE_WEAPON]: {
      Sheet: WeaponSheet,
      defaultTabs: () => [
        itemSheetTabs.descriptionWithSidebar,
        itemSheetTabs.weaponDetails,
        itemSheetTabs.effects,
      ],
    },
    [CONSTANTS.ITEM_TYPE_RACE]: {
      Sheet: RaceSheet,
      defaultTabs: () => [
        itemSheetTabs.raceDescription,
        itemSheetTabs.advancement,
      ],
    },
  };

  static registerCustomEquipmentTypeGroup(group: RegisteredEquipmentTypeGroup) {
    this._customItemEquipmentTypeGroups.push(group);
  }

  static getCustomEquipmentTypeGroups() {
    return [...this._customItemEquipmentTypeGroups];
  }
}

type ItemSheetInfo = {
  Sheet: ComponentType;
  defaultTabs(): Tab[];
};
