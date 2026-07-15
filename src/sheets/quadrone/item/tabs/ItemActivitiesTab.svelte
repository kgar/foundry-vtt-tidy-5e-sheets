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
  import { ActivityColumnRuntime } from 'src/runtime/tables/ActivityColumnRuntime.svelte';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import TableRowActionsRuntime, {
    type ActivityTableAction,
    type ActivityTableActionData,
  } from 'src/runtime/tables/TableRowActionsRuntime.svelte';
  import TidyTableCustomHeaderCells from 'src/components/table-quadrone/parts/TidyTableCustomHeaderCells.svelte';
  import TidyTableCustomCells from 'src/components/table-quadrone/parts/TidyTableCustomCells.svelte';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
  import { observeResize } from 'src/features/resize-observation/attachments';
  import ActivityActionsColumnHeader from '../columns/ActivityActionsColumnHeader.svelte';
  import TableRowActions from '../../../../components/table-quadrone/parts/TableRowActions.svelte';

  let context = $derived(getSheetContext<ItemSheetQuadroneContext>());

  let isBasicTheme = $derived(
    ThemeQuadrone.getSheetThemeSettings({ doc: context.document })
      .useBasicTheme ?? false,
  );

  const localize = FoundryAdapter.localize;

  let rowActions: ActivityTableAction<any>[] = $derived(
    TableRowActionsRuntime.getActivityRowActions(
      context.owner,
      context.unlocked,
    ),
  );

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let section = $derived.by(() => {
    const result = {
      ...SheetSections.EMPTY,
      canCreate: context.editable,
      columns: ActivityColumnRuntime.getColumnSpecifications(
        context.document,
        tabId,
        'activities',
      ),
    };

    return result;
  });

  let sectionsInlineWidth: number = $state(0);

  function onResize(entry: ResizeObserverEntry) {
    sectionsInlineWidth = entry.borderBoxSize[0].inlineSize;
  }

  // TODO: This happens twice. Where should this data prep go?
  const rowActionsMap = $derived(
    context.activities.reduce<Record<string, ActivityTableAction<any>[]>>(
      (prev, entry) => {
        prev[entry.id] = rowActions.filter(
          (action) =>
            !action.condition ||
            action.condition({
              data: { activity: entry.activity, ctx: entry },
            }),
        );

        return prev;
      },
      {},
    ),
  );

  const rowActionInfo = $derived(
    TableRowActionsRuntime.getRowActionWidthInfo(
      context.activities,
      (entry) => rowActionsMap[entry.id],
    ),
  );

  let hiddenColumns = $derived(
    ActivityColumnRuntime.determineHiddenColumnsV2(
      sectionsInlineWidth - rowActionInfo.widthPx,
      section.columns,
    ),
  );
</script>

<div {@attach observeResize(onResize)}>
  <TidyTable key={CONSTANTS.TAB_ITEM_ACTIVITIES}>
    {#snippet header()}
      <TidyTableHeaderRow class={!isBasicTheme ? 'theme-dark' : ''}>
        <TidyTableHeaderCell primary={true} class="header-label-cell">
          <h3>{localize('DND5E.ACTIVITY.Title.other')}</h3>
          <span class="table-header-count">{context.activities.length}</span>
        </TidyTableHeaderCell>

        <TidyTableCustomHeaderCells {context} {hiddenColumns} {section} />

        <TidyTableHeaderCell
          class="header-cell-actions"
          columnWidth="{rowActionInfo.widthRems}rem"
          data-tidy-column-key={CONSTANTS.COLUMN_KEY_ROW_ACTIONS}
        >
          <ActivityActionsColumnHeader
            editable={context.editable}
            maxRowActionsCount={rowActionInfo.maxRowActionsCount}
            {section}
            sheetDocument={context.document}
          />
        </TidyTableHeaderCell>
      </TidyTableHeaderRow>
    {/snippet}
    {#snippet body()}
      {#each context.activities as ctx (ctx.id)}
        {const ctxWithRowActions = $derived({
          ...ctx,
          rowActions: rowActions.filter(
            (action) =>
              !action.condition ||
              action.condition({ data: { activity: ctx.activity, ctx } }),
          ),
        })}
        <TidyActivityTableRow {ctx}>
          {#snippet children()}
            <!-- svelte-ignore a11y_missing_attribute -->
            <a
              role="button"
              tabindex="0"
              class={['tidy-table-row-use-button']}
              aria-label={ctx.activity.name}
              data-action="activity-use"
              onkeydown={(ev) =>
                ev.key === 'Enter' ||
                (ev.key === ' ' &&
                  ctx.activity.use({
                    event: ev,
                    options: { sheet: context.sheet },
                  }))}
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
              {#if ctx.type === CONSTANTS.ACTIVITY_TYPE_CAST && !ctx.spell?.uuid}
                <span
                  data-tooltip={localize(
                    'TIDY5E.Utilities.CastActivityMissingSpell',
                  )}
                  class="cast-activity-missing-spell-indicator"
                >
                  <i class="fa-solid fa-link-simple-slash"></i>
                  <!-- TODO: Update to link-broken for FA 7.2.0-->
                </span>
              {/if}
            </TidyTableCell>

            <TidyTableCustomCells
              {context}
              ctx={ctxWithRowActions}
              entry={ctx.activity}
              {hiddenColumns}
              {section}
            />

            <TidyTableCell columnWidth="{rowActionInfo.widthRems}rem">
              {const data = $derived<ActivityTableActionData>({
                activity: ctx.activity,
                ctx,
              })}
              <TableRowActions {rowActions} {data} />
            </TidyTableCell>
          {/snippet}
        </TidyActivityTableRow>
      {/each}
    {/snippet}
  </TidyTable>
</div>
