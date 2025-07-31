<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { getSearchResultsContext } from 'src/features/search/search.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { Item5e } from 'src/types/item.types';
  import type {
    Actor5e,
    CharacterItemContext,
    CharacterSheetQuadroneContext,
    NpcItemContext,
    NpcSheetQuadroneContext,
    FeatureSection,
  } from 'src/types/types';
  import { getContext } from 'svelte';
  import FeatureTable from './FeatureTable.svelte';

  interface Props {
    sections: FeatureSection[];
    itemContext: Record<string, CharacterItemContext | NpcItemContext>;
    inlineToggleService: InlineToggleService;
    searchCriteria: string;
    sheetDocument: Actor5e | Item5e;
  }

  let {
    sections,
    itemContext,
    inlineToggleService,
    searchCriteria,
    sheetDocument,
  }: Props = $props();

  const tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  const searchResults = getSearchResultsContext();

  let itemToggleMap = $derived(inlineToggleService.map);

  let context =
    $derived(
      getSheetContext<
        CharacterSheetQuadroneContext | NpcSheetQuadroneContext
      >(),
    );

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

  let totalFeatureCount = $derived(
    sections.reduce((count, s) => count + s.items.length, 0),
  );
</script>

<div class="tidy-table-container" bind:this={sectionsContainer}>
  {#if totalFeatureCount === 0}
    <div class="features-empty empty-state-container">
      <button
        type="button"
        class="button button-tertiary"
        title={localize('DND5E.FeatureAdd')}
        aria-label={localize('DND5E.FeatureAdd')}
        onclick={() =>
          sheetDocument.sheet._addDocument({
            tabId,
            creationItemTypes: [CONSTANTS.ITEM_TYPE_FEAT],
          })}
      >
        <i class="fas fa-plus"></i>
        {localize('DND5E.FeatureAdd')}
      </button>
    </div>
  {:else}
    {#each sections as section (section.key)}
      {@const hasViewableItems = ItemVisibility.hasViewableItems(
        section.items,
        searchResults.uuids,
      )}
      {#if section.show && (hasViewableItems || (context.unlocked && searchCriteria.trim() === ''))}
        <FeatureTable
          {itemToggleMap}
          {section}
          {sectionsInlineWidth}
          {sheetDocument}
        />
      {/if}
    {/each}
  {/if}
</div>
