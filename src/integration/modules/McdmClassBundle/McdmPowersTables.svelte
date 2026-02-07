<script lang="ts">
  import TidyItemTableRow from 'src/components/table-quadrone/TidyItemTableRow.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import { CONSTANTS } from 'src/constants';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { createSearchResultsState, setSearchResultsContext } from 'src/features/search/search.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { ColumnsLoadout } from 'src/runtime/item/ColumnsLoadout.svelte';
  import { getDefaultItemColumns } from 'src/runtime/tables/default-item-columns';
  import type { ActorSheetQuadroneContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import McdmPowerSpecialtyColumn from './McdmPowerSpecialtyColumn.svelte';
  import { ItemColumnRuntime } from 'src/runtime/tables/ItemColumnRuntime.svelte';
  import type { PowersSection } from './McdmClassBundle';

  interface Props {
    sections: PowersSection[];
    searchCriteria: string;
    context: ActorSheetQuadroneContext;
    tabId: string;
  }

  let {
    sections,
    searchCriteria,
    context,
    tabId,
  }: Props = $props();

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

  const defaultColumns = getDefaultItemColumns()
  let columns = $derived(
    new ColumnsLoadout([
      {
        key: 'concentration',
        headerContent: {
          type: 'html',
          html: ''
        },
        cellContent: {
          type: 'callback',
          callback: (rowDocument, rowContext) => {
            if (!rowDocument.requiresConcentration) return "";
            return `
              <span class="concentration-icon">
                <dnd5e-icon src="systems/dnd5e/icons/svg/statuses/concentrating.svg">
              </span>
            `
          },
        },
        widthRems: 2,
        order: 100,
        priority: 900
      },
      {...defaultColumns.uses, key: 'uses', order: 200, priority: 200},
      {
        key: 'specialty',
        headerContent: {
          type: 'html',
          html: localize('MCDMCB.TALENT.POWERS.SPECIALTIES.Header'),
        },
        cellContent: {
          type: 'component',
          component: McdmPowerSpecialtyColumn,
        },
        widthRems: 3.5,
        order: 300,
        priority: 100
      },
      {...defaultColumns.time, key: 'time', order: 400, priority: 500},
      {...defaultColumns.formula, key: 'formula', order: 500, priority: 300},
      {...defaultColumns.target, key: 'target', order: 600, priority: 400},
      {...defaultColumns.range, key: 'range', order: 700, priority: 600},
      {...defaultColumns.roll, key: 'roll', order: 800, priority: 700},
      {...defaultColumns.actions, widthRems: defaultColumns.actions.widthRems(sections[0]), key: 'actions', order: 1000, priority: 1000},
    ])
  );
  let hiddenColumns = $derived(
    ItemColumnRuntime.determineHiddenColumns(sectionsInlineWidth, columns),
  );
</script>

<div class="tidy-table-container" bind:this={sectionsContainer}>
  {#each sections as section}
    {#if section.show}
      <TidyTable
        key={section.key}
        data-custom-section={false}
        dataset={section.dataset}
      >
        {#snippet header(expanded)}
          <TidyTableHeaderRow
            class={[
              'theme-dark'
            ]}
          >
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
                    context.editable && FoundryAdapter.actorTryUseItem(item, ev)}
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
                {#each columns.ordered as column}
                  {@const hidden = hiddenColumns.has(column.key)}
    
                  <TidyTableCell
                    columnWidth="{column.widthRems}rem"
                    class={[column.cellClasses, { hidden }]}
                    attributes={{ ['data-tidy-column-key']: column.key }}
                  >
                    {#if column.cellContent.type === 'callback'}
                      {@html column.cellContent.callback?.(item, ctx)}
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
</div>