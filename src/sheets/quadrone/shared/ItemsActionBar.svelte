<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    ActorSheetQuadroneContext,
    TidySectionBase,
  } from 'src/types/types';
  import ExpandCollapseButton from './ExpandCollapseButton.svelte';
  import Search from 'src/sheets/quadrone/shared/Search.svelte';
  import FilterToggle from 'src/components/buttons/FilterToggle.svelte';
  import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import FilterButtonMenuQuadrone from 'src/components/action-bar/FilterButtonMenuQuadrone.svelte';
  import SortButtonWithMenuQuadrone from 'src/components/action-bar/SortButtonWithMenuQuadrone.svelte';
  import type { ContainerSheetQuadroneContext } from 'src/types/item.types';
  import { ItemSortRuntime } from 'src/runtime/item/ItemSortRuntime.svelte';

  interface Props {
    searchCriteria: string;
    tabId: string;
    sections?: TidySectionBase[];
  }

  let {
    searchCriteria = $bindable(),
    tabId,
  }: Props = $props();

  const localize = FoundryAdapter.localize;

  let context =
    $derived(
      getSheetContext<
        ActorSheetQuadroneContext | ContainerSheetQuadroneContext
      >(),
    );

  let tab = $derived(context.tabs.find((t) => t.id === tabId));

  let tabName = $derived(localize(tab?.title ?? ''));

  let pinnedFilters = $derived(
    ItemFilterRuntime.getPinnedFiltersForTab(
      context.filterPins,
      context.filterData,
      tabId,
    ),
  );

  let methods = $derived(
    ItemSortRuntime.getDocumentSortMethodsQuadrone(context.document, tabId) ??
      [],
  );
</script>

<section
  class="action-bar"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ACTION_BAR}
>
  <ExpandCollapseButton />

  <Search bind:searchCriteria />

  {#if pinnedFilters.length}
    <div class="button-group hide-under-400">
      {#each pinnedFilters as pinnedFilter (pinnedFilter.name)}
        <FilterToggle
          filter={pinnedFilter}
          filterGroupName={tabId}
          class={pinnedFilter.pinnedFilterClass}
          data-tooltip={localize(pinnedFilter.text)}
          data-filter-text={localize(pinnedFilter.text)}
          data-filter-abbr={pinnedFilter.abbreviation
            ? localize(pinnedFilter.abbreviation)
            : ''}
        >
          {localize(pinnedFilter.text)}
        </FilterToggle>
      {/each}
    </div>
  {/if}

  {#if Object.keys(context.filterData?.[tabId] ?? {}).length}
    <FilterButtonMenuQuadrone filterData={context.filterData} {tabId} />
  {/if}

  <SortButtonWithMenuQuadrone doc={context.document} {tabId} {methods} />

  {#if context.editable}
    <button
      type="button"
      class="button button-icon-only"
      data-action="configureTab"
      data-tab-id={tabId}
      aria-label={localize('TIDY5E.ConfigureTab.Title', { tabName: tabName })}
      data-tooltip
    >
      <i class="fas fa-gear"></i>
    </button>
  {/if}
</section>
