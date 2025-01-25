import { CONSTANTS } from 'src/constants';
import EquipmentSheet from 'src/sheets/classic/item/EquipmentSheet.svelte';
import type { CustomContent, Tab } from 'src/types/types';
import itemSheetTabs from './item-sheet-tabs';
import BackgroundSheet from 'src/sheets/classic/item/BackgroundSheet.svelte';
import ClassSheet from 'src/sheets/classic/item/ClassSheet.svelte';
import ConsumableSheet from 'src/sheets/classic/item/ConsumableSheet.svelte';
import ContainerSheet from 'src/sheets/classic/item/ContainerSheet.svelte';
import FacilitySheet from 'src/sheets/classic/item/FacilitySheet.svelte';
import FeatSheet from 'src/sheets/classic/item/FeatSheet.svelte';
import LootSheet from 'src/sheets/classic/item/LootSheet.svelte';
import SpellSheet from 'src/sheets/classic/item/SpellSheet.svelte';
import SubclassSheet from 'src/sheets/classic/item/SubclassSheet.svelte';
import ToolSheet from 'src/sheets/classic/item/ToolSheet.svelte';
import WeaponSheet from 'src/sheets/classic/item/WeaponSheet.svelte';
import SpeciesSheet from 'src/sheets/classic/item/SpeciesSheet.svelte';
import type { RegisteredContent, RegisteredTab } from '../types';
import type {
  ContainerSheetClassicContext,
  ContainerSheetHightouchContext,
  ItemSheetContext,
} from 'src/types/item.types';
import { CustomContentManager } from '../content/CustomContentManager';
import type { RegisteredEquipmentTypeGroup } from './item.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { debug, error } from 'src/utils/logging';
import type { Component } from 'svelte';

export class ItemSheetRuntime {
  private static _content: RegisteredContent<ItemSheetContext>[] = [];
  private static _customTabs: RegisteredTab<ItemSheetContext>[] = [];
  private static _customItemEquipmentTypeGroups: RegisteredEquipmentTypeGroup[] =
    [];

  static async getContent(
    context:
      | ItemSheetContext
      | ContainerSheetClassicContext
      | ContainerSheetHightouchContext
  ): Promise<CustomContent[]> {
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
    [CONSTANTS.ITEM_TYPE_BACKGROUND]: {
      Sheet: BackgroundSheet,
      defaultTabs: () => [
        itemSheetTabs.description,
        itemSheetTabs.backgroundDetails,
        itemSheetTabs.advancement,
      ],
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
        itemSheetTabs.activities,
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
      tempHightouchTabs: () => [
        itemSheetTabs.hightouchContainerContents,
        itemSheetTabs.hightouchDescription,
        // TODO: Only show to GMs and users when identified
        itemSheetTabs.hightouchContainerDetails,
      ],
    },
    [CONSTANTS.ITEM_TYPE_EQUIPMENT]: {
      Sheet: EquipmentSheet,
      defaultTabs: () => [
        itemSheetTabs.descriptionWithSidebar,
        itemSheetTabs.equipmentDetails,
        itemSheetTabs.activities,
        itemSheetTabs.effects,
      ],
    },
    [CONSTANTS.ITEM_TYPE_FACILITY]: {
      Sheet: FacilitySheet,
      defaultTabs: () => [
        itemSheetTabs.description,
        itemSheetTabs.facilityDetails,
        itemSheetTabs.activities,
      ],
    },
    [CONSTANTS.ITEM_TYPE_FEAT]: {
      Sheet: FeatSheet,
      defaultTabs: () => [
        itemSheetTabs.descriptionWithSidebar,
        itemSheetTabs.featDetails,
        itemSheetTabs.activities,
        itemSheetTabs.effects,
        itemSheetTabs.advancement
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
        itemSheetTabs.activities,
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
        itemSheetTabs.activities,
        itemSheetTabs.effects,
      ],
    },
    [CONSTANTS.ITEM_TYPE_WEAPON]: {
      Sheet: WeaponSheet,
      defaultTabs: () => [
        itemSheetTabs.descriptionWithSidebar,
        itemSheetTabs.weaponDetails,
        itemSheetTabs.activities,
        itemSheetTabs.effects,
      ],
    },
    [CONSTANTS.ITEM_TYPE_RACE]: {
      Sheet: SpeciesSheet,
      defaultTabs: () => [
        itemSheetTabs.speciesDescription,
        itemSheetTabs.speciesDetails,
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

  static getTabTitle(tabId: string) {
    try {
      let tabs = [...this._customTabs, ...Object.values(itemSheetTabs)];
      let tabTitle = tabs.find((t) => t.id === tabId)?.title;
      if (typeof tabTitle === 'function') {
        tabTitle = tabTitle();
      }
      return tabTitle ? FoundryAdapter.localize(tabTitle) : tabId;
    } catch (e) {
      error('An error occurred while searching for a tab title.', false, e);
      debug('Tab title error troubleshooting information', { tabId });
    }
  }
}

type ItemSheetInfo = {
  Sheet: Component;
  defaultTabs(): Tab[];
  // TODO: Remove after replacing item sheets
  tempHightouchTabs?: () => Tab[];
};
