<script lang="ts">
  import type { ItemSheetContext } from 'src/types/item';
  import type { Tab } from 'src/types/types';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import type { Readable } from 'svelte/store';
  import ItemDescription from './parts/ItemDescription.svelte';
  import ItemEquipmentDetails from './parts/ItemEquipmentDetails.svelte';
  import ActiveEffects from './parts/ActiveEffects.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import { CONSTANTS } from 'src/constants';
  import { getContext } from 'svelte';

  let store = getContext<Readable<ItemSheetContext>>('store');

  $: context = $store;

  $: context, console.log(context);

  export let selectedTabId: string;

  const tabs: Tab[] = [
    {
      id: 'description',
      displayName: 'DND5E.Description',
      content: {
        component: ItemDescription,
        props: {},
      },
    },
    {
      id: 'details',
      displayName: 'DND5E.Details',
      content: {
        component: ItemEquipmentDetails,
        props: {},
      },
    },
    {
      id: 'effects',
      displayName: 'DND5E.Effects',
      content: {
        component: ActiveEffects,
        props: {},
      },
    },
  ];

  Hooks.call(CONSTANTS.HOOKS_RENDERING_ITEM_EQUIPMENT_TABS, {
    tabs,
    context: $store,
  });
</script>

<header class="sheet-header flexrow">Header Here</header>
<Tabs bind:selectedTabId {tabs} />
<!-- To Do: Update Tab type to allow for cssClass specifically for the tab element, and then add flexrow for description tab -->
<div class="sheet-body">
  <TabContents tabCssClass="flexrow" {tabs} {selectedTabId} />
</div>
