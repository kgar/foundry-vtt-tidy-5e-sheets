<script lang="ts">
    import { CONSTANTS } from 'src/constants';
  import { getSearchResultsContext } from 'src/features/search/search.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import { ColumnsLoadout } from 'src/runtime/item/ColumnsLoadout.svelte';
  import { ItemColumnRuntime } from 'src/runtime/tables/ItemColumnRuntime.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    Actor5e,
    CharacterSheetQuadroneContext,
    NpcSheetQuadroneContext,
    SpellbookSection,
  } from 'src/types/types';
    import { getContext } from 'svelte';

  interface Props {
    section: SpellbookSection;
    searchCriteria: string;
    sheetDocument: Actor5e;
  }

  let { section, searchCriteria, sheetDocument }: Props = $props();

  const tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let searchResults = getSearchResultsContext();

  let hasViewableItems = $derived(
    ItemVisibility.hasViewableItems(section.spells, searchResults.uuids),
  );

  let context =
    $derived(
      getSheetContext<
        CharacterSheetQuadroneContext | NpcSheetQuadroneContext
      >(),
    );
</script>

{#if section.show && (hasViewableItems || (context.unlocked && searchCriteria.trim() === ''))}
  {@const columns = new ColumnsLoadout(
    ItemColumnRuntime.getConfiguredColumnSpecifications(
      sheetDocument.type,
      tabId,
      section.key,
      {
        rowActions: section.rowActions,
      },
    ),
  )}
  <!-- {@const hiddenColumns = ItemColumnRuntime.determineHiddenColumns(
    sectionsInlineWidth,
    columns,
  )} -->
{/if}
