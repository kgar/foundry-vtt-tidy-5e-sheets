<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext, type Snippet } from 'svelte';
  import ButtonWithOptionPanel from '../buttons/ButtonWithOptionPanel.svelte';
  import type { ItemFilterService } from 'src/features/filtering/ItemFilterService.svelte';
  import type { DocumentFilters } from 'src/runtime/item/item.types';
  import FilterToggle from '../buttons/FilterToggle.svelte';
  import { CONSTANTS } from 'src/constants';

  const localize = FoundryAdapter.localize;

  interface Props {
    tabId: string;
    filterData: DocumentFilters;
    beforeClearButton?: Snippet;
  }

  const { tabId, filterData, beforeClearButton }: Props = $props();

  const onFilterClearAll = getContext<ItemFilterService['onFilterClearAll']>(
    CONSTANTS.SVELTE_CONTEXT.ON_FILTER_CLEAR_ALL,
  );

  let categories = $derived(filterData[tabId] ?? {});

  let filterButtonActive = $derived(
    Object.entries(categories).some(([_, filters]) =>
      filters.some((f) => f.value !== null),
    ),
  );
  let filterMenuExpanded = $state(false);
</script>

<ButtonWithOptionPanel
  active={filterButtonActive}
  side="right"
  bind:expanded={filterMenuExpanded}
  onclick={() => (filterMenuExpanded = !filterMenuExpanded)}
  buttonClasses="button-icon-only button-toggle"
  containerClasses="filter-menu"
  buttonAttributes={{
    title: localize('TIDY5E.ItemFilters.MenuTooltip.Filters'),
  }}
>
  <i class="fas fa-filter"></i>
  {#snippet menu()}
    {#each Object.entries(categories) as [category, filters]}
      <section class="filter-group">
        <h4 class="filter-group-header">
          {localize(category)}
        </h4>
        <div class="filters">
          {#each filters as filter}
            <FilterToggle filterGroupName={tabId} {filter}>
              {localize(filter.text)}
            </FilterToggle>
          {/each}
        </div>
      </section>
    {/each}

    {#if beforeClearButton}
      {@render beforeClearButton()}
    {/if}

    <button
      type="button"
      class="button clear-all-filters"
      onclick={(ev) => {
        onFilterClearAll(tabId);
        filterMenuExpanded = false;
      }}
    >
      <i class="fa-solid fa-xmark"></i>
      {localize('TIDY5E.ItemFilters.ClearAll')}
    </button>
  {/snippet}
</ButtonWithOptionPanel>
