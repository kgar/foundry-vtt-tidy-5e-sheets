<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import type { CrewMemberContext } from 'src/types/types';

  let { rowDocument, rowContext }: ColumnCellProps<any, CrewMemberContext> =
    $props();
</script>

{#if rowContext.assignedTo}
  <img
    class="item-image"
    alt={rowContext.assignedTo.name}
    src={rowContext.assignedTo.img}
  />
  <a class="item-name" role="button" data-keyboard-focus tabindex="0">
    <span class="cell-text">
      <span class="cell-name">{rowContext.assignedTo.name}</span>
    </span>
  </a>
{/if}
