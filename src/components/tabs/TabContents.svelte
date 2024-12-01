<script lang="ts">
  import type { Tab } from 'src/types/types';
  import TabContent from './TabContent.svelte';

  interface Props {
    tabs: Tab[];
    selectedTabId: string;
    cssClass?: string;
  }

  let { tabs, selectedTabId, cssClass = '' }: Props = $props();
</script>

{#each tabs as tab (tab.id)}
  <TabContent active={selectedTabId === tab.id} {tab} {cssClass} />
{/each}
