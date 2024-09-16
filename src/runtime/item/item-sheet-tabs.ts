import { CONSTANTS } from 'src/constants';
import ItemActiveEffectsTab from '../../sheets/item/tabs/ItemActiveEffectsTab.svelte';
import ItemAdvancementTab from '../../sheets/item/tabs/ItemAdvancementTab.svelte';
import ItemBackgroundDetailsTab from '../../sheets/item/tabs/ItemBackgroundDetailsTab.svelte';
import ItemClassDetailsTab from '../../sheets/item/tabs/ItemClassDetailsTab.svelte';
import ItemConsumableDetailsTab from '../../sheets/item/tabs/ItemConsumableDetailsTab.svelte';
import ItemContainerContentsTab from '../../sheets/item/tabs/ItemContainerContentsTab.svelte';
import ItemContainerDetailsTab from '../../sheets/item/tabs/ItemContainerDetailsTab.svelte';
import ItemDescriptionTab from '../../sheets/item/tabs/ItemDescriptionTab.svelte';
import ItemSpeciesDetailsTab from '../../sheets/item/tabs/ItemSpeciesDetailsTab.svelte';
import ItemDescriptionWithSidebarTab from '../../sheets/item/tabs/ItemDescriptionWithSidebarTab.svelte';
import ItemEquipmentDetailsTab from '../../sheets/item/tabs/ItemEquipmentDetailsTab.svelte';
import ItemFeatDetailsTab from '../../sheets/item/tabs/ItemFeatDetailsTab.svelte';
import ItemLootDetailsTab from '../../sheets/item/tabs/ItemLootDetailsTab.svelte';
import ItemSpeciesDescriptionTab from '../../sheets/item/tabs/ItemSpeciesDescriptionTab.svelte';
import ItemSpellDetailsTab from '../../sheets/item/tabs/ItemSpellDetailsTab.svelte';
import ItemSubclassDetailsTab from '../../sheets/item/tabs/ItemSubclassDetailsTab.svelte';
import ItemToolDetailsTab from '../../sheets/item/tabs/ItemToolDetailsTab.svelte';
import ItemWeaponDetailsTab from '../../sheets/item/tabs/ItemWeaponDetailsTab.svelte';
import ItemActivitiesTab from '../../sheets/item/tabs/ItemActivitiesTab.svelte';
import type { Tab } from 'src/types/types';

