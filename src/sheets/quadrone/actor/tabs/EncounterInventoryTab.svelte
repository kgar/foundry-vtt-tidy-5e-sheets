<script lang="ts">
  import { TidyFlags } from 'src/api';
  import { CONSTANTS } from 'src/constants';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import { getEncounterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { getContext } from 'svelte';
  import InventoryActionBar from '../../shared/InventoryActionBar.svelte';
  import ContainerPanel from '../../shared/ContainerPanel.svelte';
  import InventoryTables from '../../shared/InventoryTables.svelte';
  import ActorInventoryFooter from '../parts/ActorInventoryFooter.svelte';
  import SheetPins from '../../shared/SheetPins.svelte';

  let context = $derived(getEncounterSheetQuadroneContext());

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
      SheetPreferencesService.getByType(context.actor.type),
      TidyFlags.sectionConfig.get(context.actor)?.[tabId],
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
</script>

<div class="group-tab-content flexcol">
  <div class="inventory-content">
    <InventoryActionBar bind:searchCriteria sections={inventory} {tabId} />

    <SheetPins />

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

  <ActorInventoryFooter useAttunement={false} />
</div>
