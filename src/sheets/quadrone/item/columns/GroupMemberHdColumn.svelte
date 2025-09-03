<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import type { GroupMemberQuadroneContext } from 'src/types/types';

  let {
    rowDocument,
    rowContext,
  }: ColumnCellProps<any, GroupMemberQuadroneContext> = $props();

  let hdPct = $derived(rowDocument.system.attributes?.hd?.pct ?? 0);
</script>

<div
  class="meter meter-small progress hit-die"
  style="--bar-percentage: {hdPct.toFixed(0)}%"
></div>
<div class="flexrow">
  <span class="font-data-medium color-text-default"
    >{rowDocument.system.attributes.hd.value}</span
  >
  <span class="font-body-medium color-text-lightest separator">/</span>
  <span class="font-label-medium color-text-default"
    >{rowDocument.system.attributes.hd.max}</span
  >
</div>
