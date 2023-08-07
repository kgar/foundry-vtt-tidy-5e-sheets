import { CONSTANTS } from 'src/constants';
import ItemDescription from './parts/ItemDescription.svelte';
import ItemDescriptionWithSidebar from './parts/ItemDescriptionWithSidebar.svelte';
import ItemAdvancement from './parts/ItemAdvancement.svelte';
import ItemWeaponDetails from './parts/ItemWeaponDetails.svelte';
import ActiveEffects from '../actor/parts/ActiveEffects.svelte';
import ItemToolDetails from './parts/ItemToolDetails.svelte';
import ItemSubclassDetails from './parts/ItemSubclassDetails.svelte';
import ItemSpellDetails from './parts/ItemSpellDetails.svelte';
import ItemFeatDetails from './parts/ItemFeatDetails.svelte';
import ItemEquipmentDetails from './parts/ItemEquipmentDetails.svelte';
import ItemConsumableDetails from './parts/ItemConsumableDetails.svelte';
import ItemClassDetails from './parts/ItemClassDetails.svelte';
import ItemBackpackDetails from './parts/ItemBackpackDetails.svelte';

const itemSheetTabs = {
  /**
   * Description editor and a header for mechanics/flavor.
   */
  description: {
    id: CONSTANTS.TAB_ITEM_DESCRIPTION_ID,
    displayName: 'DND5E.Description',
    content: {
      component: ItemDescription,
      cssClass: 'flexcol',
    },
  },
  /**
   * A sidebar with item inputs and properties, and a description editor.
   */
  descriptionWithSidebar: {
    id: CONSTANTS.TAB_ITEM_DESCRIPTION_ID,
    displayName: 'DND5E.Description',
    content: {
      component: ItemDescriptionWithSidebar,
      cssClass: 'flexrow',
    },
  },
  /**
   * Advancement create/read/update/delete interface.
   */
  advancement: {
    id: CONSTANTS.TAB_ITEM_ADVANCEMENT_ID,
    displayName: 'DND5E.AdvancementTitle',
    content: {
      component: ItemAdvancement,
      cssClass: 'detail-tab-contents items-list-container',
    },
  },
  /**
   * Details form for weapon items.
   */
  weaponDetails: {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    displayName: 'DND5E.Details',
    content: {
      component: ItemWeaponDetails,
      cssClass: 'detail-tab-contents',
    },
  },
  /**
   * Active Effects create/read/update/delete interface.
   */
  effects: {
    id: CONSTANTS.TAB_ITEM_EFFECTS_ID,
    displayName: 'DND5E.Effects',
    content: {
      component: ActiveEffects,
      cssClass: 'flexcol items-list-container',
    },
  },
  /**
   * Details form for tool items.
   */
  toolDetails: {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    displayName: 'DND5E.Details',
    content: {
      component: ItemToolDetails,
      cssClass: 'detail-tab-contents',
    },
  },
  /**
   * Details form for subclass items.
   */
  subclassDetails: {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    displayName: 'DND5E.Details',
    content: {
      component: ItemSubclassDetails,
      cssClass: 'detail-tab-contents',
    },
  },
  /**
   * Details form for spell items.
   */
  spellDetails: {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    displayName: 'DND5E.Details',
    content: {
      component: ItemSpellDetails,
      cssClass: 'detail-tab-contents',
    },
  },
  /**
   * Details form for feat items.
   */
  featDetails: {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    displayName: 'DND5E.Details',
    content: {
      component: ItemFeatDetails,
      cssClass: 'detail-tab-contents',
    },
  },
  /**
   * Details form for equipment items.
   */
  equipmentDetails: {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    displayName: 'DND5E.Details',
    content: {
      component: ItemEquipmentDetails,
      cssClass: 'detail-tab-contents',
    },
  },
  /**
   * Details form for consumable items.
   */
  consumableDetails: {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    displayName: 'DND5E.Details',
    content: {
      component: ItemConsumableDetails,
      props: {},
      cssClass: 'detail-tab-contents',
    },
  },
  /**
   * Details form for class items.
   */
  classDetails: {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    displayName: 'DND5E.Details',
    content: {
      component: ItemClassDetails,
      cssClass: 'detail-tab-contents',
    },
  },
  /**
   * Details form for backpack items.
   */
  backpackDetails: {
    id: CONSTANTS.TAB_ITEM_DETAILS_ID,
    displayName: 'DND5E.Details',
    content: {
      component: ItemBackpackDetails,
      props: {},
      cssClass: 'detail-tab-contents',
    },
  },
};

export default itemSheetTabs;
