<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TempUtilityBarToggle from './TempUtilityBarToggle.svelte';
  import type { UtilityItemFilterParams } from './types';
  import { getContext } from 'svelte';
  import type {
    ItemFilterData,
    ItemFilterService,
  } from 'src/features/filtering/ItemFilterService';
  import type { ActorSheetContext } from 'src/types/types';
  import type { Readable } from 'svelte/store';

  export let filterGroupName: string;

  const onFilter = getContext<ItemFilterService['onFilter']>('onFilter');
  const localize = FoundryAdapter.localize;
  const context = getContext<Readable<ActorSheetContext>>('context');
  $: filters = $context.itemFilterData['inventory'];

  // TODO: Extract null/true/false cycling into its own set of universal functions.
  const filterCycle = [null, true, false];

  function cycleFilterForward(name: string, currentValue: boolean | null) {
    const currentValueIndex = filterCycle.indexOf(currentValue);
    const newValue = filterCycle[(currentValueIndex + 1) % filterCycle.length];
    onFilter(filterGroupName, name, newValue);
  }

  function cycleFilterBackward(name: string, currentValue: boolean | null) {
    const currentValueIndex = filterCycle.indexOf(currentValue);
    const newValue = filterCycle.at(currentValueIndex - 1);
    onFilter(filterGroupName, name, newValue ?? null);
  }
</script>

{#if filters.length}
  <div class="flex-row extra-small-gap">
    {#each filters as filter (filter.text)}
      <button
        type="button"
        class="transparent-inline-button"
        on:click={(ev) => cycleFilterForward(filter.name, filter.value)}
        on:contextmenu={(ev) => cycleFilterBackward(filter.name, filter.value)}
      >
        {localize(filter.text)} - {filter.value}
      </button>
    {/each}
  </div>
{/if}
