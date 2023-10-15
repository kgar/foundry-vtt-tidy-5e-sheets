<script lang="ts">
  import type { CharacterSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let setName: string;
  export let filterName: string;
  let context = getContext<Readable<CharacterSheetContext>>('context');

  $: isFilterActive = $context.actor.sheet.isFilterActive(setName, filterName);
</script>

<li
  role="button"
  class="filter-option"
  class:active={isFilterActive}
  on:click|preventDefault|stopPropagation={() =>
    $context.actor.sheet.onToggleFilter(setName, filterName)}
>
  <slot />
</li>

<style lang="scss">
  .filter-option {
    font-size: 0.75rem;
    padding: 0 0.5rem;
    margin-left: 0.125rem;
    flex: unset;
    cursor: pointer;
    border-bottom: 0.1875rem solid var(--t5ek-light-color);

    &:hover {
      border-bottom: 0.1875rem solid var(--t5ek-tertiary-color);
    }

    &.active {
      border-bottom: 0.1875rem solid var(--t5ek-primary-color);
    }
  }
</style>
