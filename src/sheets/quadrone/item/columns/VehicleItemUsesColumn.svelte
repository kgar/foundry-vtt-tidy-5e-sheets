<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import type { VehicleItemContext } from 'src/types/types';

  let { rowDocument, rowContext }: ColumnCellProps<any, VehicleItemContext> =
    $props();

  let value = $derived(rowDocument.system.uses?.value ?? 0);
  let max = $derived(rowDocument.system.uses?.max ?? 0);
  let pct = $derived(calculatePct());

  function calculatePct() {
    if (max === 0) {
      return 0;
    }

    return (value / max) * 100;
  }
</script>

<div
  class="meter meter-small progress uses"
  style="--bar-percentage: {pct.toFixed(0)}%"
></div>
<div class="flexrow">
  <span class="font-data-medium color-text-default value">{value}</span>
  <span class="font-body-medium color-text-lightest separator">/</span>
  <span class="font-label-medium color-text-default max">{max}</span>
</div>
