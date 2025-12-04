<script lang="ts">
  import { TidyFlags } from 'src/api';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getVehicleSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { InventorySection, ItemLayoutMode } from 'src/types/types';
  import TabFooter from '../../actor/TabFooter.svelte';
  import Currency from '../../actor/Currency.svelte';
  import { settings } from 'src/settings/settings.svelte';
  import EncumbranceBar from '../../actor/EncumbranceBar.svelte';
  import InventoryList from '../../actor/InventoryList.svelte';
  import InventoryGrid from '../../actor/InventoryGrid.svelte';
  import { CONSTANTS } from 'src/constants';
  import Notice from 'src/components/notice/Notice.svelte';
  import UtilityToolbarCommand from 'src/components/utility-bar/UtilityToolbarCommand.svelte';
  import FilterMenu from 'src/components/filter/FilterButton.svelte';
  import UtilityToolbar from 'src/components/utility-bar/UtilityToolbar.svelte';
  import Search from 'src/components/utility-bar/Search.svelte';
  import PinnedFilterToggles from 'src/components/filter/PinnedFilterToggles.svelte';
  import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime.svelte';

  interface Props {
    tabId: string;
  }

  let { tabId }: Props = $props();

  let context = $derived(getVehicleSheetContext());

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
    <Currency document={context.actor} />
  </div>

  {#if settings.value.useCharacterEncumbranceBar && context.encumbrance}
    <EncumbranceBar encumbrance={context.encumbrance} />
  {/if}
</TabFooter>
