<script lang="ts">
  import TidyEffectTableRow from 'src/components/table-quadrone/TidyEffectTableRow.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    ActiveEffectContext,
    ActiveEffectSection,
    CharacterSheetQuadroneContext,
    EffectTableActionData,
  } from 'src/types/types';
  import { CONSTANTS } from 'src/constants';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ItemSheetQuadroneContext } from 'src/types/item.types';
  import { EffectColumnRuntime } from 'src/runtime/tables/EffectColumnRuntime.svelte';
  import TidyTableCustomHeaderCells from 'src/components/table-quadrone/parts/TidyTableCustomHeaderCells.svelte';
  import TidyTableCustomCells from 'src/components/table-quadrone/parts/TidyTableCustomCells.svelte';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
  import TableRowActionsRuntime from 'src/runtime/tables/TableRowActionsRuntime.svelte';
  import type { SectionColumnSpecifications } from 'src/runtime/types';
  import TableRowActions from '../../../components/table-quadrone/parts/TableRowActions.svelte';
  import EffectActionsColumnHeader from '../item/columns/EffectActionsColumnHeader.svelte';

  interface Props {
    inlineWidth: number;
  }

  let { inlineWidth }: Props = $props();

  let context =
    $derived(
      getSheetContext<
        CharacterSheetQuadroneContext | ItemSheetQuadroneContext
      >(),
    );

  let isBasicTheme = $derived(
    ThemeQuadrone.getSheetThemeSettings({ doc: context.document })
      .useBasicTheme ?? false,
  );

  let sections = $derived(context.effects);

  const localize = FoundryAdapter.localize;
</script>

{#each sections as section (section.key)}
  {#if section.show}
    {const rowActionInfo = $derived(
      TableRowActionsRuntime.getRowActionWidthInfo(
        section.effects,
        (entry) => entry.rowActions,
      ),
    )}

    {const hiddenColumns = $derived(
      EffectColumnRuntime.determineHiddenColumns(
        inlineWidth - rowActionInfo.widthPx,
        section.columns,
        10,
      ),
    )}

    <TidyTable key={section.key}>
      {#snippet header(expanded)}
        <TidyTableHeaderRow
          class="{!isBasicTheme ? 'theme-dark' : ''} {section.type ===
            'suppressed' || section.disabled
            ? 'diminished'
            : ''}"
        >
          <TidyTableHeaderCell primary={true} class="header-label-cell">
            <h3>
              {localize(section.label)}
            </h3>
            <span class="table-header-count">{section.effects.length}</span>
          </TidyTableHeaderCell>

          <TidyTableCustomHeaderCells {context} {hiddenColumns} {section} />

          <TidyTableHeaderCell
            class="header-cell-actions"
            columnWidth="{rowActionInfo.widthRems}rem"
            data-tidy-column-key={CONSTANTS.COLUMN_KEY_ROW_ACTIONS}
          >
            <EffectActionsColumnHeader
              {section}
              sheetContext={context}
              sheetDocument={context.document}
            />
          </TidyTableHeaderCell>
        </TidyTableHeaderRow>
      {/snippet}
      {#snippet body()}
        {const effectEntries = $derived(
          section.effects.map((effect: ActiveEffectContext) => ({
            effect,
          })),
        )}
        {#each effectEntries as effectContext}
          {@render EffectRow(
            effectContext.effect,
            section.columns,
            hiddenColumns,
            section,
            rowActionInfo.widthRems,
          )}
          {#each effectContext.effect.riders as rider}
            {@render EffectRow(
              rider,
              section.columns,
              hiddenColumns,
              section,
              rowActionInfo.widthRems,
              true,
            )}
          {/each}
        {/each}
      {/snippet}
    </TidyTable>
  {/if}
{/each}

{#snippet EffectRow(
  ctx: ActiveEffectContext,
  columns: SectionColumnSpecifications,
  hiddenColumns: Set<string>,
  section: ActiveEffectSection,
  rowActionsColumnWidthRems: number,
  isRider?: boolean,
)}
  <TidyEffectTableRow effectContext={ctx}>
    {#snippet children({ toggleSummary, expanded })}
      {#if isRider}
        <span class="inline-activity-arrow">
          <i class="fa-solid fa-turn-up fa-fw fa-rotate-90 color-text-disabled"
          ></i>
        </span>
      {/if}
      <span class="tidy-table-row-use-button disabled">
        <img
          class="item-image"
          src={ctx.effect.img ?? ctx.effect.icon}
          alt={ctx.effect.name ?? ''}
        />
      </span>
      <TidyTableCell primary={true}>
        <!--svelte-ignore a11y_missing_attribute-->
        <a
          class="item-name"
          onclick={(ev) => toggleSummary()}
          onkeydown={(ev) =>
            ev.key === 'Enter' || (ev.key === ' ' && toggleSummary())}
          role="button"
          tabindex="0"
          data-keyboard-focus
        >
          <span class="cell-text">
            <span class="cell-name">{ctx.effect.name}</span>
          </span>
          <span
            class={[
              'row-detail-expand-indicator',
              expanded ? 'expanded' : 'collapsed',
            ]}
          >
            <i class="fa-solid fa-angle-right expand-indicator"> </i>
          </span>
        </a>
      </TidyTableCell>

      <TidyTableCustomCells
        {context}
        {ctx}
        entry={ctx}
        {hiddenColumns}
        {section}
      />

      <TidyTableCell
        columnWidth="{rowActionsColumnWidthRems}rem"
        class="tidy-table-actions"
        attributes={{
          ['data-tidy-column-key']: CONSTANTS.COLUMN_KEY_ROW_ACTIONS,
        }}
      >
        {const data = $derived<EffectTableActionData>({
          effect: ctx.effect,
          ctx,
        })}
        <TableRowActions rowActions={ctx.rowActions} {data} />
      </TidyTableCell>
    {/snippet}
  </TidyEffectTableRow>
{/snippet}

<!-- TODO: hightouch, remove these temp styles whenever you apply the official ones -->
<style lang="less">
  .inline-activity-arrow {
    padding-inline: 0.25rem;
    align-self: center;
  }
</style>
