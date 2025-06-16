<script lang="ts">
  import type { Tab } from 'src/types/types';
  import TabContent from './TabContent.svelte';
  import { error } from 'src/utils/logging';
  import type { SvelteSet } from 'svelte/reactivity';
  import type { ClassValue } from 'svelte/elements';

  interface Props {
    tabs: Tab[];
    selectedTabId: string;
    extraTabs?: SvelteSet<string>;
    cssClass?: ClassValue;
  }

  let { tabs, selectedTabId, cssClass = '', extraTabs }: Props = $props();
</script>

{#each tabs as tab (tab.id)}
  <svelte:boundary
    onerror={(e) =>
      error('An error occurred while rendering tab contents', false, {
        tab,
        error: e,
      })}
  >
    <TabContent
      active={selectedTabId === tab.id || !!extraTabs?.has(tab.id)}
      {tab}
      {cssClass}
    />
  </svelte:boundary>
{/each}
