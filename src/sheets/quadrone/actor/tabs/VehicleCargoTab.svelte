<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getVehicleSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import ActorInventoryFooter from 'src/sheets/quadrone/actor/parts/ActorInventoryFooter.svelte';
  import ActorEncumbranceBar from 'src/sheets/quadrone/actor/parts/ActorEncumbranceBar.svelte';
  import InventoryTables from '../../shared/InventoryTables.svelte';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { getContext } from 'svelte';
  import { CONSTANTS } from 'src/constants';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import SheetPins from '../../shared/SheetPins.svelte';
  import InventoryActionBar from '../../shared/InventoryActionBar.svelte';
    import ContainerPanel from '../../shared/ContainerPanel.svelte';

  let context = $derived(getVehicleSheetQuadroneContext());

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  let searchCriteria = $state('');

  const searchResults = createSearchResultsState();
  setSearchResultsContext(searchResults);

  let cargo = $derived(
    SheetSections.configureInventory(
      context.inventory,
      tabId,
      UserSheetPreferencesService.getByType(context.actor.type),
      TidyFlags.sectionConfig.get(context.actor)?.[tabId],
    ),
  );

  let showSheetPins = $derived(
    UserSheetPreferencesService.getDocumentTypeTabPreference(
      context.document.type,
      tabId,
      'showSheetPins',
    ) ?? true,
  );

  $effect(() => {
    searchResults.uuids = ItemVisibility.getItemsToShowAtDepth({
      criteria: searchCriteria,
      itemContext: context.itemContext,
      sections: cargo,
      tabId: tabId,
    });
  });
</script>

<div class="inventory-content">
  <InventoryActionBar bind:searchCriteria sections={cargo} {tabId} />

  {#if showSheetPins}
    <SheetPins />
  {/if}

    {#if context.showContainerPanel && !!context.containerPanelItems.length}
    <ContainerPanel
      {searchCriteria}
      containerPanelItems={context.containerPanelItems}
    />
  {/if}

  <InventoryTables
    sections={cargo}
    editable={context.editable}
    {searchCriteria}
    itemContext={context.itemContext}
    {inlineToggleService}
    sheetDocument={context.actor}
    root={true}
  />

  <div class="vehicle-footer">
    <div class="encumbrance-container">
      <ActorEncumbranceBar actor={context.actor} />
    </div>
    <ActorInventoryFooter useAttunement={false} />
  </div>
</div>
