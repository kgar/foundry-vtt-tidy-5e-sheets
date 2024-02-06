<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TempUtilityBarToggle from './TempUtilityBarToggle.svelte';
  import type { UtilityItemFilterParams } from './types';

  export let filters: UtilityItemFilterParams[] = [];

  const localize = FoundryAdapter.localize;
</script>

{#if filters.length}
  <div class="flex-row extra-small-gap">
    {#each filters as filter (filter.text)}
      <TempUtilityBarToggle
        filterName={filter.filterName}
        setName={filter.setName}
      >
        {localize(filter.text)}
      </TempUtilityBarToggle>
    {/each}
  </div>
{/if}
