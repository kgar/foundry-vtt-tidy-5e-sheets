<script lang="ts">
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import { CONSTANTS } from 'src/constants';
  import type { Tab } from 'src/types/types';
  import ItemBackgroundDescription from './parts/ItemBackgroundDescription.svelte';
  import ItemAdvancement from './parts/ItemAdvancement.svelte';

  const tabs: Tab[] = [
    {
      id: CONSTANTS.TAB_ITEM_DESCRIPTION_ID,
      displayName: 'DND5E.Description',
      content: {
        component: ItemBackgroundDescription,
        cssClass: 'flexrow',
      },
    },
    {
      id: CONSTANTS.TAB_ITEM_ADVANCEMENT_ID,
      displayName: 'DND5E.AdvancementTitle',
      content: {
        component: ItemAdvancement,
        cssClass: 'details',
      },
    },
  ];

  export let selectedTabId: string = 'description';
</script>

<header class="sheet-header flexrow">header here</header>
<Tabs bind:selectedTabId {tabs} />
<div class="sheet-body">
  <TabContents {tabs} {selectedTabId} />
</div>
