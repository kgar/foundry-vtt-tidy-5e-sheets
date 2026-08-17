<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e } from 'src/types/item.types';
  import type {
    Actor5e,
    CharacterItemQuadroneContext,
    CharacterSheetQuadroneContext,
    NpcItemQuadroneContext,
    NpcSheetQuadroneContext,
    SpellbookSection,
  } from 'src/types/types';
  import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { getContext } from 'svelte';
  import { getSearchResultsContext } from 'src/features/search/search.svelte';
  import { SectionVisibility } from 'src/features/sections/SectionVisibility';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import SpellTable from './SpellTable.svelte';
  import { observeResize } from 'src/features/resize-observation/attachments';

  interface Props {
    sections: SpellbookSection[];
    itemContext: Record<
      string,
      CharacterItemQuadroneContext | NpcItemQuadroneContext
    >;
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

  let sectionsInlineWidth: number = $state(0);

  function onResize(entry: ResizeObserverEntry) {
    sectionsInlineWidth = entry.borderBoxSize[0].inlineSize;
  }

  let totalSpellCount = $derived(
    sections.reduce((count, s) => count + s.items.length, 0),
  );

  let hasSlots = $derived(sections.some((section) => section.slots));
</script>

<div class="tidy-table-container" {@attach observeResize(onResize)}>
  {#if totalSpellCount === 0 && context.editable && !hasSlots}
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
      {const sectionSearchState = $derived(
        SectionVisibility.getItemSectionSearchState(
          section.items,
          searchResults,
        ),
      )}
      {const showSection = $derived(
        section.show &&
          SectionVisibility.shouldShowItemSection(sectionSearchState, {
            unlocked: context.unlocked,
            alwaysShow: section.usesSlots,
            showWhileSearching: true,
          }),
      )}
      {#if showSection}
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
