<script lang="ts">
  import type { ItemFilterService } from 'src/features/filtering/ItemFilterService';
  import { settingStore } from 'src/settings/settings';
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
  class="filter-option"
  class:include={filter.value === true}
  class:exclude={filter.value === false}
  on:click={() => cycleFilterForward(filter.name, filter.value)}
  on:contextmenu={() => cycleFilterBackward(filter.name, filter.value)}
  tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
>
  <slot />
</button>

<style lang="scss">
  .filter-option {
    --filter-option-background: pink;
    --filter-option-hover: blue;
    --filter-option-include: green;
    --filter-option-exclude: red;

    // vertical-align: top;
    font-size: 0.75rem;
    padding: 0.25rem;
    flex: 0;
    background: none;
    border: none;
    border-radius: 5px;
    background-color: var(--filter-option-background);
    // border-bottom: 0.1875rem solid var(--t5e-separator-color);
    line-height: unset;
    text-wrap: nowrap;

    display: inline-flex;
    align-items: flex-start;

    &:hover {
      background-color: var(--filter-option-hover);
    }

    &.include {
      background-color: var(--filter-option-include);
    }

    &.exclude {
      background-color: var(--filter-option-exclude);
    }
  }
</style>
