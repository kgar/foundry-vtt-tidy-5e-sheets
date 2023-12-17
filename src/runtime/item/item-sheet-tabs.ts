import { CONSTANTS } from 'src/constants';
import ItemActiveEffectsTab from '../../sheets/item/tabs/ItemActiveEffectsTab.svelte';
import ItemAdvancementTab from '../../sheets/item/tabs/ItemAdvancementTab.svelte';
import ItemBackpackDetailsTab from '../../sheets/item/tabs/ItemBackpackDetailsTab.svelte';
import ItemClassDetailsTab from '../../sheets/item/tabs/ItemClassDetailsTab.svelte';
import ItemConsumableDetailsTab from '../../sheets/item/tabs/ItemConsumableDetailsTab.svelte';
import ItemDescriptionTab from '../../sheets/item/tabs/ItemDescriptionTab.svelte';
import ItemDescriptionWithSidebarTab from '../../sheets/item/tabs/ItemDescriptionWithSidebarTab.svelte';
import ItemEquipmentDetailsTab from '../../sheets/item/tabs/ItemEquipmentDetailsTab.svelte';
import ItemFeatDetailsTab from '../../sheets/item/tabs/ItemFeatDetailsTab.svelte';
import ItemLootDetailsTab from '../../sheets/item/tabs/ItemLootDetailsTab.svelte';
import ItemRaceDescriptionTab from '../../sheets/item/tabs/ItemRaceDescriptionTab.svelte';
import ItemSpellDetailsTab from '../../sheets/item/tabs/ItemSpellDetailsTab.svelte';
import ItemSubclassDetailsTab from '../../sheets/item/tabs/ItemSubclassDetailsTab.svelte';
import ItemToolDetailsTab from '../../sheets/item/tabs/ItemToolDetailsTab.svelte';
import ItemWeaponDetailsTab from '../../sheets/item/tabs/ItemWeaponDetailsTab.svelte';
import type { Tab } from 'src/types/types';

const itemSheetTabs: Record<string, Tab> = {
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
   * Details form for backpack items.
   */
  backpackDetails: {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    title: 'DND5E.Details',
    content: {
      component: ItemBackpackDetailsTab,
      cssClass: 'detail-tab-contents',
      type: 'svelte',
    },
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
  },
  /**
   * A sidebar with race properties and configuration buttons, and a description editor.
   */
  raceDescription: {
    id: CONSTANTS.TAB_ITEM_DESCRIPTION_ID,
    title: 'DND5E.Description',
    content: {
      component: ItemRaceDescriptionTab,
      cssClass: 'flexrow',
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
  },
} as const;

export default itemSheetTabs;
