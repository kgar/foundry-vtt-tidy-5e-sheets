<script lang="ts">
  import { run } from 'svelte/legacy';

  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import FilterMenu from 'src/components/filter/FilterMenu.svelte';
  import PinnedFilterToggles from 'src/components/filter/PinnedFilterToggles.svelte';
  import Notice from 'src/components/notice/Notice.svelte';
  import Search from 'src/components/utility-bar/Search.svelte';
  import UtilityToolbar from 'src/components/utility-bar/UtilityToolbar.svelte';
  import UtilityToolbarCommand from 'src/components/utility-bar/UtilityToolbarCommand.svelte';
  import { CONSTANTS } from 'src/constants';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime';
  import Currency from 'src/sheets/classic/actor/Currency.svelte';
  import InventoryGrid from 'src/sheets/classic/actor/InventoryGrid.svelte';
  import InventoryList from 'src/sheets/classic/actor/InventoryList.svelte';
  import TabFooter from 'src/sheets/classic/actor/TabFooter.svelte';
  import ContainerPanel from 'src/sheets/classic/shared/ContainerPanel.svelte';
  import type { GroupSheetClassicContext } from 'src/types/group.types';
  import type { InventorySection, ItemLayoutMode } from 'src/types/types';
  import { getContext, setContext } from 'svelte';
  import { writable, type Readable } from 'svelte/store';

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let context = getContext<Readable<GroupSheetClassicContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  let inventory = $derived(
    SheetSections.configureInventory(
      $context.inventory,
      tabId,
      SheetPreferencesService.getByType($context.actor.type),
      TidyFlags.sectionConfig.get($context.actor)?.[tabId],
    ),
  );

  let searchCriteria: string = $state('');

  const itemIdsToShow = writable<Set<string> | undefined>(undefined);
  setContext(CONSTANTS.SVELTE_CONTEXT.ITEM_IDS_TO_SHOW, itemIdsToShow);

  run(() => {
    $itemIdsToShow = ItemVisibility.getItemsToShowAtDepth({
      criteria: searchCriteria,
      itemContext: $context.itemContext,
      sections: inventory,
      tabId: tabId,
    });
  });

  const localize = FoundryAdapter.localize;

  let layoutMode: ItemLayoutMode = $derived(
    TidyFlags.inventoryGrid.get($context.actor) ? 'grid' : 'list',
  );

  let noItems = $derived(
    inventory.some((section: InventorySection) => section.items.length > 0) ===
      false,
  );

  let utilityBarCommands = $derived(
    $context.utilities[tabId]?.utilityToolbarCommands ?? [],
  );
</script>

<UtilityToolbar>
  <Search bind:value={searchCriteria} />
  <PinnedFilterToggles
    filterGroupName={tabId}
    filters={ItemFilterRuntime.getPinnedFiltersForTab(
      $context.filterPins,
      $context.filterData,
      tabId,
    )}
  />
  <FilterMenu {tabId} />
  {#each utilityBarCommands as command (command.title)}
    <UtilityToolbarCommand
      title={command.title}
      iconClass={command.iconClass}
      text={command.text}
      visible={command.visible ?? true}
      on:execute={(ev) => command.execute?.(ev.detail)}
    />
  {/each}
</UtilityToolbar>

<div
  class="tidy-inventory-container scroll-container flex-column small-gap"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEMS_CONTAINER}
>
  {#if noItems && !$context.unlocked}
    <Notice>{localize('TIDY5E.EmptySection')}</Notice>
  {:else}
    {@const containerPanelExpanded =
      $context.showContainerPanel && !!$context.containerPanelItems.length}

    <Currency document={$context.actor} />

    <ExpandableContainer
      expanded={containerPanelExpanded}
      class="container-panel-wrapper {containerPanelExpanded
        ? 'container-panel-expanded'
        : ''}"
    >
      <ContainerPanel
        containerPanelItems={$context.containerPanelItems}
        {searchCriteria}
      />
    </ExpandableContainer>
    {#each inventory as section (section.key)}
      {@const visibleItemCount = ItemVisibility.countVisibleItems(
        section.items,
        $itemIdsToShow,
      )}
      {#if section.show}
        {#if (searchCriteria.trim() === '' && $context.unlocked) || visibleItemCount > 0}
          {#if layoutMode === 'list'}
            <InventoryList
              primaryColumnName="{localize(section.label)} ({visibleItemCount})"
              {section}
              items={section.items}
              allowAttuneControl={false}
              allowFavoriteIconNextToName={false}
              allowEquipControl={false}
            />
          {:else}
            <InventoryGrid items={section.items} {section} />
          {/if}
        {/if}
      {/if}
    {/each}
  {/if}
</div>
