<script lang="ts">
  import type { TidySectionBase } from 'src/types/types';
  import ItemsActionBar from './ItemsActionBar.svelte';

  interface Props {
    searchCriteria: string;
    tabId: string;
    sections: TidySectionBase[];
  }

  let {
    searchCriteria = $bindable(),
    tabId,
    sections,
  }: Props = $props();
</script>

<ItemsActionBar bind:searchCriteria {tabId} {sections} />
