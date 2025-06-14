<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import CapacityBar from 'src/sheets/quadrone/container/parts/CapacityBar.svelte';
  import type { ContainerItemContext } from 'src/types/item.types';

  let { rowDocument, rowContext }: ColumnCellProps<any, ContainerItemContext> =
    $props();
</script>

<div class="inline-container-capacity-bar">
  {#if rowContext.containerContents}
    <CapacityBar
      container={rowDocument}
      capacity={rowContext.containerContents.capacity}
      showTracker={false}
    />
  {/if}
</div>
