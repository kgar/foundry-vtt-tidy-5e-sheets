<script lang="ts">
  import { ConfigureSectionsApplication } from 'src/applications-quadrone/configure-sections/ConfigureSectionsApplication.svelte';
  import { CONSTANTS } from 'src/constants';
  import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import ItemTables from 'src/sheets/quadrone/shared/ItemTables.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    CharacterSheetQuadroneContext,
    NpcSheetQuadroneContext,
  } from 'src/types/types';
  import { getContext } from 'svelte';
  import ExpandCollapseButton from '../../shared/ExpandCollapseButton.svelte';
  import Search from 'src/sheets/quadrone/shared/Search.svelte';
  import FilterToggle from 'src/components/buttons/FilterToggle.svelte';
  import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import FilterMenuQuadrone from 'src/components/action-bar/FilterButtonMenuQuadrone.svelte';
  import SortButtonWithMenuQuadrone from 'src/components/action-bar/SortButtonWithMenuQuadrone.svelte';
  import CharacterSheetQuadroneRuntime from 'src/runtime/actor/CharacterSheetQuadroneRuntime.svelte';

  let context =
    $derived(
      getSheetContext<
        CharacterSheetQuadroneContext | NpcSheetQuadroneContext
      >(),
    );

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  let searchCriteria = $state('');

  const localize = FoundryAdapter.localize;

  const searchResults = createSearchResultsState();
  setSearchResultsContext(searchResults);

  let inventory = $derived(
    SheetSections.configureInventory(
      context.inventory,
      tabId,
      SheetPreferencesService.getByType(context.actor.type),
      TidyFlags.sectionConfig.get(context.actor)?.[tabId],
    ),
  );

  let pinnedFilters = $derived(
    ItemFilterRuntime.getPinnedFiltersForTab(
      context.filterPins,
      context.filterData,
      tabId,
    ),
  );

  $effect(() => {
    searchResults.uuids = ItemVisibility.getItemsToShowAtDepth({
      criteria: searchCriteria,
      itemContext: context.itemContext,
      sections: inventory,
      tabId: tabId,
    });
  });

  let tabName = $derived(
    context.actor.type === CONSTANTS.SHEET_TYPE_CHARACTER
      ? CharacterSheetQuadroneRuntime.getTabTitle(tabId)
      : 'TODO',
  );
</script>

<!-- 
  TODO: 
  Container Contents already has an action bar. 
  Is there a way to minimize redundancy? 
  Additionally, how much can be deferred to a shared component 
  instead of requiring context prep?
  -->
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

  <SortButtonWithMenuQuadrone doc={context.actor} {tabId} />

  <a
    class="button button-icon-only"
    class:disabled={!context.editable}
    title={localize('TIDY5E.ConfigureTab.Title', { tabName: tabName })}
    onclick={() =>
      context.editable &&
      new ConfigureSectionsApplication({
        document: context.actor,
        settings: {
          tabId,
          sections: inventory,
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

<ItemTables
  sections={inventory}
  editable={context.editable}
  itemContext={context.itemContext}
  {inlineToggleService}
  sheetDocument={context.actor}
  unlocked={context.unlocked}
  root={true}
/>
