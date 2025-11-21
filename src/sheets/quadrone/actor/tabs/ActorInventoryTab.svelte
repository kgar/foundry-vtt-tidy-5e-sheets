<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import InventoryTables from 'src/sheets/quadrone/shared/InventoryTables.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    CharacterSheetQuadroneContext,
    NpcSheetQuadroneContext,
  } from 'src/types/types';
  import { getContext } from 'svelte';
  import ActorInventoryFooter from '../parts/ActorInventoryFooter.svelte';
  import CharacterEncumbranceRow from '../parts/CharacterEncumbranceRow.svelte';
  import InventoryActionBar from '../../shared/InventoryActionBar.svelte';
  import ContainerPanel from 'src/sheets/quadrone/shared/ContainerPanel.svelte';
  import SheetPins from '../../shared/SheetPins.svelte';

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

  const searchResults = createSearchResultsState();
  setSearchResultsContext(searchResults);

  let inventory = $derived(
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
      sections: inventory,
      tabId: tabId,
    });
  });
</script>

<div class="inventory-content">
  <InventoryActionBar bind:searchCriteria sections={inventory} {tabId} />

  {#if showSheetPins}
    <SheetPins />
  {/if}

  <CharacterEncumbranceRow />

  {#if context.showContainerPanel && !!context.containerPanelItems.length}
    <ContainerPanel
      {searchCriteria}
      containerPanelItems={context.containerPanelItems}
    />
  {/if}

  <InventoryTables
    sections={inventory}
    editable={context.editable}
    itemContext={context.itemContext}
    {inlineToggleService}
    {searchCriteria}
    sheetDocument={context.actor}
    root={true}
  />
</div>

<ActorInventoryFooter useAttunement={true} />
