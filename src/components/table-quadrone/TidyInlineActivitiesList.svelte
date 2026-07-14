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
  import TableRowActions from 'src/components/table-quadrone/parts/TableRowActions.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import TableRowActionsRuntime from 'src/runtime/tables/TableRowActionsRuntime.svelte';
  import TidyTableHeaderRow from './TidyTableHeaderRow.svelte';
  import TidyTableHeaderCell from './TidyTableHeaderCell.svelte';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
  import { ActivityColumnRuntime } from 'src/runtime/tables/ActivityColumnRuntime.svelte';
  import TidyTableCustomHeaderCells from './parts/TidyTableCustomHeaderCells.svelte';
  import TidyTableCustomCells from './parts/TidyTableCustomCells.svelte';
  import type { TidyTableAction } from './table-buttons/table.types';

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

  let rowActions = $derived(
    TableRowActionsRuntime.getActivityRowActions(
      context.owner,
      context.unlocked,
    ),
  );

  let section = $derived({
    ...SheetSections.EMPTY,
    columns: ActivityColumnRuntime.getColumnSpecifications(
      item,
      CONSTANTS.TAB_ITEM_ACTIVITIES,
      'activity',
    ),
  });

  const rowActionsMap = $derived(
    activities.reduce<Record<string, TidyTableAction<any, any>[]>>(
      (prev, entry) => {
        prev[entry.id] = rowActions.filter(
          (action) =>
            !action.condition ||
            action.condition({ data: entry.activity, rowContext: entry }),
        );

        return prev;
      },
      {},
    ),
  );

  const rowActionInfo = $derived(
    TableRowActionsRuntime.getRowActionWidthInfo(
      activities,
      (entry) => rowActionsMap[entry.id],
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
      <TidyTableCustomHeaderCells {hiddenColumns} {section} {context} />
      <TidyTableHeaderCell columnWidth="{rowActionInfo.widthRems}rem"
      ></TidyTableHeaderCell>
    </TidyTableHeaderRow>
  {/snippet}
  {#snippet body()}
    {#each activities as ctx (ctx.activity.id)}
      {const configurable = $derived(Activities.isConfigurable(ctx.activity))}
      {const ctxWithRowActions = $derived({
        ...ctx,
        rowActions: rowActionsMap[ctx.id],
      })}

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

        <TidyTableCustomCells
          {hiddenColumns}
          ctx={ctxWithRowActions}
          entry={ctx.activity}
          {section}
          {context}
        />

        <TidyTableCell columnWidth="{rowActionInfo.widthRems}rem">
          <TableRowActions
            rowDocument={ctx.activity}
            rowContext={ctxWithRowActions}
            {section}
          />
        </TidyTableCell>
      </TidyTableRow>
    {/each}
  {/snippet}
</TidyTable>
