<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import type { GroupMemberQuadroneContext } from 'src/types/types';

  let {
    rowDocument,
    rowContext,
  }: ColumnCellProps<any, GroupMemberQuadroneContext> = $props();

  let crewCount = $derived(
    rowDocument.system.cargo.crew.reduce(
      (total: number, crew: any) => crew.quantity + total,
      0,
    ),
  );

  let crewMax = $derived(rowDocument.system.crew.max ?? 0);

  let crewPct = $derived(
    crewMax === 0 ? 0 : Math.clamp((crewCount / crewMax) * 100, 0, 100),
  );
</script>

<div
  class="meter meter-small progress capacity"
  style="--bar-percentage: {crewPct}%;"
></div>
<div class="flexrow truncate damage-formula-container" data-tooltip={`${crewCount} / ${crewMax}`}>
  <span class="font-data-medium color-text-default">{crewCount}</span>
  <span class="font-body-medium color-text-lightest separator">/</span>
  <span class="font-label-medium color-text-default">{crewMax}</span>
</div>
