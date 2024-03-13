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
  class="filter-toggle-button pill-button truncate"
  class:include={filter.value === true}
  class:exclude={filter.value === false}
  on:click={() => cycleFilterForward(filter.name, filter.value)}
  on:contextmenu={() => cycleFilterBackward(filter.name, filter.value)}
  tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
  title={localize(filter.text)}
>
  <slot />
</button>
