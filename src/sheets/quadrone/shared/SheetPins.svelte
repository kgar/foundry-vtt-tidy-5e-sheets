<script lang="ts">
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ActorSheetQuadroneContext } from 'src/types/types';
  import SheetPinItem from './SheetPinItem.svelte';
  import SheetPinActivity from './SheetPinActivity.svelte';
  import { error } from 'src/utils/logging';
  import { getContext } from 'svelte';
  import { CONSTANTS } from 'src/constants';
  import { SheetPinsProvider } from 'src/features/sheet-pins/SheetPinsProvider';
  import { getSearchResultsContext } from 'src/features/search/search.svelte';

  let context = $derived(getSheetContext<ActorSheetQuadroneContext>());

  const tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  const searchResults = getSearchResultsContext();

  const sheetPins = $derived(
    SheetPinsProvider.getSheetPinContextsToDisplay(
      context.document,
      context.tabSheetPins,
      tabId,
    ),
  );

  const visiblePins = $derived(
    SheetPinsProvider.filterSheetPinsFromSearch(
      sheetPins,
      searchResults.criteria,
    ),
  );
</script>

{#if visiblePins.length}
  <div class="sheet-pins" data-tidy-sheet-part="sheet-pins">
    {#each visiblePins as ctx (ctx.id)}
      <svelte:boundary
        onerror={(e) =>
          error('An error occurred while rendering a sheet pin', false, e)}
      >
        {#if ctx.type === 'item'}
          <SheetPinItem {ctx} />
        {:else if ctx.type === 'activity'}
          <SheetPinActivity {ctx} />
        {/if}
      </svelte:boundary>
    {/each}
  </div>
{/if}
