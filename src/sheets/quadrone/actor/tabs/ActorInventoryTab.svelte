<script lang="ts">
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
  import ActorActionBar from '../parts/ActorActionBar.svelte';
  import CharacterInventoryFooter from '../character-parts/CharacterInventoryFooter.svelte';
  import CharacterEncumbranceRow from '../parts/CharacterEncumbranceRow.svelte';

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

<ActorActionBar bind:searchCriteria sections={inventory} {tabId} />

<CharacterEncumbranceRow />

<ItemTables
  sections={inventory}
  editable={context.editable}
  itemContext={context.itemContext}
  {inlineToggleService}
  sheetDocument={context.actor}
  unlocked={context.unlocked}
  root={true}
/>

<CharacterInventoryFooter
  class={{ hidden: tabId !== CONSTANTS.TAB_ACTOR_INVENTORY }}
/>
