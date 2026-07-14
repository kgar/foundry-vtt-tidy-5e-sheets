<script
  lang="ts"
  generics="TEntry extends { id: string, uuid: string, name: string, img: string}"
>
  import TidyItemTableRow from 'src/components/table-quadrone/TidyItemTableRow.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import { CONSTANTS } from 'src/constants';
  import { getSearchResultsContext } from 'src/features/search/search.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { ColumnsLoadout } from 'src/runtime/item/ColumnsLoadout.svelte';
  import { ItemColumnRuntime } from 'src/runtime/tables/ItemColumnRuntime.svelte';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    Actor5e,
    ActorItemQuadroneContext,
    CharacterSheetQuadroneContext,
    NpcSheetQuadroneContext,
    TidyItemSectionBase,
    TidySectionBase,
  } from 'src/types/types';
  import { type Snippet } from 'svelte';
  import type { SvelteMap, SvelteSet } from 'svelte/reactivity';
  import TidyTableSubtitle from './parts/TidyTableSubtitle.svelte';
  import TidyTableCustomCells from './parts/TidyTableCustomCells.svelte';
  import TidyTableCustomHeaderCells from './parts/TidyTableCustomHeaderCells.svelte';
  import type { ClassValue, HTMLAttributes } from 'svelte/elements';
  import type { Item5e } from 'src/types/item.types';
  import type { SectionColumnContext } from 'src/runtime/types';
  import TableRowActionsRuntime from 'src/runtime/tables/TableRowActionsRuntime.svelte';
  import SectionActionsColumnHeader from 'src/sheets/quadrone/item/columns/SectionActionsColumnHeader.svelte';
  import DocumentActionsColumn from 'src/sheets/quadrone/item/columns/DocumentActionsColumn.svelte';
  import { foundryCoreSettings } from 'src/settings/settings.svelte';

  interface Props {
    section: TidyItemSectionBase;
    entries: TEntry[];
    entryContext: Record<string, ActorItemQuadroneContext>;
    /** Actor or item (e.g. nested container inventory); theme is resolved per document. */
    sheetDocument: Actor5e | Item5e;
    sectionsInlineWidth: number;
    entryToggleMap: SvelteMap<string, SvelteSet<string>>;
    tabId: string;
    columns?: ColumnsLoadout;
    columnsV2?: SectionColumnContext;
    headerRowClasses?: ClassValue;
    headerRowAttributes?: Omit<HTMLAttributes<HTMLElement>, 'class'>;
    rowClassFunction?: (entry: TEntry) => ClassValue;
    bodyNoEntries?: Snippet;
    endOfPrimaryHeaderCell?: Snippet;
    subtitle?: Snippet<[entry: TEntry, ctx: any]>;
    afterFirstCell?: Snippet<[entry: TEntry, ctx: any]>;
    afterInlineActivities?: Snippet<[entry: TEntry, ctx: any]>;
    beforeImage?: Snippet<[entry: TEntry, ctx: any]>;
    afterImage?: Snippet<[entry: TEntry, ctx: any]>;
    afterEntryRow?: Snippet<[entry: TEntry, ctx: any]>;
    root?: boolean;
  }

  let {
    entries,
    section,
    sheetDocument,
    entryContext,
    sectionsInlineWidth,
    entryToggleMap,
    tabId,
    columns,
    columnsV2,
    rowClassFunction,
    subtitle,
    afterInlineActivities,
    afterFirstCell,
    beforeImage,
    afterImage,
    afterEntryRow,
    bodyNoEntries,
    endOfPrimaryHeaderCell,
    headerRowClasses,
    headerRowAttributes,
    root = true,
  }: Props = $props();

  let searchResults = getSearchResultsContext();

  let context =
    $derived(
      getSheetContext<
        CharacterSheetQuadroneContext | NpcSheetQuadroneContext
      >(),
    );

  const localize = FoundryAdapter.localize;

  const rowActionInfo = $derived(
    TableRowActionsRuntime.getRowActionWidthInfo(
      section.items,
      (entry) => entryContext[entry.id]?.rowActions,
    ),
  );

  let hiddenColumns = $derived(
    columnsV2
      ? ItemColumnRuntime.determineHiddenColumnsV2(
          sectionsInlineWidth - rowActionInfo.widthPx,
          columnsV2,
        )
      : new Set<string>(),
  );
  // Item sheet context has no themeSettings; resolve from the document like ThemeQuadrone.prepare.

  const isBasicTheme = $derived(
    ThemeQuadrone.getSheetThemeSettings({ doc: context.document })
      .useBasicTheme ?? false,
  );
