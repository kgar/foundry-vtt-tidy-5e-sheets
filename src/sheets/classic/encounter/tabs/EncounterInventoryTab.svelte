<script lang="ts">
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import FilterMenu from 'src/components/filter/FilterButton.svelte';
  import PinnedFilterToggles from 'src/components/filter/PinnedFilterToggles.svelte';
  import Notice from 'src/components/notice/Notice.svelte';
  import Search from 'src/components/utility-bar/Search.svelte';
  import UtilityToolbar from 'src/components/utility-bar/UtilityToolbar.svelte';
  import UtilityToolbarCommand from 'src/components/utility-bar/UtilityToolbarCommand.svelte';
  import { CONSTANTS } from 'src/constants';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime.svelte';
  import Currency from 'src/sheets/classic/actor/Currency.svelte';
  import InventoryGrid from 'src/sheets/classic/actor/InventoryGrid.svelte';
  import InventoryList from 'src/sheets/classic/actor/InventoryList.svelte';
  import ContainerPanel from 'src/sheets/classic/shared/ContainerPanel.svelte';
  import { getGroupSheetClassicContext } from 'src/sheets/sheet-context.svelte';
  import type { InventorySection, ItemLayoutMode } from 'src/types/types';
  import { getContext } from 'svelte';

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  const context = $derived(getGroupSheetClassicContext());

  let inventory = $derived(
    SheetSections.configureInventory(
      context.inventory,
      tabId,
      SheetPreferencesService.getByType(context.actor.type),
      TidyFlags.sectionConfig.get(context.actor)?.[tabId],
    ),
  );

  let searchCriteria: string = $state('');

  const searchResults = createSearchResultsState();
  setSearchResultsContext(searchResults);

  $effect(() => {
    searchResults.uuids = ItemVisibility.getItemsToShowAtDepth({
      criteria: searchCriteria,
      itemContext: context.itemContext,
      sections: inventory,
      tabId: tabId,
    });
  });

  const localize = FoundryAdapter.localize;

  let layoutMode: ItemLayoutMode = $derived(
    TidyFlags.inventoryGrid.get(context.actor) ? 'grid' : 'list',
  );

  let noItems = $derived(
    inventory.some((section: InventorySection) => section.items.length > 0) ===
      false,
  );

  let utilityBarCommands = $derived(
    context.utilities[tabId]?.utilityToolbarCommands ?? [],
  );
</script>

<UtilityToolbar>
  <Search bind:value={searchCriteria} />
  <PinnedFilterToggles
    filterGroupName={tabId}
    filters={ItemFilterRuntime.getPinnedFiltersForTab(
      context.filterPins,
      context.filterData,
      tabId,
    )}
  />
  <FilterMenu {tabId} />
  {#each utilityBarCommands as command (command.id)}
    <UtilityToolbarCommand
      title={command.title}
      iconClass={command.iconClass}
      text={command.text}
      visible={command.visible ?? true}
      onExecute={(ev) => command.execute?.(ev)}
      sections={inventory}
    />
  {/each}
</UtilityToolbar>

<div
  class="tidy-inventory-container scroll-container flex-column small-gap"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEMS_CONTAINER}
>
  <Currency document={context.actor} />

  {#if noItems && !context.unlocked}
    <Notice>{localize('TIDY5E.EmptySection')}</Notice>
  {:else}
    {@const containerPanelExpanded =
      context.showContainerPanel && !!context.containerPanelItems.length}

    <ExpandableContainer
      expanded={containerPanelExpanded}
      class="container-panel-wrapper {containerPanelExpanded
        ? 'container-panel-expanded'
        : ''}"
    >
      <ContainerPanel containerPanelItems={context.containerPanelItems} />
    </ExpandableContainer>
    {#each inventory as section (section.key)}
      {@const visibleItemCount = ItemVisibility.countVisibleItems(
        section.items,
        searchResults.uuids,
      )}
      {#if section.show}
        {#if (searchCriteria.trim() === '' && context.unlocked) || visibleItemCount > 0}
          {#if layoutMode === 'list'}
            <InventoryList
              {section}
              allowAttuneControl={false}
              allowFavoriteIconNextToName={false}
              allowEquipControl={false}
            >
              {#snippet primaryColumn()}
                {localize(section.label)}
                <span class="item-table-count">{visibleItemCount}</span>
              {/snippet}
            </InventoryList>
          {:else}
            <InventoryGrid {section} />
          {/if}
        {/if}
      {/if}
    {/each}
  {/if}
</div>
