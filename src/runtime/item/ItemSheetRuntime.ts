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
import BackgroundSheetQuadrone from 'src/sheets/quadrone/item/BackgroundSheet.svelte';
import ClassSheetQuadrone from 'src/sheets/quadrone/item/ClassSheet.svelte';
import ConsumableSheetQuadrone from 'src/sheets/quadrone/item/ConsumableSheet.svelte';
import ContainerSheetQuadrone from 'src/sheets/quadrone/container/ContainerSheet.svelte';
import EquipmentSheetQuadrone from 'src/sheets/quadrone/item/EquipmentSheet.svelte';
import FacilitySheetQuadrone from 'src/sheets/quadrone/item/FacilitySheet.svelte';
import FeatSheetQuadrone from 'src/sheets/quadrone/item/FeatSheet.svelte';
import LootSheetQuadrone from 'src/sheets/quadrone/item/LootSheet.svelte';
import SpellSheetQuadrone from 'src/sheets/quadrone/item/SpellSheet.svelte';
import SubclassSheetQuadrone from 'src/sheets/quadrone/item/SubclassSheet.svelte';
import ToolSheetQuadrone from 'src/sheets/quadrone/item/ToolSheet.svelte';
import WeaponSheetQuadrone from 'src/sheets/quadrone/item/WeaponSheet.svelte';
import SpeciesSheetQuadrone from 'src/sheets/quadrone/item/SpeciesSheet.svelte';
import type { RegisteredContent, RegisteredTab } from '../types';
import type {
  ContainerSheetClassicContext,
  ContainerSheetQuadroneContext,
  ItemSheetContext,
  ItemSheetQuadroneContext,
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
      | ContainerSheetQuadroneContext
      | ItemSheetQuadroneContext
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
    return ItemSheetRuntime._customTabs;
  }

  static classicSheets: Record<string, ItemSheetInfo> = {
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
        itemSheetTabs.advancement,
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

  static quadroneSheets: Record<string, ItemSheetInfo> = {
    [CONSTANTS.ITEM_TYPE_BACKGROUND]: {
      Sheet: BackgroundSheetQuadrone,
      defaultTabs: () => [
        itemSheetTabs.quadroneDescriptions,
        itemSheetTabs.quadroneBackgroundDetails,
        itemSheetTabs.quadroneAdvancement,
      ],
    },
    [CONSTANTS.ITEM_TYPE_CLASS]: {
      Sheet: ClassSheetQuadrone,
      defaultTabs: () => [
        itemSheetTabs.quadroneDescriptions,
        itemSheetTabs.quadroneClassDetails,
        itemSheetTabs.quadroneAdvancement,
      ],
    },
    [CONSTANTS.ITEM_TYPE_CONSUMABLE]: {
      Sheet: ConsumableSheetQuadrone,
      defaultTabs: () => [
        itemSheetTabs.quadroneDescriptions,
        itemSheetTabs.quadroneConsumableDetails,
        itemSheetTabs.quadroneActivities,
        itemSheetTabs.quadroneEffects,
      ],
    },
    [CONSTANTS.ITEM_TYPE_CONTAINER]: {
      Sheet: ContainerSheetQuadrone,
      defaultTabs: () => [
        itemSheetTabs.quadroneContainerContents,
        itemSheetTabs.quadroneDescriptions,
        // TODO: Only show to GMs and users when identified
        itemSheetTabs.quadroneContainerDetails,
      ],
    },
    [CONSTANTS.ITEM_TYPE_EQUIPMENT]: {
      Sheet: EquipmentSheetQuadrone,
      defaultTabs: () => [
        itemSheetTabs.quadroneDescriptions,
        itemSheetTabs.quadroneEquipmentDetails,
        itemSheetTabs.quadroneActivities,
        itemSheetTabs.quadroneEffects,
      ],
    },
    [CONSTANTS.ITEM_TYPE_FACILITY]: {
      Sheet: FacilitySheetQuadrone,
      defaultTabs: () => [
        itemSheetTabs.quadroneDescriptions,
        itemSheetTabs.quadroneFacilityDetails,
        itemSheetTabs.quadroneActivities,
      ],
    },
    [CONSTANTS.ITEM_TYPE_FEAT]: {
      Sheet: FeatSheetQuadrone,
      defaultTabs: () => [
        itemSheetTabs.quadroneDescriptions,
        itemSheetTabs.quadroneFeatDetails,
        itemSheetTabs.quadroneActivities,
        itemSheetTabs.quadroneEffects,
        itemSheetTabs.quadroneAdvancement,
      ],
    },
    [CONSTANTS.ITEM_TYPE_LOOT]: {
      Sheet: LootSheetQuadrone,
      defaultTabs: () => [
        itemSheetTabs.quadroneDescriptions,
        itemSheetTabs.quadroneLootDetails,
      ],
    },
    [CONSTANTS.ITEM_TYPE_RACE]: {
      Sheet: SpeciesSheetQuadrone,
      defaultTabs: () => [
        itemSheetTabs.quadroneDescriptions,
        itemSheetTabs.quadroneSpeciesDetails,
        itemSheetTabs.quadroneAdvancement,
      ],
    },
    [CONSTANTS.ITEM_TYPE_SPELL]: {
      Sheet: SpellSheetQuadrone,
      defaultTabs: () => [
        itemSheetTabs.quadroneDescriptions,
        itemSheetTabs.quadroneSpellDetails,
        itemSheetTabs.quadroneActivities,
        itemSheetTabs.quadroneEffects,
      ],
    },
    [CONSTANTS.ITEM_TYPE_SUBCLASS]: {
      Sheet: SubclassSheetQuadrone,
      defaultTabs: () => [
        itemSheetTabs.quadroneDescriptions,
        itemSheetTabs.quadroneSubclassDetails,
        itemSheetTabs.quadroneAdvancement,
      ],
    },
    [CONSTANTS.ITEM_TYPE_TOOL]: {
      Sheet: ToolSheetQuadrone,
      defaultTabs: () => [
        itemSheetTabs.quadroneDescriptions,
        itemSheetTabs.quadroneToolDetails,
        itemSheetTabs.quadroneActivities,
        itemSheetTabs.quadroneEffects,
      ],
    },
    [CONSTANTS.ITEM_TYPE_WEAPON]: {
      Sheet: WeaponSheetQuadrone,
      defaultTabs: () => [
        itemSheetTabs.quadroneDescriptions,
        itemSheetTabs.quadroneWeaponDetails,
        itemSheetTabs.quadroneActivities,
        itemSheetTabs.quadroneEffects,
      ],
    },
  };

  static registerCustomEquipmentTypeGroup(group: RegisteredEquipmentTypeGroup) {
    this._customItemEquipmentTypeGroups.push(group);
  }

  // TODO: Move to the Quadrone Runtime when the Classic Sheets are no more.
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
      let errorId = foundry.utils.randomID();
      error('An error occurred while searching for a tab title.', false, {
        error: e,
        errorId,
        tabId,
      });
    }
  }
}

type ItemSheetInfo = {
  Sheet: Component;
  defaultTabs(): Tab[];
};
