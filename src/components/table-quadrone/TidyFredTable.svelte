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
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    Actor5e,
    CharacterSheetQuadroneContext,
    FeatureSection,
    NpcSheetQuadroneContext,
    TidySectionBase,
  } from 'src/types/types';
  import { getContext, type Snippet } from 'svelte';
  import type { SvelteMap, SvelteSet } from 'svelte/reactivity';

  interface Props {
    section: TidySectionBase;
    entries: TEntry[];
    entryContext: Record<string, any>;
    sheetDocument: Actor5e;
    sectionsInlineWidth: number;
    itemToggleMap: SvelteMap<string, SvelteSet<string>>;
    tabId: string;
    columns: ColumnsLoadout;
    subtitleText?: Snippet<[entry: TEntry, ctx: any]>;
    afterFirstCell?: Snippet<[entry: TEntry, ctx: any]>;
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
    itemToggleMap,
    tabId,
    columns,
    subtitleText,
    afterFirstCell,
    beforeImage,
    afterImage,
    afterEntryRow,
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

  let hiddenColumns = $derived(
    ItemColumnRuntime.determineHiddenColumns(sectionsInlineWidth, columns),
  );
</script>

<TidyTable
  key={section.key}
  data-custom-section={section.custom ? true : null}
  dataset={section.dataset}
>
  {#snippet header(expanded)}
    <TidyTableHeaderRow class={{ 'theme-dark': root }}>
      <TidyTableHeaderCell primary={true} class="header-label-cell">
        <h3>
          {localize(section.label)}
        </h3>
        <span class="table-header-count">{entries.length}</span>
      </TidyTableHeaderCell>
      {#each columns.ordered as column}
        {@const hidden = hiddenColumns.has(column.key)}

        <TidyTableHeaderCell
          class={[
            column.headerClasses,
            { hidden: (!expanded && !root) || hidden },
          ]}
          columnWidth="{column.widthRems}rem"
          data-tidy-column-key={column.key}
        >
          {#if !!column.headerContent}
            {#if column.headerContent.type === 'callback'}
              {@html column.headerContent.callback?.(context.document, context)}
            {:else if column.headerContent.type === 'component'}
              <column.headerContent.component
                sheetContext={context}
                sheetDocument={context.document}
                {section}
              />
            {:else if column.headerContent.type === 'html'}
              {@html column.headerContent.html}
            {/if}
          {/if}
        </TidyTableHeaderCell>
      {/each}
    </TidyTableHeaderRow>
  {/snippet}

  {#snippet body()}
    {@const itemEntries = entries.map((entry) => ({
      entry,
      ctx: entryContext[entry.id],
    }))}
    {#each itemEntries as { entry, ctx }, i (entry.uuid)}
      {@const expanded = !!itemToggleMap.get(tabId)?.has(entry.id)}

      <TidyItemTableRow
        item={entry}
        hidden={!searchResults.show(entry.uuid)}
        rowClass={[{ expanded }]}
        contextMenu={{
          type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
          uuid: entry.uuid,
        }}
      >
        {#snippet children({ toggleSummary, expanded })}
          {@render beforeImage?.(entry, ctx)}
          <a
            class={[
              'tidy-table-row-use-button',
              { disabled: !context.editable },
            ]}
            onclick={(ev) =>
              context.editable && FoundryAdapter.actorTryUseItem(entry, ev)}
            data-has-roll-modes
          >
            <img class="item-image" alt={entry.name} src={entry.img} />
            <span class="roll-prompt">
              <i class="fa fa-dice-d20"></i>
            </span>
          </a>

          {@render afterImage?.(entry, ctx)}
          <TidyTableCell primary={true} class="item-label text-cell">
            <a
              class="item-name"
              role="button"
              data-keyboard-focus
              tabindex="0"
              onclick={(ev) => toggleSummary()}
            >
              <span class="cell-text">
                <span class="cell-name">{entry.name}</span>

                {#if subtitleText}
                  <span class="cell-context">
                    {@render subtitleText(entry, ctx)}
                  </span>
                {:else if ctx.subtitle}
                  <span class="cell-context">{@html ctx.subtitle}</span>
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
          {#each columns.ordered as column}
            {@const hidden = hiddenColumns.has(column.key)}

            <TidyTableCell
              columnWidth="{column.widthRems}rem"
              class={[column.cellClasses, { hidden }]}
              attributes={{ ['data-tidy-column-key']: column.key }}
            >
              {#if column.cellContent.type === 'callback'}
                {@html column.cellContent.callback?.(context.document, context)}
              {:else if column.cellContent.type === 'component'}
                <column.cellContent.component
                  rowContext={ctx}
                  rowDocument={entry}
                  {section}
                />
              {/if}
            </TidyTableCell>
          {/each}
        {/snippet}
      </TidyItemTableRow>

      {@render afterEntryRow?.(entry, ctx)}
    {/each}
  {/snippet}
</TidyTable>
