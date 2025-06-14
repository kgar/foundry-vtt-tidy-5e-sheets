<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import type { ContainerItemContext } from 'src/types/item.types';
  import CapacityTracker from '../../container/parts/CapacityTracker.svelte';

  let { rowDocument, rowContext }: ColumnCellProps<any, ContainerItemContext> =
    $props();
</script>


<div class="inline-container-capacity-tracker">
    {#if rowContext.containerContents}
        <CapacityTracker
          container={rowDocument}
          capacity={rowContext.containerContents.capacity}
          showIcon={false}
        />
    {/if}
</div>
