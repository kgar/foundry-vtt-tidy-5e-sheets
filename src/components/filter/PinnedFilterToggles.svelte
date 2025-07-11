<script lang="ts">
  import type { ConfiguredItemFilter } from 'src/runtime/item/item.types';
  import PinnedFilterToggle from './PinnedFilterToggle.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    filters: ConfiguredItemFilter[];
    filterGroupName: string;
  }

  let { filters, filterGroupName }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

{#if filters.length}
  <div role="presentation" class="pinned-filter-toggles">
    {#each filters as filter (filter.name)}
      <PinnedFilterToggle {filterGroupName} {filter}>
        {localize(
          filter.useLegacyAbbreviation
            ? (filter.abbreviation ?? filter.text)
            : filter.text,
        )}
      </PinnedFilterToggle>
    {/each}
  </div>
{/if}
