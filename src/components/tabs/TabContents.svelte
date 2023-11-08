<script lang="ts">
  import type { Tab } from 'src/types/types';
  import TabContent from './TabContent.svelte';

  export let tabs: Tab[];
  export let selectedTabId: string;
  export let cssClass: string = '';
</script>

{#each tabs as tab (tab.id)}
  <TabContent active={selectedTabId === tab.id} {tab} {cssClass} />
{/each}
