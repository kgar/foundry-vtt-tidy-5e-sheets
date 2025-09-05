<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import type { GroupMemberQuadroneContext } from 'src/types/types';

  let {
    rowDocument,
    rowContext,
  }: ColumnCellProps<any, GroupMemberQuadroneContext> = $props();
</script>

<div
  class="meter meter-small progress xp"
  style="--bar-percentage: {rowDocument.system.details.xp.pct}%;"
></div>
<span class="font-label-medium color-text-default"
  >{rowDocument.system.details.xp.value}</span
>
