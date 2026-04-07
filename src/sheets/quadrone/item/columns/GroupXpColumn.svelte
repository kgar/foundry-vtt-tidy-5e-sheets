<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { ColumnCellProps } from 'src/runtime/types';
  import type { GroupMemberQuadroneContext } from 'src/types/types';

  let {
    rowDocument,
    rowContext,
  }: ColumnCellProps<any, GroupMemberQuadroneContext> = $props();
</script>

{#if rowDocument.system.details.xp}
  {#if rowDocument.system.isCharacter}
    <div
      class="meter meter-small progress xp"
      style="--bar-percentage: {rowDocument.system.details.xp.pct}%;"
    ></div>
    <span class="font-label-medium color-text-default"
      >{rowDocument.system.details.xp.value}</span
    >
  {:else if rowDocument.system.details.xp.value}

    <span class="font-label-large color-text-default"
      >{rowDocument.system.details.xp.value.toLocaleString()}</span
    >
  {:else}
    <span class="color-text-disabled">—</span>
  {/if}
{/if}
