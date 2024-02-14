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
  class="filter-option pill-button"
  class:include={filter.value === true}
  class:exclude={filter.value === false}
  on:click={() => cycleFilterForward(filter.name, filter.value)}
  on:contextmenu={() => cycleFilterBackward(filter.name, filter.value)}
  tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
>
  <slot />
</button>

<style lang="scss">
  .filter-option.pill-button {
    --filter-option-include-color: var(--t5e-light-color);
    --filter-option-exclude-color: var(--t5e-warning-accent-color);

    font-size: 0.75rem;
    background: none;
    text-wrap: nowrap;

    &.include,
    &.include:hover {
      background-color: var(--filter-option-include-color);
    }

    &.exclude,
    &.exclude:hover {
      background-color: var(--filter-option-exclude-color);
    }
  }
</style>
