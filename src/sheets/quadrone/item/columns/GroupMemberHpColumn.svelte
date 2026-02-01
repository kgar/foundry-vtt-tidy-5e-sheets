<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import type {
    EncounterMemberQuadroneContext,
    GroupMemberQuadroneContext,
  } from 'src/types/types';
  import { Tidy5eNpcSheetQuadrone } from '../../Tidy5eNpcSheetQuadrone.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import { getContext } from 'svelte';
  import type GroupMemberHpTooltip from 'src/tooltips/GroupMemberHpTooltip.svelte';

  let {
    rowDocument,
    rowContext,
  }: ColumnCellProps<
    any,
    GroupMemberQuadroneContext | EncounterMemberQuadroneContext
  > = $props();

  let hpValue = $derived(rowDocument.system.attributes?.hp?.value ?? 0);
  let tempHpValue = $derived(rowDocument.system.attributes?.hp?.temp ?? 0);
  let hpPct = $derived(rowDocument.system.attributes?.hp?.pct ?? 0);
  let effectiveMaxHp = $derived(
    rowDocument.system.attributes?.hp?.effectiveMax ?? 0,
  );

  let context = $derived(getSheetContext());

  const localize = FoundryAdapter.localize;

  const getHpTooltip = getContext<() => GroupMemberHpTooltip | undefined>(
    CONSTANTS.SVELTE_CONTEXT.HP_TOOLTIP,
  );
</script>

<div
  class="hp-column-content"
  onmouseenter={(ev) => getHpTooltip?.()?.tryShow(ev, rowDocument)}
>
  <div
    class="meter meter-small progress hit-points"
    style="--bar-percentage: {hpPct.toFixed(0)}%; --bar-adjusted: {tempHpValue.toFixed(0)}%; --bar-adjusted-background: var(--t5e-color-hp-temp); --bar-adjusted-content: '';"
  ></div>
  <div class="flexrow">
    <span class="font-data-medium color-text-default value">{hpValue}</span>
    <span class="font-body-medium color-text-lightest separator">/</span>
    <span class="font-label-medium color-text-default max">{effectiveMaxHp}</span>
  </div>
</div>
{#if 'canEdit' in rowContext && rowContext.canEdit}
  <button
    type="button"
    class="button button-borderless button-icon-only"
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
