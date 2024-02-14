<script lang="ts">
  import type { ItemFilterService } from 'src/features/filtering/ItemFilterService';
  import { getContext } from 'svelte';

  export let filter: any;
  export let filterGroupName: string;
  const onFilter = getContext<ItemFilterService['onFilter']>('onFilter');

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

<button
  type="button"
  class="transparent-inline-button filter-option"
  class:include={filter.value === true}
  class:exclude={filter.value === false}
  on:click={() => cycleFilterForward(filter.name, filter.value)}
  on:contextmenu={() => cycleFilterBackward(filter.name, filter.value)}
>
  <slot />
</button>

<style lang="scss">
  .filter-option {
    vertical-align: top;
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    flex: 0;
    background: none;
    border: none;
    border-radius: 0;
    border-bottom: 0.1875rem solid var(--t5e-separator-color);
    line-height: unset;
    text-wrap: nowrap;

    display: inline-flex;
    align-items: flex-start;

    &:hover {
      background: none;
      border-bottom: 0.1875rem solid var(--t5e-tertiary-color);
    }

    &.include {
      border-bottom: 0.1875rem solid var(--t5e-primary-color);
    }

    &.exclude {
      border-bottom: 0.1875rem solid var(--t5e-warning-accent-color);
    }
  }
</style>
