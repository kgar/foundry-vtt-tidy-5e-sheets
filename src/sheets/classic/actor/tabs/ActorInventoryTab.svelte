<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type CharacterSheetContext } from 'src/types/types';
  import type {
    InventorySection,
    ItemLayoutMode,
    NpcSheetContext,
  } from 'src/types/types';
  import InventoryList from '../InventoryList.svelte';
  import InventoryGrid from '../InventoryGrid.svelte';
  import Currency from 'src/sheets/classic/actor/Currency.svelte';
  import Notice from '../../../../components/notice/Notice.svelte';
  import EncumbranceBar from 'src/sheets/classic/actor/EncumbranceBar.svelte';
  import TabFooter from 'src/sheets/classic/actor/TabFooter.svelte';
  import { settings } from 'src/settings/settings.svelte';
  import { CONSTANTS } from 'src/constants';
  import UtilityToolbar from 'src/components/utility-bar/UtilityToolbar.svelte';
  import Search from 'src/components/utility-bar/Search.svelte';
  import UtilityToolbarCommand from 'src/components/utility-bar/UtilityToolbarCommand.svelte';
  import FilterMenu from 'src/components/filter/FilterButton.svelte';
  import ContainerPanel from 'src/sheets/classic/shared/ContainerPanel.svelte';
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import PinnedFilterToggles from 'src/components/filter/PinnedFilterToggles.svelte';
  import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime.svelte';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import AttunementTracker from '../AttunementTracker.svelte';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';

  interface Props {
    tabId: string;
  }

  let { tabId }: Props = $props();

  let context =
    $derived(getSheetContext<CharacterSheetContext | NpcSheetContext>());

  let inventory = $derived(
    SheetSections.configureInventory(
      context.inventory,
      tabId,
      UserSheetPreferencesService.getByType(context.actor.type),
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
            <InventoryList {section}>
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

<TabFooter mode="vertical">
  <div class="attunement-and-currency">
    <AttunementTracker class="align-self-center" />
    <Currency document={context.actor} />
  </div>

  {#if settings.value.useCharacterEncumbranceBar && context.encumbrance}
    <EncumbranceBar encumbrance={context.encumbrance} />
  {/if}
</TabFooter>

<style lang="less">
  .attunement-and-currency {
    display: flex;
    flex: 0 0 1.875rem;
    gap: 0.5rem;
  }

  .tidy-inventory-container
    :global(.container-panel-wrapper:not(.container-panel-expanded)) {
    margin-bottom: -0.5rem;
  }
</style>
