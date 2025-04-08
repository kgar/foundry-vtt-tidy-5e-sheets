<script lang="ts">
  import type { Tab } from 'src/types/types';
  import TabContent from './TabContent.svelte';
  import { error } from 'src/utils/logging';

  interface Props {
    tabs: Tab[];
    selectedTabId: string;
    cssClass?: string;
  }

  let { tabs, selectedTabId, cssClass = '' }: Props = $props();
</script>

{#each tabs as tab (tab.id)}
  <svelte:boundary
    onerror={(e) =>
      error('An error occurred while rendering tab contents', false, {
        tab,
        error: e,
      })}
  >
    <TabContent active={selectedTabId === tab.id} {tab} {cssClass} />
  </svelte:boundary>
{/each}
