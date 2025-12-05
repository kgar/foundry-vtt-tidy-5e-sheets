<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import { getVehicleSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { getContext } from 'svelte';
  import FeatureTables from '../../shared/FeatureTables.svelte';

  let context = $derived(getVehicleSheetQuadroneContext());

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let searchCriteria = $state('');

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  const searchResults = createSearchResultsState();
  setSearchResultsContext(searchResults);

  // Vehicle features don't use SheetSections.configureFeatures
  // They are already configured in the sheet class
  let features = $derived(context.features);

  $effect(() => {
    searchResults.uuids = ItemVisibility.getItemsToShowAtDepth({
      criteria: searchCriteria,
      itemContext: context.itemContext,
      sections: features,
      tabId: tabId,
    });
  });
</script>

<FeatureTables
  sections={features}
  {inlineToggleService}
  itemContext={context.itemContext}
  {searchCriteria}
  sheetDocument={context.actor}
/>
