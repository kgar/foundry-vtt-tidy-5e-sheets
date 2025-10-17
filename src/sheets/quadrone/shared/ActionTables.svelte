<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { getSearchResultsContext } from 'src/features/search/search.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { ColumnsLoadout } from 'src/runtime/item/ColumnsLoadout.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { Item5e } from 'src/types/item.types';
  import type {
    TidyItemSectionBase,
    Actor5e,
    CharacterItemContext,
    CharacterSheetQuadroneContext,
    NpcItemContext,
    NpcSheetQuadroneContext,
    VehicleItemContext,
  } from 'src/types/types';
  import { getContext } from 'svelte';
  import { ItemColumnRuntime } from 'src/runtime/tables/ItemColumnRuntime.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyItemTableRow from 'src/components/table-quadrone/TidyItemTableRow.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';

  interface Props {
    sections: TidyItemSectionBase[];
    itemContext: Record<
      string,
      CharacterItemContext | NpcItemContext | VehicleItemContext
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

  let totalActionCount = $derived(
    sections.reduce((count, s) => count + s.items.length, 0),
  );
</script>

<div class="tidy-table-container" bind:this={sectionsContainer}>
  {#if totalActionCount === 0}
    <div class="empty-state-container empty-state-description">
      {localize('TIDY5E.SheetLock.Empty.Hint')}
    </div>
  {:else}
    {#each sections as section (section.key)}
      {@const hasViewableItems = ItemVisibility.hasViewableItems(
        section.items,
        searchResults.uuids,
      )}
      {#if section.show && hasViewableItems}
        {@const columns = new ColumnsLoadout(
          ItemColumnRuntime.getConfiguredColumnSpecifications({
            sheetType: sheetDocument.type,
            tabId: tabId,
            sectionKey: section.key,
            rowActions: section.rowActions,
            section: section,
            sheetDocument: context.actor,
          }),
        )}
        {@const hiddenColumns = ItemColumnRuntime.determineHiddenColumns(
          sectionsInlineWidth,
          columns,
        )}
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
                      {@html column.headerContent.callback?.(
                        context.document,
                        context,
                      )}
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
              ctx: itemContext[item.id],
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
                  <div class="highlight"></div>
                  <a
                    class={[
                      'tidy-table-row-use-button',
                      { disabled: !context.editable },
                    ]}
                    onclick={(ev) =>
                      context.editable &&
                      FoundryAdapter.actorTryUseItem(item, ev)}
                    data-has-roll-modes
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
                        {#if 'actionSubtitle' in ctx && ctx.actionSubtitle}
                          <span class="cell-context"
                            >{@html ctx.actionSubtitle}</span
                          >
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
                  {#each columns.ordered as column}
                    {@const hidden = hiddenColumns.has(column.key)}

                    <TidyTableCell
                      columnWidth="{column.widthRems}rem"
                      class={[column.cellClasses, { hidden }]}
                      attributes={{ ['data-tidy-column-key']: column.key }}
                    >
                      {#if column.cellContent.type === 'callback'}
                        {@html column.cellContent.callback?.(
                          context.document,
                          context,
                        )}
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
      {/if}
    {/each}
  {/if}
</div>
