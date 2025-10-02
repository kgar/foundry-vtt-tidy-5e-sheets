<script lang="ts">
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import ActionBar from '../../shared/ActionBar.svelte';
  import { CONSTANTS } from 'src/constants';
  import { getContext } from 'svelte';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import ActionTables from '../../shared/ActionTables.svelte';
  import SheetPins from '../../shared/SheetPins.svelte';

  let context = $derived(getCharacterSheetQuadroneContext());

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let searchCriteria = $state('');

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  const searchResults = createSearchResultsState();
  setSearchResultsContext(searchResults);

  let actions = $derived(
    SheetSections.configureActionsQuadrone(
      context.actions,
      tabId,
      SheetPreferencesService.getByType(context.actor.type),
      TidyFlags.sectionConfig.get(context.actor)?.[tabId],
    ),
  );

  $effect(() => {
    searchResults.uuids = ItemVisibility.getItemsToShowAtDepth({
      criteria: searchCriteria,
      itemContext: context.itemContext,
      sections: actions,
      tabId: tabId,
    });
  });
</script>

<ActionBar bind:searchCriteria sections={actions} {tabId} />

<SheetPins />

<ActionTables
  sections={actions}
  {inlineToggleService}
  itemContext={context.itemContext}
  {searchCriteria}
  sheetDocument={context.actor}
/>
