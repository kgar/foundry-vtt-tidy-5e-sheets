import type { ItemSheetQuadroneContext } from 'src/types/item.types';
import type { RegisteredContent, RegisteredTab } from '../types';
import type { RegisteredEquipmentTypeGroup } from './item.types';
import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { CustomContent, Tab } from 'src/types/types';
import { Activities } from 'src/features/activities/activities';
import ItemActivitiesQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemActivitiesTab.svelte';
import ItemAdvancementQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemAdvancementTab.svelte';
import ItemBackgroundDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemBackgroundDetailsTab.svelte';
import ItemClassDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemClassDetailsTab.svelte';
import ItemConsumableDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemConsumableDetailsTab.svelte';
import ItemContainerContentsQuadroneTab from 'src/sheets/quadrone/container/tabs/ContainerContentsTab.svelte';
import ItemContainerDetailsQuadronTab from 'src/sheets/quadrone/container/tabs/ContainerDetailsTab.svelte';
import ItemDescriptionsQuadroneTab from '../../sheets/quadrone/item/tabs/ItemDescriptionsTab.svelte';
import ItemEffectsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemEffectsTab.svelte';
import ItemEquipmentDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemEquipmentDetailsTab.svelte';
import ItemFacilityDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemFacilityDetailsTab.svelte';
import ItemFeatDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemFeatDetailsTab.svelte';
import ItemLootDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemLootDetailsTab.svelte';
import ItemSpeciesDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemSpeciesDetailsTab.svelte';
import ItemSpellDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemSpellDetailsTab.svelte';
import ItemSubclassDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemSubclassDetailsTab.svelte';
import ItemToolDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemToolDetailsTab.svelte';
import ItemWeaponDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemWeaponDetailsTab.svelte';
import { CustomContentManager } from '../content/CustomContentManager';

class ItemSheetQuadroneRuntime {
  private _content: RegisteredContent<ItemSheetQuadroneContext>[] = $state([]);
  private _tabs: RegisteredTab<ItemSheetQuadroneContext>[] = $state([]);

  constructor(nativeTabs: RegisteredTab<ItemSheetQuadroneContext>[]) {
    this._tabs = nativeTabs;
  }

  async getContent(
    context: ItemSheetQuadroneContext | ItemSheetQuadroneContext
  ): Promise<CustomContent[]> {
    return await CustomContentManager.prepareContentForRender(
      context,
      this._content
    );
  }

  async getTabs(context: ItemSheetQuadroneContext, type: string) {
    // TODO;
  }

  getAllRegisteredTabs(): RegisteredTab<ItemSheetQuadroneContext>[] {
    return [...this._tabs];
  }

  getDefaultTabIds(type: string): string[] {
    // TODO:
  }

  registerContent(
    registeredContent: RegisteredContent<ItemSheetQuadroneContext>
  ) {
    this._content.push(registeredContent);
  }

  registerTab(tab: RegisteredTab<ItemSheetQuadroneContext>) {
    this._tabs.push(tab);
  }

  getCustomItemTabs(context: any) {
    return this._tabs;
  }
}

