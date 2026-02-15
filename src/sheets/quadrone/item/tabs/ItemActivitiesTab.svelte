<script lang="ts">
  import type { TidyTableAction } from 'src/components/table-quadrone/table-buttons/table.types';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ItemSheetQuadroneContext } from 'src/types/item.types';
  import { getContext, type Component } from 'svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyActivityTableRow from 'src/components/table-quadrone/TidyActivityTableRow.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import { ColumnsLoadout } from 'src/runtime/item/ColumnsLoadout.svelte';
  import { ActivityColumnRuntime } from 'src/runtime/tables/ActivityColumnRuntime.svelte';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import type { Activity5e } from 'src/foundry/dnd5e.types';
  import TableRowActionsRuntime from 'src/runtime/tables/TableRowActionsRuntime.svelte';
  import TidyTableCustomHeaderCells from 'src/components/table-quadrone/parts/TidyTableCustomHeaderCells.svelte';
  import TidyTableCustomCells from 'src/components/table-quadrone/parts/TidyTableCustomCells.svelte';

  let context = $derived(getSheetContext<ItemSheetQuadroneContext>());

  const localize = FoundryAdapter.localize;

  type TableAction<TComponent extends Component<any>> = TidyTableAction<
    TComponent,
    Activity5e,
    any
  >;

  let tableActions: TableAction<any>[] = $derived(
    TableRowActionsRuntime.getActivityRowActions(
      context.owner,
      context.unlocked,
    ),
  );

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let section = $derived({
    ...SheetSections.EMPTY,
    canCreate: context.editable,
    rowActions: tableActions,
  });

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

  let columns = $derived(
    new ColumnsLoadout(
      ActivityColumnRuntime.getConfiguredColumnSpecifications({
        sheetType: context.item.type,
        tabId: tabId,
        sectionKey: 'activities',
        rowActions: tableActions,
        section: section,
        sheetDocument: context.item,
      }),
    ),
  );

  let hiddenColumns = $derived(
    ActivityColumnRuntime.determineHiddenColumns(sectionsInlineWidth, columns),
  );
</script>

<div bind:this={sectionsContainer}>
  <TidyTable key={CONSTANTS.TAB_ITEM_ACTIVITIES}>
    {#snippet header()}
      <TidyTableHeaderRow class="theme-dark">
        <TidyTableHeaderCell primary={true} class="header-label-cell">
          <h3>{localize('DND5E.ACTIVITY.Title.other')}</h3>
          <span class="table-header-count">{context.activities.length}</span>
        </TidyTableHeaderCell>

        <TidyTableCustomHeaderCells
          {columns}
          {context}
          {hiddenColumns}
          {section}
        />
      </TidyTableHeaderRow>
    {/snippet}
    {#snippet body()}
      {#each context.activities as ctx (ctx.id)}
        <TidyActivityTableRow {ctx}>
          {#snippet children()}
            <a
              class={['tidy-table-row-use-button']}
              onclick={(ev) => ctx.activity.use({ ev })}
              data-has-roll-modes
            >
              <img class="item-image" alt="" src={ctx.activity.img} />
              <span class="roll-prompt">
                <i class="fa fa-dice-d20"></i>
              </span>
            </a>
            <TidyTableCell primary={true}>
              <span class="item-name">
                <span class="cell-text">
                  <span class="cell-name">{ctx.activity.name}</span>
                </span>
                <!-- TODO: Uncomment when we have activity descriptions -->
                <!-- <span class="row-detail-expand-indicator">
                <i
                  class="fa-solid fa-angle-right expand-indicator"
                  class:expanded
                >
                </i>
              </span> -->
              </span>
            </TidyTableCell>

            <TidyTableCustomCells
              {columns}
              {context}
              {ctx}
              entry={ctx.activity}
              {hiddenColumns}
              {section}
            />
          {/snippet}
        </TidyActivityTableRow>
      {/each}
    {/snippet}
  </TidyTable>
</div>
