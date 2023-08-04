<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item';
  import type { Tab } from 'src/types/types';
  import ItemDescriptionWithSidebar from './parts/ItemDescriptionWithSidebar.svelte';
  import ItemSubclassDetails from './parts/ItemSubclassDetails.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemAdvancement from './parts/ItemAdvancement.svelte';

  let store = getContext<Readable<ItemSheetContext>>('store');

  $: console.log($store);

  export let selectedTabId: string;

  const tabs: Tab[] = [
    {
      id: CONSTANTS.TAB_ITEM_DESCRIPTION_ID,
      displayName: 'DND5E.Description',
      content: {
        component: ItemDescriptionWithSidebar,
        cssClass: 'flexrow',
      },
    },
    {
      id: CONSTANTS.TAB_ITEM_DETAILS_ID,
      displayName: 'DND5E.Details',
      content: {
        component: ItemSubclassDetails,
        cssClass: 'detail-tab-contents',
      },
    },
    {
      id: CONSTANTS.TAB_ITEM_ADVANCEMENT_ID,
      displayName: 'DND5E.AdvancementTitle',
      content: {
        component: ItemAdvancement,
        cssClass: 'detail-tab-contents items-list-container',
      },
    },
  ];

  Hooks.call(CONSTANTS.HOOKS_RENDERING_ITEM_SUBCLASS_TABS, {
    tabs,
    context: $store,
  });

  const localize = FoundryAdapter.localize;
</script>
