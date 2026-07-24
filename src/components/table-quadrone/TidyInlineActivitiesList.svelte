<script lang="ts">
  import type { Item5e } from 'src/types/item.types';
  import TidyTable from './TidyTable.svelte';
  import TidyTableRow from './TidyTableRow.svelte';
  import TidyTableCell from './TidyTableCell.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { Activities } from 'src/features/activities/activities';
  import type {
    ActivityItemContext,
    ActorSheetQuadroneContext,
  } from 'src/types/types';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import TidyTableHeaderRow from './TidyTableHeaderRow.svelte';
  import TidyTableHeaderCell from './TidyTableHeaderCell.svelte';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
  import { ActivityColumnRuntime } from 'src/runtime/table-columns/ActivityColumnRuntime.svelte';
  import TidyTableCustomHeaderCells from './parts/TidyTableCustomHeaderCells.svelte';
  import TidyTableCustomCells from './parts/TidyTableCustomCells.svelte';
  import { RowActionRuntimeBase } from 'src/runtime/table-row-actions/RowActionRuntimeBase';
  import RowActionsColumn from 'src/sheets/quadrone/item/columns/RowActionsColumn.svelte';
  import TidyTableCustomCellsV2 from './parts/TidyTableCustomCellsV2.svelte';
  import TidyTableCustomHeaderCellsV2 from './parts/TidyTableCustomHeaderCellsV2.svelte';

  interface Props {
    item?: Item5e | null;
    activities: ActivityItemContext[] | undefined;
  }

  let { item = null, activities = [] }: Props = $props();

  let context = $derived(getSheetContext<ActorSheetQuadroneContext>());
  let isBasicTheme = $derived(
    ThemeQuadrone.getSheetThemeSettings({ doc: context.document })
      .useBasicTheme ?? false,
  );

  let section = $derived({
    ...SheetSections.EMPTY,
    columns: ActivityColumnRuntime.getColumnSpecifications({
      sheetDocument: item,
      tabId: CONSTANTS.TAB_ITEM_ACTIVITIES,
      sectionKey: 'activity',
      editable: context.editable,
      owner: context.owner,
      unlocked: context.unlocked,
    }),
  });

  const rowActionInfo = $derived(
    RowActionRuntimeBase.getRowActionWidthInfo(
      activities,
      (entry) => entry.rowActions,
    ),
  );

  // TODO: Determine if we want to support custom columns and prioritized column hiding for activities.
  // If yes, we should pass the inline size in from the outside.
  let hiddenColumns = new Set<string>();

  const localize = FoundryAdapter.localize;
</script>

<TidyTable
  key="activities-{item.name}"
  toggleable={false}
  class="inline-activities-table"
>
  {#snippet header()}
    <TidyTableHeaderRow class={!isBasicTheme ? 'theme-dark' : ''}>
      <TidyTableHeaderCell primary={true} class="header-label-cell">
        <h3>{localize('DND5E.ACTIVITY.Title.other')}</h3>
      </TidyTableHeaderCell>
      <TidyTableCustomHeaderCellsV2 {hiddenColumns} {section} {context} />
      <TidyTableHeaderCell columnWidth="{rowActionInfo.widthRems}rem"
      ></TidyTableHeaderCell>
    </TidyTableHeaderRow>
  {/snippet}
  {#snippet body()}
    {#each activities as ctx (ctx.activity.id)}
      {const configurable = $derived(Activities.isConfigurable(ctx.activity))}

      <TidyTableRow
        rowAttributes={{
          'data-item-id': ctx.activity.item.id,
          'data-activity-id': ctx.activity.id,
          'data-configurable': configurable,
          'data-info-card': 'activity',
          'data-info-card-entity-uuid': ctx.activity.uuid,
          'data-context-menu': CONSTANTS.CONTEXT_MENU_TYPE_ACTIVITIES,
          'data-tidy-always-draggable': '',
        }}
        rowClass="activity"
        onmousedown={(event) =>
          FoundryAdapter.editOnMiddleClick(event, ctx.activity)}
      >
        <a
          class={['tidy-table-row-use-button', { disabled: !context.editable }]}
          data-action="activity-use"
          data-has-roll-modes
        >
          <img
            class="item-image"
            alt={ctx.activity.name}
            src={ctx.activity.img}
          />
          <span class="roll-prompt">
            <i class="fa fa-dice-d20"></i>
          </span>
        </a>
        <TidyTableCell primary={true} class="item-label text-cell">
          <span class="item-name">
            <span class="cell-text">
              <span class="cell-name">{ctx.activity.name}</span>
            </span>
          </span>
        </TidyTableCell>

        <TidyTableCustomCellsV2
          {hiddenColumns}
          {ctx}
          entry={ctx.activity}
          {section}
          {context}
        />

        <RowActionsColumn
          columnWidth="{rowActionInfo.widthRems}rem"
          rowActions={ctx.rowActions}
          data={{
            activity: ctx.activity,
            ctx: ctx.activity,
          }}
        />
      </TidyTableRow>
    {/each}
  {/snippet}
</TidyTable>
