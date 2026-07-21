<script lang="ts">
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ItemSheetQuadroneContext } from 'src/types/item.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyActivityTableRow from 'src/components/table-quadrone/TidyActivityTableRow.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import { ActivityColumnRuntime } from 'src/runtime/table-columns/ActivityColumnRuntime.svelte';
  import { RowActionRuntimeBase } from 'src/runtime/table-row-actions/RowActionRuntimeBase';
  import TidyTableCustomHeaderCells from 'src/components/table-quadrone/parts/TidyTableCustomHeaderCells.svelte';
  import TidyTableCustomCells from 'src/components/table-quadrone/parts/TidyTableCustomCells.svelte';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
  import { observeResize } from 'src/features/resize-observation/attachments';
  import TableRowActions from '../../../../components/table-quadrone/parts/TableRowActions.svelte';
  import SectionActionsColumnHeader from '../columns/SectionActionsColumnHeader.svelte';
  import type { ActivityRowActionPropsData } from 'src/types/row-actions.types';

  let context = $derived(getSheetContext<ItemSheetQuadroneContext>());

  let isBasicTheme = $derived(
    ThemeQuadrone.getSheetThemeSettings({ doc: context.document })
      .useBasicTheme ?? false,
  );

  const localize = FoundryAdapter.localize;

  let sectionsInlineWidth: number = $state(0);

  function onResize(entry: ResizeObserverEntry) {
    sectionsInlineWidth = entry.borderBoxSize[0].inlineSize;
  }
</script>

<div {@attach observeResize(onResize)}>
  {#each context.activities as section (section.key)}
    {#if section.show}
      {const rowActionInfo = $derived(
        RowActionRuntimeBase.getRowActionWidthInfo(
          section.activities,
          (entry) => entry.rowActions,
        ),
      )}

      {const hiddenColumns = $derived(
        ActivityColumnRuntime.determineHiddenColumns(
          sectionsInlineWidth - rowActionInfo.widthPx,
          section.columns,
          10,
        ),
      )}

      <TidyTable key={section.key}>
        {#snippet header(expanded)}
          <TidyTableHeaderRow class={!isBasicTheme ? 'theme-dark' : ''}>
            <TidyTableHeaderCell primary={true} class="header-label-cell">
              <h3>
                {localize(section.label)}
              </h3>
            </TidyTableHeaderCell>

            <TidyTableCustomHeaderCells
              {hiddenColumns}
              {section}
              {context}
              {expanded}
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
          {#each section.activities as ctx}
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
                  {ctx}
                  entry={ctx.activity}
                  {hiddenColumns}
                  {section}
                />

                <TidyTableCell columnWidth="{rowActionInfo.widthRems}rem">
                  {const data = $derived<ActivityRowActionPropsData>({
                    activity: ctx.activity,
                    ctx,
                  })}
                  <TableRowActions rowActions={ctx.rowActions} {data} />
                </TidyTableCell>
              {/snippet}
            </TidyActivityTableRow>
          {/each}
        {/snippet}
      </TidyTable>
    {/if}
  {/each}
</div>
