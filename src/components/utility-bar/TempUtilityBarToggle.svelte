<script lang="ts">
  import { settingStore } from 'src/settings/settings';
  import type { CharacterSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let setName: string;
  export let filterName: string;
  let context = getContext<Readable<CharacterSheetContext>>('context');

  $: isFilterActive = $context.actor.sheet.isFilterActive(setName, filterName);
</script>

<button
  type="button"
  class="filter-option"
  class:active={isFilterActive}
  on:click={() => $context.actor.sheet.onToggleFilter(setName, filterName)}
  tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
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
    border-bottom: 0.1875rem solid var(--t5ek-separator-color);
    line-height: unset;
    text-wrap: nowrap;

    display: inline-flex;
    align-items: flex-start;

    &:hover {
      background: none;
      border-bottom: 0.1875rem solid var(--t5ek-tertiary-color);
    }

    &.active {
      border-bottom: 0.1875rem solid var(--t5ek-primary-color);
    }
  }
</style>
