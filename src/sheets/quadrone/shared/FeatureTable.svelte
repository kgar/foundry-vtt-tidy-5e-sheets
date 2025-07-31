<script lang="ts">
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
  } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { SvelteMap, SvelteSet } from 'svelte/reactivity';

  interface Props {
    section: FeatureSection;
    sheetDocument: Actor5e;
    sectionsInlineWidth: number;
    itemToggleMap: SvelteMap<string, SvelteSet<string>>;
  }

  let { section, sheetDocument, sectionsInlineWidth, itemToggleMap }: Props =
    $props();

  const tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let searchResults = getSearchResultsContext();

  let context =
    $derived(
      getSheetContext<
        CharacterSheetQuadroneContext | NpcSheetQuadroneContext
      >(),
    );

  const localize = FoundryAdapter.localize;

  let columns = $derived(
    new ColumnsLoadout(
      ItemColumnRuntime.getConfiguredColumnSpecifications(
        sheetDocument.type,
        tabId,
        section.key,
        {
          rowActions: section.rowActions,
        },
      ),
    ),
  );

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
    <TidyTableHeaderRow class={['theme-dark']}>
      <TidyTableHeaderCell primary={true} class="header-label-cell">
        <h3>
          {localize(section.label)}
        </h3>
        <span class="table-header-count">{section.items.length}</span>
      </TidyTableHeaderCell>
      {#each columns.ordered as column}
        {@const hidden = hiddenColumns.has(column.key)}

        <TidyTableHeaderCell
          class={[column.headerClasses, { hidden }]}
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
    {@const itemEntries = section.items.map((item) => ({
      item,
      ctx: context.itemContext[item.id],
    }))}
    {#each itemEntries as { item, ctx }, i (item.id)}
      {@const expanded = !!itemToggleMap.get(tabId)?.has(item.id)}

      <TidyItemTableRow
        {item}
        hidden={!searchResults.show(item.uuid)}
        rowClass={[{ expanded }]}
        contextMenu={{
          type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
          uuid: item.uuid,
        }}
      >
        {#snippet children({ toggleSummary, expanded })}
          <a
            class={['tidy-table-row-use-button']}
            onclick={(ev) => FoundryAdapter.actorTryUseItem(item, ev)}
          >
            <img class="item-image" alt={item.name} src={item.img} />
            <span class="roll-prompt">
              <i class="fa fa-dice-d20"></i>
            </span>
          </a>

          <TidyTableCell primary={true} class="item-label text-cell">
            <a class="item-name" onclick={(ev) => toggleSummary()}>
              <span class="cell-text">
                <span class="cell-name">{item.name}</span>
                {#if ctx.subtitle}
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
          {#if 'inspirationSource' in context && context.inspirationSource?.itemId === item.id}
            <i
              class={[
                'fa-solid',
                'fa-sparkles',
                'item-state-indicator',
                'color-text-gold-emphasis',
              ]}
              data-tooltip="TIDY5E.InspirationSource.ItemIsSourceTooltip"
            ></i>
          {/if}
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
                  rowDocument={item}
                  {section}
                />
              {/if}
            </TidyTableCell>
          {/each}
        {/snippet}
      </TidyItemTableRow>
    {/each}
  {/snippet}
</TidyTable>
