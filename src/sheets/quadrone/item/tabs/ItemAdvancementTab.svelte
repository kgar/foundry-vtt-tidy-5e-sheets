<script lang="ts">
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ItemSheetQuadroneContext } from 'src/types/item.types';
  import TidyAdvancementTableRow from 'src/components/table-quadrone/TidyAdvancementTableRow.svelte';
  import { CONSTANTS } from 'src/constants';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
  import { RowActionRuntimeBase } from 'src/runtime/table-row-actions/RowActionRuntimeBase';
  import { AdvancementColumnRuntime } from 'src/runtime/table-columns/AdvancementColumnRuntime.svelte';
  import { observeResize } from 'src/features/resize-observation/attachments';
  import SectionActionsColumnHeader from '../columns/SectionActionsColumnHeader.svelte';
  import type { ItemAdvancementRowAction } from 'src/types/row-actions.types';
  import RowActionsColumn from '../columns/RowActionsColumn.svelte';
  import TidyTableCustomCellsV2 from 'src/components/table-quadrone/parts/TidyTableCustomCellsV2.svelte';
  import TidyTableCustomHeaderCellsV2 from 'src/components/table-quadrone/parts/TidyTableCustomHeaderCellsV2.svelte';

  let localize = FoundryAdapter.localize;

  let context = $derived(getSheetContext<ItemSheetQuadroneContext>());
  let isBasicTheme = $derived(
    ThemeQuadrone.getSheetThemeSettings({ doc: context.document })
      .useBasicTheme ?? false,
  );

  // TODO: Move advancement sections / columns / row actions to context prep

  let sectionsInlineWidth: number = $state(0);

  function onResize(entry: ResizeObserverEntry) {
    sectionsInlineWidth = entry.borderBoxSize[0].inlineSize;
  }
</script>

<div {@attach observeResize(onResize)} class="tidy-table-container">
  {#each context.advancement as section (section.key)}
    {let longestRowActionArray = $derived(
      section.items.reduce<ItemAdvancementRowAction[]>((prev, curr) => {
        return prev.length > curr.rowActions.length ? prev : curr.rowActions;
      }, []),
    )}

    <!-- 
      Unlike with most other tables, this table cannot hide 
      the header buttons when there are too few row actions. 
      All header controls must be visible, always. 
    -->
    {let arrayWithMostActions = $derived(
      longestRowActionArray.length > section.sectionActions.length
        ? longestRowActionArray
        : section.sectionActions,
    )}

    {const rowActionInfo = $derived(
      RowActionRuntimeBase.getRowActionWidthInfo(
        section.items,
        (_entry) => arrayWithMostActions,
      ),
    )}

    {const hiddenColumns = $derived(
      AdvancementColumnRuntime.determineHiddenColumns(
        sectionsInlineWidth - rowActionInfo.widthPx,
        section.columns,
      ),
    )}

    <TidyTable key={section.key}>
      {#snippet header()}
        <TidyTableHeaderRow class={!isBasicTheme ? 'theme-dark' : ''}>
          <TidyTableHeaderCell primary={true} class="header-label-cell">
            <h3>
              {localize(section.label)}
            </h3>
          </TidyTableHeaderCell>

          <TidyTableCustomHeaderCellsV2 {context} {hiddenColumns} {section} />

          <TidyTableHeaderCell
            class="header-cell-actions"
            columnWidth="{rowActionInfo.widthRems}rem"
            data-tidy-column-key={CONSTANTS.COLUMN_KEY_ROW_ACTIONS}
          >
            <SectionActionsColumnHeader
              {section}
              sheetDocument={context.document}
              maxRowActionsCount={arrayWithMostActions.length}
            />
          </TidyTableHeaderCell>
        </TidyTableHeaderRow>
      {/snippet}
      {#snippet body()}
        {#each section.items as advancement (advancement.id)}
          <TidyAdvancementTableRow
            {advancement}
            item={context.item}
            rowClass="advancement-item"
          >
            {#snippet children()}
              <span class="tidy-table-row-use-button disabled">
                <img
                  class="item-image"
                  src={advancement.icon}
                  alt={advancement.title ?? ''}
                />
              </span>
              <TidyTableCell primary={true}>
                <div class="item-name">
                  <div class="cell-text">
                    <div class="cell-name">
                      {@html advancement.title}
                      {#each advancement.tags as tag}
                        <i class={tag.iconClass} title={localize(tag.label)}
                        ></i>
                      {/each}
                    </div>
                    <div class="advancement-cell-context">
                      {@html advancement.summary}
                    </div>
                  </div>
                </div>
              </TidyTableCell>

              <TidyTableCustomCellsV2
                {context}
                ctx={advancement}
                entry={advancement}
                {hiddenColumns}
                {section}
              />

              <RowActionsColumn
                columnWidth="{rowActionInfo.widthRems}rem"
                rowActions={advancement.rowActions}
                data={{
                  id: advancement.id,
                  item: context.document,
                }}
              />
            {/snippet}
          </TidyAdvancementTableRow>
        {/each}
      {/snippet}
    </TidyTable>
  {:else}
    <button
      type="button"
      class="button button-primary"
      title={localize('DND5E.ADVANCEMENT.Action.Create')}
      aria-label={localize('DND5E.ADVANCEMENT.Action.Create')}
      onclick={() =>
        FoundryAdapter.createAdvancementSelectionDialog(context.item)}
    >
      <i class="fas fa-plus"></i>
      {localize('DND5E.ADVANCEMENT.Action.Create')}
    </button>
  {/each}
</div>
