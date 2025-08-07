<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settings } from 'src/settings/settings.svelte';
  import type { LocationToSearchTextMap, OnSearchFn } from 'src/types/types';
  import { getContext, onMount } from 'svelte';

  interface Props {
    value: string;
  }

  let { value = $bindable() }: Props = $props();

  async function rememberSearch() {
    onSearch?.(location, value);
  }

  async function clearSearch() {
    value = '';
    rememberSearch();
  }

  const searchFilters = getContext<LocationToSearchTextMap>(
    CONSTANTS.SVELTE_CONTEXT.SEARCH_FILTERS,
  );
  const onSearch = getContext<OnSearchFn>(CONSTANTS.SVELTE_CONTEXT.ON_SEARCH);
  const location = getContext<string>(CONSTANTS.SVELTE_CONTEXT.LOCATION);

  const localize = FoundryAdapter.localize;

  onMount(() => {
    value = searchFilters?.get(location) ?? '';
  });
</script>

<div
  class="search-container"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.SEARCH_CONTAINER}
>
  <input
    class="search"
    type="text"
    title={localize('TIDY5E.SearchHint')}
    placeholder={localize('TIDY5E.Search')}
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.SEARCH_INPUT}
    bind:value
    onblur={(event) => {
      event.preventDefault();
      event.stopPropagation();
      rememberSearch();
    }}
  />
  {#if value?.trim() !== ''}
    <button
      type="button"
      class="inline-icon-button search-close-button"
      onclick={() => clearSearch()}
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.SEARCH_CLEAR}
      tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
    >
      <i class="fas fa-times"></i>
    </button>
  {/if}
</div>

<style lang="scss">
  .search-container {
    flex-grow: 1;
    position: relative;
    align-self: stretch;
    display: flex;
    align-items: stretch;

    .search {
      height: unset;
      border-radius: 0.3125rem;
      padding-left: 0.25rem;
      padding-right: 0.25rem;
      border: 0.0625rem solid var(--t5e-light-color);
      font-size: 0.75rem;
      min-height: 1.5rem;

      &:focus,
      &:hover {
        border-color: none;
      }
    }

    .search-close-button {
      position: absolute;
      right: 0.375rem;
      top: 0.5rem;
      color: var(--t5e-tertiary-color);
      font-size: 0.75rem;
    }
  }
</style>
