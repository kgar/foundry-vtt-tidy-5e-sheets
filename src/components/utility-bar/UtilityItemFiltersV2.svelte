<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import type { ActorSheetContext } from 'src/types/types';
  import type { Readable } from 'svelte/store';
  import TempUtilityBarToggleV2 from './TempUtilityBarToggleV2.svelte';

  export let filterGroupName: string;

  const localize = FoundryAdapter.localize;
  const context = getContext<Readable<ActorSheetContext>>('context');
  $: filters = $context.itemFilterData['inventory'];
</script>

{#if filters.length}
  <div class="flex-row extra-small-gap">
    {#each filters as filter (filter.text)}
      <TempUtilityBarToggleV2 {filterGroupName} {filter}>
        {localize(filter.text)}
      </TempUtilityBarToggleV2>
    {/each}
  </div>
{/if}
