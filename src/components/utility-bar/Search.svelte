<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { LocationToSearchTextMap, OnSearchFn } from 'src/types/types';
  import { getContext, onMount } from 'svelte';

  export let value: string;

  async function rememberSearch() {
    onSearch?.(location, value);
  }

  async function clearSearch() {
    value = '';
    rememberSearch();
  }

  const searchFilters = getContext<LocationToSearchTextMap>('searchFilters');
  const onSearch = getContext<OnSearchFn>('onSearch');
  const location = getContext<string>('location');

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
    on:blur|preventDefault|stopPropagation={() => rememberSearch()}
  />
  {#if value?.trim() !== ''}
    <button
      class="inline-icon-button search-close-button"
      on:click={() => clearSearch()}
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.SEARCH_CLEAR}
    >
      <i class="fas fa-times"></i>
    </button>
  {/if}
</div>

<style lang="scss">
  .search-container {
    flex-grow: 1;
    position: relative;

    .search {
      border-radius: 0.3125rem;
      padding-left: 0.25rem;
      padding-right: 0.25rem;
      border: 0.0625rem solid var(--t5ek-light-color);
      font-size: 0.75rem;

      &:focus, &:hover {
        border-color: none;
      }
    }

    .search-close-button {
      position: absolute;
      right: 0.375rem;
      top: 0.5rem;
      color: var(--t5ek-tertiary-color);
      font-size: 0.75rem;
    }
  }
</style>
