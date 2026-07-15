<script lang="ts">
  import TidyItemTableRow from 'src/components/table-quadrone/TidyItemTableRow.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import { CONSTANTS } from 'src/constants';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ActorSheetQuadroneContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import { ItemColumnRuntime } from 'src/runtime/tables/ItemColumnRuntime.svelte';
  import type { PowersSection } from './McdmClassBundle';
  import TidyTableCustomHeaderCells from 'src/components/table-quadrone/parts/TidyTableCustomHeaderCells.svelte';
  import TidyTableCustomCells from 'src/components/table-quadrone/parts/TidyTableCustomCells.svelte';
  import { observeResize } from 'src/features/resize-observation/attachments';
  import TableRowActionsRuntime, {
    type ItemTableActionData,
  } from 'src/runtime/tables/TableRowActionsRuntime.svelte';
  import SectionActionsColumnHeader from 'src/sheets/quadrone/item/columns/SectionActionsColumnHeader.svelte';
  import TableRowActions from 'src/components/table-quadrone/parts/TableRowActions.svelte';

  interface Props {
    sections: PowersSection[];
    searchCriteria: string;
    context: ActorSheetQuadroneContext;
    tabId: string;
  }

  let { sections, searchCriteria, context, tabId }: Props = $props();

  let sectionsInlineWidth: number = $state(0);

  function onResize(entry: ResizeObserverEntry) {
    sectionsInlineWidth = entry.borderBoxSize[0].inlineSize;
  }

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  let itemToggleMap = $derived(inlineToggleService.map);

  const searchResults = createSearchResultsState();
  setSearchResultsContext(searchResults);

  $effect(() => {
    searchResults.uuids = ItemVisibility.getItemsToShowAtDepth({
      criteria: searchCriteria,
      itemContext: context.itemContext,
      sections,
      tabId,
    });
  });

  const localize = FoundryAdapter.localize;
</script>

<div class="tidy-table-container" {@attach observeResize(onResize)}>
  {#each sections as section}
    {#if section.show}
      {const rowActionInfo = $derived(
        TableRowActionsRuntime.getRowActionWidthInfo(
          section.items,
          (entry) => context.itemContext[entry.id]?.rowActions,
        ),
      )}

      {let hiddenColumns = $derived(
        ItemColumnRuntime.determineHiddenColumnsV2(
          sectionsInlineWidth - rowActionInfo.widthPx,
          section.columns,
        ),
      )}

      <TidyTable
        key={section.key}
        data-custom-section={false}
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

            <TidyTableCustomHeaderCells
              {section}
              {expanded}
              {hiddenColumns}
              {context}
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
          {const itemEntries = $derived(
            section.items.map((item) => ({
              item,
              ctx: context.itemContext[item.id],
            })),
          )}
          {#each itemEntries as { item, ctx }, i (item.id)}
            {const expanded = $derived(
              !!itemToggleMap.get(tabId)?.has(item.id),
            )}

            <TidyItemTableRow
              {item}
              hidden={!searchResults.show(item.uuid)}
              rowClass={[
                {
                  expanded,
                },
              ]}
              contextMenu={{
                type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
                uuid: item.uuid,
              }}
              {ctx}
            >
              {#snippet children({ toggleSummary, expanded })}
                <div class="highlight"></div>
                <a
                  class={[
                    'tidy-table-row-use-button',
                    { disabled: !context.editable },
                  ]}
                  onclick={(ev) =>
                    context.editable && context.sheet.tryUseItem(item, ev)}
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

                <TidyTableCustomCells
                  {section}
                  {ctx}
                  entry={item}
                  {hiddenColumns}
                  {context}
                />

                <TidyTableCell
                  columnWidth="{rowActionInfo.widthRems}rem"
                  class="tidy-table-actions"
                  attributes={{
                    ['data-tidy-column-key']: CONSTANTS.COLUMN_KEY_ROW_ACTIONS,
                  }}
                >
                  {const data = $derived<ItemTableActionData>({
                    item,
                    ctx,
                  })}
                  <TableRowActions rowActions={ctx.rowActions} {data} />
                </TidyTableCell>
              {/snippet}
            </TidyItemTableRow>
          {/each}
        {/snippet}
      </TidyTable>
    {/if}
  {/each}
</div>
