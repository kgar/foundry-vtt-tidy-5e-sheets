<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import type {
    EncounterMemberQuadroneContext,
    GroupMemberQuadroneContext,
  } from 'src/types/types';
  import { Tidy5eNpcSheetQuadrone } from '../../Tidy5eNpcSheetQuadrone.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  let {
    rowDocument,
    rowContext,
  }: ColumnCellProps<
    any,
    GroupMemberQuadroneContext | EncounterMemberQuadroneContext
  > = $props();

  let hpValue = $derived(rowDocument.system.attributes?.hp?.value ?? 0);
  let hpPct = $derived(rowDocument.system.attributes?.hp?.pct ?? 0);
  let effectiveMaxHp = $derived(
    rowDocument.system.attributes?.hp?.effectiveMax ?? 0,
  );

  let context = $derived(getSheetContext());

  const localize = FoundryAdapter.localize;
</script>

<div
  class="meter meter-small progress hit-points"
  style="--bar-percentage: {hpPct.toFixed(0)}%"
></div>
<div class="flexrow">
  <span class="font-data-medium color-text-default">{hpValue}</span>
  <span class="font-body-medium color-text-lightest separator">/</span>
  <span class="font-label-medium color-text-default">{effectiveMaxHp}</span>
</div>
{#if 'canEdit' in rowContext && rowContext.canEdit}
  <button
    type="button"
    class="button borderless-button button-icon-only"
    aria-label={localize('DND5E.HPFormulaRollMessage')}
    data-tooltip
    onclick={async () => {
      await new Tidy5eNpcSheetQuadrone({ document: rowDocument }).rollFormula();
      context.sheet.render();
    }}
  >
    <i class="fa-solid fa-dice-d20"></i>
  </button>
{/if}
