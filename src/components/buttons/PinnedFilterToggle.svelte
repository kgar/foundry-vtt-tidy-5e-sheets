<script lang="ts">
  import type { ItemFilterService } from 'src/features/filtering/ItemFilterService.svelte';
  import type { ConfiguredItemFilter } from 'src/runtime/item/item.types';
  import {
    cycleNullTrueFalseBackward,
    cycleNullTrueFalseForward,
  } from 'src/utils/value-cycling';
  import { getContext, type Snippet } from 'svelte';

  interface Props {
    filter: ConfiguredItemFilter;
    filterGroupName: string;
    disabled?: boolean;
    children?: Snippet;
    class?: string;
  }

  let {
    filter,
    filterGroupName,
    disabled,
    children,
    class: cssClass,
  }: Props = $props();

  let filterStateClass = $derived(
    filter.value === true ? 'include' : filter.value === false ? 'exclude' : '',
  );

  const onFilter = getContext<ItemFilterService['onFilter']>('onFilter');

  function cycleFilterForward(name: string, currentValue: boolean | null) {
    onFilter(filterGroupName, name, cycleNullTrueFalseForward(currentValue));
  }

  function cycleFilterBackward(name: string, currentValue: boolean | null) {
    onFilter(filterGroupName, name, cycleNullTrueFalseBackward(currentValue));
  }
</script>

<button
  class="button toggle-button {filterStateClass} {cssClass ?? ''}"
  class:disabled
  onclick={() => cycleFilterForward(filter.name, filter.value)}
  oncontextmenu={() => cycleFilterBackward(filter.name, filter.value)}
>
  {@render children?.()}
</button>
