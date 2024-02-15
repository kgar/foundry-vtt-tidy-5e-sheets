<script lang="ts">
  import type { ItemFilterService } from 'src/features/filtering/ItemFilterService';
  import { settingStore } from 'src/settings/settings';
  import {
    cycleNullTrueFalseForward,
    cycleNullTrueFalseBackward,
  } from 'src/utils/value-cycling';
  import { getContext } from 'svelte';

  export let filter: any;
  export let filterGroupName: string;
  const onFilter = getContext<ItemFilterService['onFilter']>('onFilter');

  function cycleFilterForward(name: string, currentValue: boolean | null) {
    onFilter(filterGroupName, name, cycleNullTrueFalseForward(currentValue));
  }

  function cycleFilterBackward(name: string, currentValue: boolean | null) {
    onFilter(filterGroupName, name, cycleNullTrueFalseBackward(currentValue));
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
    // TODO: Extract to color picker settings
    --filter-option-include-background: var(--t5e-tertiary-color);
    --filter-option-include-color: white;
    --filter-option-exclude-background: var(--t5e-warning-accent-color);
    --filter-option-exclude-color: white;

    font-size: 0.75rem;
    background: none;
    text-wrap: nowrap;
    text-transform: capitalize;

    &.include,
    &.include:hover {
      color: var(--filter-option-include-color);
      background: var(--filter-option-include-background);
    }

    &.exclude,
    &.exclude:hover {
      color: var(--filter-option-exclude-color);
      background: var(--filter-option-exclude-background);
    }
  }
</style>
