<script lang="ts">
  import type { TabConfigContextEntry } from '../tab-configuration.types';
  import TabInclusion from './TabInclusion.svelte';
  import type { Tab } from 'src/types/types';
  import TabVisibilityLevels from './TabVisibilityLevels.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';

  interface Props {
    entry: TabConfigContextEntry;
  }

  let { entry = $bindable() }: Props = $props();

  let tabs: Tab[] = [
    {
      id: 'inclusion',
      title: 'TODO: Inclusion',
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
      title: 'TODO: Visibility',
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

  let selectedTabId: string = $state('');
</script>

<div class="tabs-row">
  <Tabs bind:selectedTabId {tabs} cssClass="actor-tabs" />
</div>
<TabContents {selectedTabId} {tabs} />
