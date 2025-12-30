<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ColumnCellProps } from 'src/runtime/types';
  import { getVehicleSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { VehicleItemContext } from 'src/types/types';

  let { rowDocument, rowContext }: ColumnCellProps<any, VehicleItemContext> =
    $props();

  let hpValue = $derived(rowDocument.system.hp?.value ?? 0);
  let hpPct = $derived(rowDocument.system.hp?.pct ?? 0);
  let effectiveMaxHp = $derived(rowDocument.system.hp?.max ?? 0);
</script>

<div
  class="meter meter-small progress hit-points"
  style="--bar-percentage: {hpPct.toFixed(0)}%"
></div>
<div class="flexrow">
  <span class="font-data-medium color-text-default value">{hpValue}</span>
  <span class="font-body-medium color-text-lightest separator">/</span>
  <span class="font-label-medium color-text-default max">{effectiveMaxHp}</span>
</div>
