<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ContainerItemContext, Item5e } from 'src/types/item.types';
  import type {
    Actor5e,
    CharacterItemContext,
    InventorySection,
    NpcItemContext,
    TidySectionBase,
  } from 'src/types/types';
  import { CONSTANTS } from 'src/constants';
  import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { getContext } from 'svelte';
  import { getSearchResultsContext } from 'src/features/search/search.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import InventoryTable from './InventoryTable.svelte';

  interface Props {
    sections: InventorySection[];
    container?: Item5e;
    editable: boolean;
    itemContext: Record<
      string,
      ContainerItemContext | CharacterItemContext | NpcItemContext
    >;
    inlineToggleService: InlineToggleService;
    searchCriteria: string;
    /** The sheet which is rendering this recursive set of container contents. */
    sheetDocument: Actor5e | Item5e;
    /** Denotes whether this layer of nested tables is the root (top) layer. This affects what styles go into effect. */
    root?: boolean;
  }

  let {
    sections,
    container,
    editable,
    itemContext,
    inlineToggleService,
    searchCriteria,
    sheetDocument,
    root,
  }: Props = $props();

  const tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  const columnsEffectiveTabId = $derived(
    container ? CONSTANTS.TAB_CONTAINER_CONTENTS : tabId,
  );

  let containingDocument = $derived(container ?? sheetDocument);

  const searchResults = getSearchResultsContext();

  let context = $derived(getSheetContext());

  const localize = FoundryAdapter.localize;

  let sectionsContainer: HTMLElement;
  let sectionsInlineWidth: number = $state(0);

  function onResize(entry: ResizeObserverEntry) {
    sectionsInlineWidth = entry.borderBoxSize[0].inlineSize;
  }

  $effect(() => {
    const observer = new ResizeObserver(([entry]) => onResize(entry));
    observer.observe(sectionsContainer);

    return () => {
      observer.disconnect();
    };
  });

  let totalItemCount = $derived(
    sections.reduce((count, s) => count + s.items.length, 0),
  );
</script>

<div class={{ ['tidy-table-container']: root }} bind:this={sectionsContainer}>
  {#if totalItemCount === 0 && root && context.editable}
    <div class="inventory-empty empty-state-container">
      <button
        type="button"
        class="button button-tertiary"
        title={localize('DND5E.ItemCreate')}
        aria-label={localize('DND5E.ItemCreate')}
        onclick={() =>
          sheetDocument.sheet._addDocument({
            tabId,
          })}
      >
        <i class="fas fa-plus"></i>
        {localize('DND5E.ItemCreate')}
      </button>
    </div>
  {:else}
    {#each sections as section (section.key)}
      {@const hasViewableItems = ItemVisibility.hasViewableItems(
        section.items,
        searchResults.uuids,
      )}
      {#if section.show && hasViewableItems}
        <InventoryTable
          {containingDocument}
          {editable}
          {inlineToggleService}
          {itemContext}
          {searchCriteria}
          {section}
          {sectionsInlineWidth}
          {sheetDocument}
          {tabId}
          {columnsEffectiveTabId}
          {root}
        />
      {/if}
    {/each}
  {/if}
</div>
