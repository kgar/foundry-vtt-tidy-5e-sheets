<script lang="ts">
  import type { ColumnCellProps } from 'src/types/types';
  import CapacityBar from 'src/sheets/quadrone/container/parts/CapacityBar.svelte';
  import type { ContainerItemContext } from 'src/types/item.types';

  let { rowDocument, rowContext }: ColumnCellProps<any, ContainerItemContext> =
    $props();
</script>

<div class="inline-container-capacity">
  {#if rowContext.containerContents}
    <CapacityBar
      container={rowDocument}
      capacity={rowContext.containerContents.capacity}
      trackerPosition="left"
      showIcon={false}
      showUnits={true}
    />
  {/if}
</div>
