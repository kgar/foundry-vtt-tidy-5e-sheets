<script lang="ts">
  import type { ClassValue, HTMLAttributes } from 'svelte/elements';
  import type { TabStripInfo } from './Tabs.svelte';

  interface Props extends HTMLAttributes<HTMLElement> {
    tabs: TabStripInfo[];
    selectedTabId?: string | undefined;
    includeTabNumber?: boolean;
    class?: ClassValue;
  }

  let {
    tabs,
    selectedTabId = $bindable(),
    class: classValue,
    includeTabNumber,
  }: Props = $props();
</script>

<nav class={['tidy-vertical-tab-strip', classValue]}>
  <ol
    class={[
      'tidy-vertical-tabs flexcol',
      { ['include-numbers']: !!includeTabNumber },
    ]}
  >
    {#each tabs as tab, i (tab.id)}
      {@const selected = tab.id === selectedTabId}
      <li
        class={['vertical-tab', { selected }]}
        onclick={() => !selected && (selectedTabId = tab.id)}
        {...tab.attributes}
      >
        {tab.title}
      </li>
    {/each}
  </ol>
</nav>
