<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import CapacityBar from 'src/sheets/quadrone/container/parts/CapacityBar.svelte';
  import ContainerContentsSections from 'src/sheets/quadrone/container/parts/ContainerContentsSections.svelte';
  import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import Search from '../../shared/Search.svelte';
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
  import { ConfigureSectionsApplication } from 'src/applications-quadrone/configure-sections/ConfigureSectionsApplication.svelte';
  import { TidyFlags } from 'src/api';
  import { ItemSheetRuntime } from 'src/runtime/item/ItemSheetRuntime';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';

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

  let tabName = $derived(ItemSheetRuntime.getTabTitle(tabId, {}));

  // TODO: Make this a callback to send through to the component for preparing sections properly
  let configuredContents = $derived(
    SheetSections.configureInventory(
      context.containerContents.contents.filter((i) => i.items.length),
      tabId,
      SheetPreferencesService.getByType(context.item.type),
      TidyFlags.sectionConfig.get(context.item)?.[
        CONSTANTS.TAB_CONTAINER_CONTENTS
      ],
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

  <SortButtonWithMenuQuadrone doc={context.item} {...context.contentsSort} />

  <a
    class="button button-icon-only"
    class:disabled={!context.editable}
    title={localize('TIDY5E.ConfigureTab.Title', { tabName: tabName })}
    onclick={() =>
      context.editable &&
      new ConfigureSectionsApplication({
        document: context.item,
        settings: {
          tabId,
          sections: configuredContents,
          optionsGroups: [
            // TODO: Restore this option when we've implemented the container panel row for inventories
            // {
            //   title: 'TIDY5E.DisplayOptions.Title',
            //   settings: [
            //     {
            //       type: 'boolean',
            //       checked: false,
            //       label: 'TIDY5E.DisplayOptions.ShowContainerRow.Label',
            //       prop: TidyFlags.showContainerPanel.prop,
            //     },
            //   ],
            // },
          ],
          formTitle: localize('TIDY5E.ConfigureTab.Title', {
            tabName: tabName,
          }),
        },
        window: {
          title: localize('TIDY5E.ConfigureTab.Title', { tabName: tabName }),
        },
      }).render({ force: true })}
  >
    <i class="fas fa-gear"></i>
  </a>
</section>

<!-- Tables -->
<ContainerContentsSections
  contents={context.containerContents.contents}
  container={context.item}
  editable={context.editable}
  itemContext={context.containerContents.itemContext}
  {inlineToggleService}
  sheetDocument={context.item}
  unlocked={context.unlocked}
  root={true}
/>

<hr class="golden-fade" />

<div bind:this={markerEl} class="contents-footer-scroll-marker"></div>
<footer bind:this={footerEl} class="contents-footer">
  <!-- Capacity Bar -->
  <CapacityBar container={context.item} capacity={context.capacity} />
  <a
    title={localize('DND5E.ItemCreate')}
    class="button button-icon-only button-primary item-create"
    class:disabled={!context.editable}
    onclick={() => Container.promptCreateInventoryItem(context.item)}
  >
    <i class="fas fa-plus"></i>
  </a>
</footer>
