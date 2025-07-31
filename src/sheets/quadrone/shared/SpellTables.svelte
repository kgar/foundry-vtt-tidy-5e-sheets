<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e } from 'src/types/item.types';
  import type {
    Actor5e,
    CharacterItemContext,
    CharacterSheetQuadroneContext,
    NpcItemContext,
    NpcSheetQuadroneContext,
    SpellbookSection,
  } from 'src/types/types';
  import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { getContext } from 'svelte';
  import { getSearchResultsContext } from 'src/features/search/search.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import SpellTable from './SpellTable.svelte';

  interface Props {
    sections: SpellbookSection[];
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

  let totalSpellCount = $derived(
    sections.reduce((count, s) => count + s.spells.length, 0),
  );
</script>

<div class="tidy-table-container" bind:this={sectionsContainer}>
  {#if totalSpellCount === 0}
    <div class="spellbook-empty empty-state-container">
      <button
        type="button"
        class="button button-tertiary"
        title={localize('DND5E.SpellAdd')}
        aria-label={localize('DND5E.SpellAdd')}
        onclick={() =>
          sheetDocument.sheet._addDocument({
            tabId,
          })}
      >
        <i class="fas fa-plus"></i>
        {localize('DND5E.SpellAdd')}
      </button>
    </div>
  {:else}
    {#each sections as section (section.key)}
      {@const hasViewableItems = ItemVisibility.hasViewableItems(
        section.spells,
        searchResults.uuids,
      )}
      {#if section.show && (hasViewableItems || (context.unlocked && searchCriteria.trim() === ''))}
        <SpellTable
          {section}
          {itemToggleMap}
          {sectionsInlineWidth}
          {sheetDocument}
        />
      {/if}
    {/each}
  {/if}
</div>
