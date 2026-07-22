<script lang="ts">
  import type { ColumnCellProps } from 'src/types/columns.types';
  import type { VehicleCrewMemberContext } from 'src/types/types';

  let {
    rowDocument,
    rowContext,
  }: ColumnCellProps<any, VehicleCrewMemberContext> = $props();
</script>

{#if rowContext.assignedTo}
  <img
    class="item-image"
    alt={rowContext.assignedTo.name}
    src={rowContext.assignedTo.img}
  />
  <!-- svelte-ignore a11y_missing_attribute -->
  <a
    class="item-name"
    role="button"
    data-keyboard-focus
    tabindex="0"
    data-action="showDocument"
    data-uuid={rowContext.assignedTo.uuid}
  >
    <span class="cell-text">
      <span class="cell-name">{rowContext.assignedTo.name}</span>
    </span>
  </a>
{/if}
