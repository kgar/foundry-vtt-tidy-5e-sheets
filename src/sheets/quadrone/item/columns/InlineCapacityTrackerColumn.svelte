<script lang="ts">
  import type { ContainerContents, Item5e } from 'src/types/item.types';
  import CapacityTracker from '../../container/parts/CapacityTracker.svelte';

  type Props = {
    rowDocument: Item5e;
    rowContext: { containerContents?: ContainerContents };
  };

  let { rowDocument, rowContext }: Props = $props();
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
