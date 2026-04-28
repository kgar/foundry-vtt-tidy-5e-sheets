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
  } from 'src/types/types';
  import { getContext } from 'svelte';
  import { CONSTANTS } from 'src/constants';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ItemSheetQuadroneContext } from 'src/types/item.types';
  import { EffectColumnRuntime } from 'src/runtime/tables/EffectColumnRuntime.svelte';
  import { ColumnsLoadout } from 'src/runtime/item/ColumnsLoadout.svelte';
  import TidyTableCustomHeaderCells from 'src/components/table-quadrone/parts/TidyTableCustomHeaderCells.svelte';
  import TidyTableCustomCells from 'src/components/table-quadrone/parts/TidyTableCustomCells.svelte';

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

  let sections = $derived(context.effects);

  const localize = FoundryAdapter.localize;

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);
</script>

{#each sections as section (section.key)}
  {@const columns = new ColumnsLoadout(
    EffectColumnRuntime.getConfiguredColumnSpecifications({
      sheetType: context.document.type,
      tabId: tabId,
      sectionKey: section.key,
      rowActions: section.rowActions,
      section: section,
      sheetDocument: context.document,
    }),
  )}

  {@const hiddenColumns = EffectColumnRuntime.determineHiddenColumns(
    inlineWidth,
    columns,
    10,
  )}
  {#if section.show}
    <TidyTable key={section.key}>
      {#snippet header()}
        <TidyTableHeaderRow
          class="theme-dark {section.type === 'suppressed' || section.disabled
            ? 'diminished'
            : ''}"
        >
          <TidyTableHeaderCell primary={true} class="header-label-cell">
            <h3>
              {localize(section.label)}
            </h3>
            <span class="table-header-count">{section.effects.length}</span>
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
        {@const effectEntries = section.effects.map(
          (effect: ActiveEffectContext) => ({
            effect,
          }),
        )}
        {#each effectEntries as effectContext}
          {@render EffectRow(
            effectContext.effect,
            columns,
            hiddenColumns,
            section,
          )}
          {#each effectContext.effect.riders as rider}
            {@render EffectRow(rider, columns, hiddenColumns, section, true)}
          {/each}
        {/each}
      {/snippet}
    </TidyTable>
  {/if}
{/each}

{#snippet EffectRow(
  ctx: ActiveEffectContext,
  columns: ColumnsLoadout,
  hiddenColumns: Set<string>,
  section: ActiveEffectSection,
  isRider?: boolean,
)}
  <TidyEffectTableRow effectContext={ctx}>
    {#snippet children({ toggleSummary, expanded })}
      {#if isRider}
        <span class="inline-activity-arrow">
          <i class="fa-solid fa-turn-up fa-fw fa-rotate-90 color-text-disabled"></i>
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
        <a class="item-name" onclick={(ev) => toggleSummary()}>
          <span class="cell-text">
            <span class="cell-name">{ctx.effect.name}</span>
          </span>
          <span class="row-detail-expand-indicator">
            <i class="fa-solid fa-angle-right expand-indicator" class:expanded>
            </i>
          </span>
        </a>
      </TidyTableCell>

      <TidyTableCustomCells
        {columns}
        {context}
        {ctx}
        entry={ctx}
        {hiddenColumns}
        {section}
      />
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
