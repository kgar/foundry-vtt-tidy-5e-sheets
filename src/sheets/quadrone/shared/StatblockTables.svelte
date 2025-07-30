<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { getSearchResultsContext } from 'src/features/search/search.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    Actor5e,
    FeatureSection,
    NpcItemContext,
    NpcSheetQuadroneContext,
    SpellbookSection,
  } from 'src/types/types';
  import { getContext } from 'svelte';

  interface Props {
    sections: (FeatureSection | SpellbookSection)[];
    itemContext: Record<string, NpcItemContext>;
    inlineToggleService: InlineToggleService;
    searchCriteria: string;
    sheetDocument: Actor5e;
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

  let context = $derived(getSheetContext<NpcSheetQuadroneContext>());

  const localize = FoundryAdapter.localize;

  let sectionsContainer: HTMLElement;
  let sectionsInlineWidth: number = $state(0);

  function onResize(entry: ResizeObserverEntry) {
    sectionsInlineWidth = entry.borderBoxSize[0].inlineSize;
  }

  let totalItemCount = $derived(
    sections.reduce(
      (count, s) =>
        count +
        // TODO: In 5.1, remove the .spells
        (s.type === CONSTANTS.SECTION_TYPE_SPELLBOOK ? s.spells : s.items)
          .length,
      0,
    ),
  );
</script>

<div class="tidy-table-container" bind:this={sectionsContainer}>
  {#if totalItemCount === 0}
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
      {#if section.type === CONSTANTS.SECTION_TYPE_SPELLBOOK}
        <p>TODO: Spell Table Here</p>
      {:else if section.type === CONSTANTS.SECTION_TYPE_FEATURE}
        <p>TODO: Feature Table Here</p>
      {/if}
    {/each}
  {/if}
</div>
