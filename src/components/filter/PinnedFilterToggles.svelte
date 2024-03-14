<script lang="ts">
  import type { ConfiguredItemFilter } from 'src/runtime/item/item.types';
  import PinnedFilterToggle from './PinnedFilterToggle.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  export let filters: ConfiguredItemFilter[];
  export let filterGroupName: string;

  const localize = FoundryAdapter.localize;
</script>

{#if filters.length}
  <div role="presentation" class="pinned-filter-toggles">
    {#each filters as filter (filter.name)}
      <PinnedFilterToggle {filterGroupName} {filter}>
        {localize(filter.abbreviation ?? filter.text)}
      </PinnedFilterToggle>
    {/each}
  </div>
{/if}

