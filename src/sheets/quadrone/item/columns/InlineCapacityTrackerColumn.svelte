<script lang="ts">
  import type { ColumnCellProps } from 'src/types/columns.types';
  import type {
    ContainerContents,
    ContainerItemContext,
    Item5e,
  } from 'src/types/item.types';
  import CapacityTracker from '../../container/parts/CapacityTracker.svelte';
  import type { Actor5e } from 'src/types/types';

  type Props = {
    rowDocument: Item5e;
    rowContext: { containerContents?: ContainerContents };
  };

  let { rowDocument, rowContext }: Props =
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
