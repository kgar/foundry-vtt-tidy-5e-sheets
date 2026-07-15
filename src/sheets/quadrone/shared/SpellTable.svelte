<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { getSearchResultsContext } from 'src/features/search/search.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    Actor5e,
    CharacterSheetQuadroneContext,
    NpcSheetQuadroneContext,
    SpellbookSection,
  } from 'src/types/types';
  import { isNil } from 'src/utils/data';
  import { getContext } from 'svelte';
  import SpellSlotManagementQuadrone from '../actor/parts/SpellSlotManagementQuadrone.svelte';
  import type { SvelteMap, SvelteSet } from 'svelte/reactivity';
  import TidyItemTable from 'src/components/table-quadrone/TidyItemTable.svelte';
  import type { Item5e } from 'src/types/item.types';
  import type { ClassValue } from 'svelte/elements';

  interface Props {
    section: SpellbookSection;
    sheetDocument: Actor5e;
    sectionsInlineWidth: number;
    itemToggleMap: SvelteMap<string, SvelteSet<string>>;
    tabId?: string;
  }

  let {
    section,
    sheetDocument,
    sectionsInlineWidth,
    itemToggleMap,
    tabId: tabIdOverride,
  }: Props = $props();

  const tabId = $derived(
    tabIdOverride ?? getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID),
  );

  let searchResults = getSearchResultsContext();

  let context =
    $derived(
      getSheetContext<
        CharacterSheetQuadroneContext | NpcSheetQuadroneContext
      >(),
    );

  function rowClassFunction(entry: Item5e) {
    return {
      ['can-prepare']: entry.system.canPrepare,
      ['cannot-prepare']: !entry.system.canPrepare,
      prepared:
        entry.system.canPrepare &&
        entry.system.prepared ===
          CONFIG.DND5E.spellPreparationStates.prepared.value,
      always:
        entry.system.canPrepare &&
        entry.system.prepared ===
          CONFIG.DND5E.spellPreparationStates.always.value,
      diminished:
        !entry.system.linkedActivity &&
        entry.system.canPrepare &&
        entry.system.prepared ===
          CONFIG.DND5E.spellPreparationStates.unprepared.value,
    };
  }

  let headerRowClasses = $derived.by<ClassValue>(() => {
    const method = section.method?.slugify();
    return ['spell-method', { [`method-${method}`]: !isNil(method, '') }];
  });

  let headerRowAttributes = $derived(
    section.usesSlots
      ? {
          ['data-tidy-draggable']: true,
          ['data-key']: section.key,
          ['data-method']: section.method,
          ['data-level']: section.dataset['system.level'],
          ['data-slots']: true,
        }
      : {},
  );
</script>

<TidyItemTable
  {section}
  entries={section.items}
  entryContext={context.itemContext}
  {sectionsInlineWidth}
  entryToggleMap={itemToggleMap}
  {tabId}
  {rowClassFunction}
  {headerRowClasses}
  {headerRowAttributes}
>
  {#snippet endOfPrimaryHeaderCell()}
    {#if section.usesSlots}
      <div data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_KEYED_FAVORITE}>
        <SpellSlotManagementQuadrone
          mode={context.spellSlotTrackerMode}
          {section}
        />
      </div>
    {/if}
  {/snippet}
</TidyItemTable>
