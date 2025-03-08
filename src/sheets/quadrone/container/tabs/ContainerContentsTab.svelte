<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import CapacityBar from 'src/sheets/quadrone/container/parts/CapacityBar.svelte';
  import ContainerContentsSections from 'src/sheets/quadrone/container/parts/ContainerContentsSections.svelte';
  import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import Search from '../../shared/Search.svelte';
  import ButtonWithOptionPanel from 'src/components/buttons/ButtonWithOptionPanel.svelte';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';
  import { getContainerSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import TidyVisibilityObserver from 'src/components/utility/TidyVisibilityObserver.svelte';
  import { Container } from 'src/features/containers/Container';
  import ExpandCollapseButton from '../../shared/ExpandCollapseButton.svelte';
  import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime.svelte';
  import FilterToggle from 'src/components/buttons/FilterToggle.svelte';
  import FilterMenuQuadrone from 'src/components/action-bar/FilterButtonMenuQuadrone.svelte';
  import SortButtonWithMenuQuadrone from 'src/components/action-bar/SortButtonWithMenuQuadrone.svelte';

  let context = $derived(getContainerSheetQuadroneContext());
  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  let searchCriteria = $state('');

  const searchResults = createSearchResultsState();
  setSearchResultsContext(searchResults);

  $effect(() => {
    searchResults.uuids = ItemVisibility.getItemsToShowAtDepth({
      criteria: searchCriteria,
      itemContext: context.itemContext,
      sections: context.containerContents.contents,
      tabId: tabId,
    });
  });

  const localize = FoundryAdapter.localize;

  let markerEl: HTMLElement | undefined = $state();
  let footerEl: HTMLElement | undefined = $state();

  let pinnedFilters = $derived(
    ItemFilterRuntime.getPinnedFiltersForTab(
      context.filterPins,
      context.filterData,
      tabId,
    ),
  );
</script>

{#if !!markerEl && !!footerEl}
  <TidyVisibilityObserver
    root={context.item.sheet.windowContent}
    trackWhenOffScreen={true}
    toObserve={[markerEl]}
    toAffect={[footerEl]}
    rootMargin="-12px"
  />
{/if}

<section
  class="action-bar"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ACTION_BAR}
>
  <ExpandCollapseButton />

  <Search bind:searchCriteria />

  <div class="button-group">
    {#each pinnedFilters as pinnedFilter (pinnedFilter.name)}
      <FilterToggle
        filter={pinnedFilter}
        filterGroupName={tabId}
        class={pinnedFilter.pinnedFilterClass}
      >
        {localize(pinnedFilter.text)}
      </FilterToggle>
    {/each}
  </div>

  <FilterMenuQuadrone filterData={context.filterData} {tabId} />

  <SortButtonWithMenuQuadrone doc={context.item} />

  <a class="button icon-button" class:disabled={!context.editable}>
    <i class="fas fa-gear"></i>
  </a>
</section>

<!-- Tables -->
<div class="tidy-table-container">
  <ContainerContentsSections
    contents={context.containerContents.contents}
    container={context.item}
    editable={context.editable}
    itemContext={context.containerContents.itemContext}
    {inlineToggleService}
    lockItemQuantity={context.lockItemQuantity}
    sheetDocument={context.item}
    unlocked={context.unlocked}
  />
</div>

<hr class="golden-fade" />

<div bind:this={markerEl} class="contents-footer-scroll-marker"></div>
<footer bind:this={footerEl} class="contents-footer">
  <!-- Capacity Bar -->
  <CapacityBar container={context.item} capacity={context.capacity} />
  <a
    title={localize('DND5E.ItemCreate')}
    class="button icon-button attention item-create"
    class:disabled={!context.editable}
    onclick={() => Container.promptCreateInventoryItem(context.item)}
  >
    <i class="fas fa-plus"></i>
  </a>
</footer>
