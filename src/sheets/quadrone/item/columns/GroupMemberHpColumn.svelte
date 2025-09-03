<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import type { GroupMemberQuadroneContext } from 'src/types/types';

  let {
    rowDocument,
    rowContext,
  }: ColumnCellProps<any, GroupMemberQuadroneContext> = $props();

  let hpValue = $derived(rowDocument.system.attributes?.hp?.value ?? 0);
  let hpPct = $derived(rowDocument.system.attributes?.hp?.pct ?? 0);
  let effectiveMaxHp = $derived(
    rowDocument.system.attributes?.hp?.effectiveMax ?? 0,
  );
</script>

<div
  class="meter meter-small progress hit-points"
  style="--bar-percentage: {hpPct.toNearest(0)}%"
></div>
<div class="flexrow">
  <span class="font-data-medium color-text-default">{hpValue}</span>
  <span class="font-body-medium color-text-lightest separator">/</span>
  <span class="font-label-medium color-text-default">{effectiveMaxHp}</span>
</div>