</script>

<TidyTable
  key={section.key}
  data-custom-section={section.custom ? true : null}
  dataset={section.dataset}
>
  {#snippet header(expanded)}
    <TidyTableHeaderRow
      class={[!isBasicTheme ? 'theme-dark' : '', headerRowClasses]}
      {...headerRowAttributes}
    >
      <TidyTableHeaderCell primary={true} class="header-label-cell">
        <h3>
          {localize(section.label)}
        </h3>
        <span class="table-header-count">{entries.length}</span>
        {@render endOfPrimaryHeaderCell?.()}
      </TidyTableHeaderCell>
      <TidyTableCustomHeaderCells
        {columns}
        {columnsV2}
        {hiddenColumns}
        {section}
        {context}
        {expanded}
        {root}
      />
      <TidyTableHeaderCell
        class="header-cell-actions"
        columnWidth="{rowActionInfo.widthRems}rem"
        data-tidy-column-key={CONSTANTS.COLUMN_KEY_ROW_ACTIONS}
      >
        <SectionActionsColumnHeader
          {section}
          maxRowActionsCount={rowActionInfo.maxRowActionsCount}
          sheetDocument={context.document}
        />
      </TidyTableHeaderCell>
    </TidyTableHeaderRow>
  {/snippet}

  {#snippet body()}
    {const entriesWithContext = $derived(
      entries.map((entry) => ({
        entry,
        ctx: entryContext[entry.id],
      })),
    )}

    {#if entriesWithContext.length}
      {#each entriesWithContext as { entry, ctx }, i (entry.uuid)}
        {const expanded = $derived(!!entryToggleMap.get(tabId)?.has(entry.id))}
        {const classes = $derived(
          rowClassFunction ? rowClassFunction(entry) : {},
        )}

        <TidyItemTableRow
          item={entry}
          hidden={!searchResults.show(entry.uuid)}
          rowClass={[{ expanded }, classes]}
          contextMenu={{
            type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
            uuid: entry.uuid,
          }}
          {afterInlineActivities}
          {ctx}
        >
          {#snippet children({ toggleSummary, expanded })}
            {@render beforeImage?.(entry, ctx)}
            <!--svelte-ignore a11y_missing_attribute-->
            <a
              class={[
                'tidy-table-row-use-button',
                { disabled: !context.editable },
              ]}
              data-action="use"
              data-has-roll-modes
            >
              <img class="item-image" alt={entry.name} src={entry.img} />
              <span class="roll-prompt">
                <i class="fa-solid fa-dice-d20"></i>
              </span>
            </a>

            {@render afterImage?.(entry, ctx)}
            <TidyTableCell primary={true} class="item-label text-cell">
              <!--svelte-ignore a11y_missing_attribute-->
              <a
                class="item-name"
                role="button"
                data-keyboard-focus
                tabindex="0"
                onclick={(ev) => toggleSummary()}
                onkeydown={(ev) =>
                  ev.key === 'Enter' || (ev.key === ' ' && toggleSummary())}
              >
                <span class="cell-text">
                  <span class="cell-name">{entry.name}</span>

                  {#if subtitle}
                    {@render subtitle(entry, ctx)}
                  {:else if ctx.subtitle}
                    <TidyTableSubtitle>
                      {@html ctx.subtitle}
                    </TidyTableSubtitle>
                  {/if}
                </span>
                <span class="row-detail-expand-indicator">
                  <i
                    class="fa-solid fa-angle-right expand-indicator"
                    class:expanded
                  >
                  </i>
                </span>
              </a>
            </TidyTableCell>
            {@render afterFirstCell?.(entry, ctx)}
            <TidyTableCustomCells
              {columns}
              columnsV2={section.columns}
              {hiddenColumns}
              {ctx}
              {entry}
              {section}
              {context}
            />
            <TidyTableCell
              columnWidth="{rowActionInfo.widthRems}rem"
              class="tidy-table-actions"
              attributes={{
                ['data-tidy-column-key']: CONSTANTS.COLUMN_KEY_ROW_ACTIONS,
              }}
            >
              <DocumentActionsColumn
                {section}
                rowDocument={entry}
                rowContext={ctx}
              />
            </TidyTableCell>
          {/snippet}
        </TidyItemTableRow>

        {@render afterEntryRow?.(entry, ctx)}
      {/each}
    {:else}
      {@render bodyNoEntries?.()}
    {/if}
  {/snippet}
</TidyTable>