const itemSheetTabs = {
  /**
   * Interface for managing activities for an item.
   */
  activities: {
    id: CONSTANTS.TAB_ITEM_ACTIVITIES_ID,
    title: 'DND5E.ACTIVITY.Title.other',
    content: {
      component: ItemActivitiesTab,
      cssClass: 'activities-tab-contents',
      type: 'svelte',
    },
  },
  /**
   * Advancement create/read/update/delete interface.
   */
  advancement: {
    id: CONSTANTS.TAB_ITEM_ADVANCEMENT_ID,
    title: 'DND5E.AdvancementTitle',
    content: {
      component: ItemAdvancementTab,
      cssClass: 'detail-tab-contents items-list-container',
      type: 'svelte',
    },
  },
  /**
   * Details form for background items.
   */
  backgroundDetails: {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    title: 'DND5E.Details',
    content: {
      component: ItemBackgroundDetailsTab,
      cssClass: 'detail-tab-contents',
      type: 'svelte',
    },
    autoHeight: true,
  },
  /**
   * Details form for class items.
   */
  classDetails: {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    title: 'DND5E.Details',
    content: {
      component: ItemClassDetailsTab,
      cssClass: 'detail-tab-contents',
      type: 'svelte',
    },
    autoHeight: true,
  },
  /**
   * Details form for consumable items.
   */
  consumableDetails: {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    title: 'DND5E.Details',
    content: {
      component: ItemConsumableDetailsTab,
      cssClass: 'detail-tab-contents',
      type: 'svelte',
    },
    autoHeight: true,
  },
  containerContents: {
    id: CONSTANTS.TAB_CONTAINER_CONTENTS,
    title: 'DND5E.Contents',
    content: {
      component: ItemContainerContentsTab,
      cssClass: 'detail-tab-contents',
      type: 'svelte',
    },
  },
  containerDetails: {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    title: 'DND5E.Details',
    content: {
      component: ItemContainerDetailsTab,
      cssClass: 'detail-tab-contents',
      type: 'svelte',
    },
    autoHeight: true,
  },
  /**
   * Description editor and a header for mechanics/flavor.
   */
  description: {
    id: CONSTANTS.TAB_ITEM_DESCRIPTION_ID,
    title: 'DND5E.Description',
    content: {
      component: ItemDescriptionTab,
      cssClass: 'flexcol',
      type: 'svelte',
    },
  },
  /**
   * A sidebar with item inputs and properties, and a description editor.
   */
  descriptionWithSidebar: {
    id: CONSTANTS.TAB_ITEM_DESCRIPTION_ID,
    title: 'DND5E.Description',
    content: {
      component: ItemDescriptionWithSidebarTab,
      cssClass: 'flexrow',
      type: 'svelte',
    },
  },
  /**
   * Active Effects create/read/update/delete interface.
   */
  effects: {
    id: CONSTANTS.TAB_ITEM_EFFECTS_ID,
    title: 'DND5E.Effects',
    content: {
      component: ItemActiveEffectsTab,
      cssClass: 'flexcol items-list-container',
      type: 'svelte',
    },
  },
  /**
   * Details form for equipment items.
   */
  equipmentDetails: {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    title: 'DND5E.Details',
    content: {
      component: ItemEquipmentDetailsTab,
      cssClass: 'detail-tab-contents',
      type: 'svelte',
    },
    autoHeight: true,
  },
  /**
   * Details form for feat items.
   */
  featDetails: {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    title: 'DND5E.Details',
    content: {
      component: ItemFeatDetailsTab,
      cssClass: 'detail-tab-contents',
      type: 'svelte',
    },
    autoHeight: true,
  },
  /**
   * Details form for loot.
   */
  lootDetails: {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    title: 'DND5E.Details',
    content: {
      component: ItemLootDetailsTab,
      cssClass: 'detail-tab-contents',
      type: 'svelte',
    },
    autoHeight: true,
  },
  /**
   * A sidebar with species properties and configuration buttons, and a description editor.
   */
  speciesDescription: {
    id: CONSTANTS.TAB_ITEM_DESCRIPTION_ID,
    title: 'DND5E.Description',
    content: {
      component: ItemSpeciesDescriptionTab,
      cssClass: 'flexrow',
      type: 'svelte',
    },
  },
  /**
   * Details form for species items.
   */
  speciesDetails: {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    title: 'DND5E.Details',
    content: {
      component: ItemSpeciesDetailsTab,
      cssClass: 'detail-tab-contents',
      type: 'svelte',
    },
  },
  /**
   * Details form for spell items.
   */
  spellDetails: {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    title: 'DND5E.Details',
    content: {
      component: ItemSpellDetailsTab,
      cssClass: 'detail-tab-contents',
      type: 'svelte',
    },
    autoHeight: true,
  },
  /**
   * Details form for subclass items.
   */
  subclassDetails: {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    title: 'DND5E.Details',
    content: {
      component: ItemSubclassDetailsTab,
      cssClass: 'detail-tab-contents',
      type: 'svelte',
    },
    autoHeight: true,
  },
  /**
   * Details form for tool items.
   */
  toolDetails: {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    title: 'DND5E.Details',
    content: {
      component: ItemToolDetailsTab,
      cssClass: 'detail-tab-contents',
      type: 'svelte',
    },
    autoHeight: true,
  },
  /**
   * Details form for weapon items.
   */
  weaponDetails: {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    title: 'DND5E.Details',
    content: {
      component: ItemWeaponDetailsTab,
      cssClass: 'detail-tab-contents',
      type: 'svelte',
    },
    autoHeight: true,
  },
} satisfies Record<string, Tab>;

export default itemSheetTabs;
