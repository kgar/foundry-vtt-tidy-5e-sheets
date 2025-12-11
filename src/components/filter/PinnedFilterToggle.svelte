<script lang="ts">
  import type { ItemFilterService } from 'src/features/filtering/ItemFilterService.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ConfiguredItemFilter } from 'src/runtime/item/item.types';
  import { settings } from 'src/settings/settings.svelte';
  import {
    cycleNullTrueFalseForward,
    cycleNullTrueFalseBackward,
  } from 'src/utils/value-cycling';
  import { getContext, type Snippet } from 'svelte';

  interface Props {
    filter: ConfiguredItemFilter;
    filterGroupName: string;
    children?: Snippet;
  }

  let { filter, filterGroupName, children }: Props = $props();

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
  class="pinned-filter-toggle truncate"
  class:include={filter.value === true}
  class:exclude={filter.value === false}
  onclick={() => cycleFilterForward(filter.name, filter.value)}
  oncontextmenu={() => cycleFilterBackward(filter.name, filter.value)}
  title={localize(filter.text)}
>
  {@render children?.()}
</button>
