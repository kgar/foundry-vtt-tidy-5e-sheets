<script lang="ts">
  import type { ItemSheetContext } from 'src/types/item';
  import type { Tab } from 'src/types/types';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import type { Readable } from 'svelte/store';
  import ItemDescription from './parts/item-description.svelte';
  import ItemEquipmentDetails from './parts/item-equipment-details.svelte';
  import ActiveEffects from './parts/active-effects.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';

  export let store: Readable<ItemSheetContext>;

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
</script>

<header>Header here</header>
<Tabs bind:selectedTabId {tabs} />
<section>
  <TabContents {tabs} {selectedTabId} />
</section>
