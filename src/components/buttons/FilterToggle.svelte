<script lang="ts">
  import type { ItemFilterService } from 'src/features/filtering/ItemFilterService.svelte';
  import type { ConfiguredItemFilter } from 'src/runtime/item/item.types';
  import { isNil } from 'src/utils/data';
  import { getContext, type Snippet } from 'svelte';
  import type { ClassValue, HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends HTMLButtonAttributes {
    filter: ConfiguredItemFilter;
    filterGroupName: string;
    disabled?: boolean;
    children?: Snippet;
    class?: ClassValue;
  }

  let {
    filter,
    filterGroupName,
    disabled,
    children,
    class: cssClass,
    ...attributes
  }: Props = $props();

  let filterStateClass = $derived(
    filter.value === true ? 'include' : filter.value === false ? 'exclude' : '',
  );

  const onFilter = getContext<ItemFilterService['onFilter']>('onFilter');

  function onLeftClick() {
    var state = filter.value;

    if (isNil(filter.value)) {
      state = true;
    } else if (filter.value === true) {
      state = null;
    } else {
      state = true;
    }

    onFilter(filterGroupName, filter.name, state);
  }

  function onRightClick() {
    var state = filter.value;

    if (isNil(filter.value)) {
      state = false;
    } else if (filter.value === true) {
      state = false;
    } else {
      state = null;
    }

    onFilter(filterGroupName, filter.name, state);
  }
</script>

<button
  type="button"
  class={[
    'button',
    'button-toggle',
    'button-secondary',
    filterStateClass,
    cssClass,
  ]}
  class:disabled
  onclick={onLeftClick}
  oncontextmenu={onRightClick}
  {...attributes}
>
  {@render children?.()}
</button>
