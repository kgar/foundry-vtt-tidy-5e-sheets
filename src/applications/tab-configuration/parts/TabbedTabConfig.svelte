<script lang="ts">
  import type { TabConfigContextEntry } from '../tab-configuration.types';
  import TabInclusion from './TabInclusion.svelte';
  import type { Tab } from 'src/types/types';
  import TabVisibilityLevels from './TabVisibilityLevels.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';

  interface Props {
    entry: TabConfigContextEntry;
    selectedTabId?: string;
  }

  let { entry = $bindable(), selectedTabId = $bindable('') }: Props = $props();

  let tabs: Tab[] = [
    {
      id: 'inclusion',
      title: 'TIDY5E.TabConfiguration.SelectionTab.Title',
      content: {
        type: 'svelte',
        component: TabInclusion,
        getProps() {
          return {
            entry: entry,
          };
        },
      },
    },
    {
      id: 'visibility',
      title: 'TIDY5E.TabConfiguration.VisibilityTab.Title',
      content: {
        type: 'svelte',
        component: TabVisibilityLevels,
        getProps() {
          return {
            entry: entry,
          };
        },
      },
    },
  ];
</script>

<div class="tabs-row">
  <Tabs bind:selectedTabId {tabs} cssClass="item-tabs" />
</div>
<TabContents {selectedTabId} {tabs} />