const singleton = new ItemSheetQuadroneRuntime([
  {
    id: CONSTANTS.TAB_ITEM_ACTIVITIES_ID,
    itemCount: (context) =>
      Array.from(context.document.system.activities).filter((x) =>
        Activities.isConfigurable(x)
      ).length,
    layout: 'quadrone',
    title: 'DND5E.ACTIVITY.Title.other',
    content: {
      component: ItemActivitiesQuadroneTab,
      type: 'svelte',
    },
    enabled: (context: ItemSheetQuadroneContext) =>
      context.document.system.identified !== false ||
      FoundryAdapter.isInGmEditMode(context.document),
  },
  {
    id: CONSTANTS.TAB_ITEM_ADVANCEMENT_ID,
    itemCount: (context) =>
      Array.from(context.document.system.advancement).length,
    layout: 'quadrone',
    title: 'DND5E.AdvancementTitle',
    content: {
      component: ItemAdvancementQuadroneTab,
      type: 'svelte',
    },
  },
  {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    layout: 'quadrone',
    title: 'DND5E.Details',
    content: {
      component: ItemClassDetailsQuadroneTab,
      type: 'svelte',
    },
  },
  {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    layout: 'quadrone',
    title: 'DND5E.Details',
    content: {
      component: ItemConsumableDetailsQuadroneTab,
      type: 'svelte',
    },
    enabled: (context) =>
      context.document.system.identified !== false ||
      FoundryAdapter.isInGmEditMode(context.document),
  },
  {
    id: CONSTANTS.TAB_CONTAINER_CONTENTS,
    layout: 'quadrone',
    title: 'DND5E.Contents',
    content: {
      component: ItemContainerContentsQuadroneTab,
      type: 'svelte',
    },
  },
  {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    layout: 'quadrone',
    title: 'DND5E.Details',
    content: {
      component: ItemBackgroundDetailsQuadroneTab,
      type: 'svelte',
    },
  },
  /**
   * Details form for containers.
   */
  {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    layout: 'quadrone',
    title: 'DND5E.Details',
    content: {
      component: ItemContainerDetailsQuadronTab,
      type: 'svelte',
    },
    enabled: (context) =>
      context.document.system.identified !== false ||
      FoundryAdapter.isInGmEditMode(context.document),
  },
  {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    layout: 'quadrone',
    title: 'DND5E.Details',
    content: {
      component: ItemEquipmentDetailsQuadroneTab,
      type: 'svelte',
    },
    enabled: (context) =>
      context.document.system.identified !== false ||
      FoundryAdapter.isInGmEditMode(context.document),
  },
  {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    layout: 'quadrone',
    title: 'DND5E.Details',
    content: {
      component: ItemFacilityDetailsQuadroneTab,
      type: 'svelte',
    },
  },
  {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    layout: 'quadrone',
    title: 'DND5E.Details',
    content: {
      component: ItemFeatDetailsQuadroneTab,
      type: 'svelte',
    },
  },
  {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    layout: 'quadrone',
    title: 'DND5E.Details',
    content: {
      component: ItemLootDetailsQuadroneTab,
      type: 'svelte',
    },
    enabled: (context) =>
      context.document.system.identified !== false ||
      FoundryAdapter.isInGmEditMode(context.document),
  },
  {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    layout: 'quadrone',
    title: 'DND5E.Details',
    content: {
      component: ItemSpellDetailsQuadroneTab,
      type: 'svelte',
    },
  },
  {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    layout: 'quadrone',
    title: 'DND5E.Details',
    content: {
      component: ItemSubclassDetailsQuadroneTab,
      type: 'svelte',
    },
  },
  {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    layout: 'quadrone',
    title: 'DND5E.Details',
    content: {
      component: ItemToolDetailsQuadroneTab,
      type: 'svelte',
    },
    enabled: (context) =>
      context.document.system.identified !== false ||
      FoundryAdapter.isInGmEditMode(context.document),
  },
  {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    layout: 'quadrone',
    title: 'DND5E.Details',
    content: {
      component: ItemWeaponDetailsQuadroneTab,
      type: 'svelte',
    },
    enabled: (context) =>
      context.document.system.identified !== false ||
      FoundryAdapter.isInGmEditMode(context.document),
  },
  {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    layout: 'quadrone',
    title: 'DND5E.Details',
    content: {
      component: ItemSpeciesDetailsQuadroneTab,
      type: 'svelte',
    },
  },
  {
    id: CONSTANTS.TAB_ITEM_DESCRIPTION_ID,
    layout: 'quadrone',
    title: 'DND5E.Description',
    content: {
      component: ItemDescriptionsQuadroneTab,
      type: 'svelte',
    },
  },
  {
    id: CONSTANTS.TAB_EFFECTS,
    itemCount: (context) => Array.from(context.document?.effects).length,
    layout: 'quadrone',
    title: 'DND5E.Effects',
    content: {
      component: ItemEffectsQuadroneTab,
      type: 'svelte',
    },
    enabled: (context) =>
      context.document.system.identified !== false ||
      FoundryAdapter.isInGmEditMode(context.document),
  },
]);

export default singleton;
