<script lang="ts">
  import type { ItemFilterService } from 'src/features/filtering/ItemFilterService';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ConfiguredItemFilter } from 'src/runtime/item/item.types';
  import { settingStore } from 'src/settings/settings';
  import {
    cycleNullTrueFalseForward,
    cycleNullTrueFalseBackward,
  } from 'src/utils/value-cycling';
  import { getContext } from 'svelte';

  export let filter: ConfiguredItemFilter;
  export let filterGroupName: string;
  const onFilter = getContext<ItemFilterService['onFilter']>('onFilter');

  function cycleFilterForward(name: string, currentValue: boolean | null) {
    onFilter(filterGroupName, name, cycleNullTrueFalseForward(currentValue));
  }

  function cycleFilterBackward(name: string, currentValue: boolean | null) {
    onFilter(filterGroupName, name, cycleNullTrueFalseBackward(currentValue));
  }

  const localize = FoundryAdapter.localize;
</script>

<button
  type="button"
  class="filter-option truncate"
  class:include={filter.value === true}
  class:exclude={filter.value === false}
  on:click={() => cycleFilterForward(filter.name, filter.value)}
  on:contextmenu={() => cycleFilterBackward(filter.name, filter.value)}
  tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
  title={localize(filter.text)}
>
  <slot />
</button>

<style lang="scss">
  button.filter-option {
    font-size: 0.75rem;
    background: none;
    text-transform: capitalize;
    border-radius: 0;
    width: auto;
    border: none;
    border-bottom-width: 0.1875rem;
    border-bottom-style: solid;
    border-bottom-color: var(
      --t5e-filter-option-neutral-pin-border-bottom-color
    );
    line-height: normal;
    padding: 0.25rem 0.125rem;
    margin: 0;

    &:hover {
      background: inherit;
      border-bottom-color: var(
        --t5e-filter-option-neutral-pin-hover-border-bottom-color
      );
    }

    &.include,
    &.include:hover {
      border-bottom-color: var(
        --t5e-filter-option-include-pin-border-bottom-color
      );
    }

    &.exclude,
    &.exclude:hover {
      border-bottom-color: var(
        --t5e-filter-option-exclude-pin-border-bottom-color
      );
    }
  }
</style>
