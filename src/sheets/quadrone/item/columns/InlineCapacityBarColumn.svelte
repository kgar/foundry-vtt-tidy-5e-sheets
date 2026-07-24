<script lang="ts">
  import CapacityBar from 'src/sheets/quadrone/container/parts/CapacityBar.svelte';
  import type { ContainerContents } from 'src/types/item.types';

  type Props = {
    rowDocument: any;
    containerContents?: ContainerContents;
  };

  let { rowDocument, containerContents }: Props = $props();
</script>

<div class="inline-container-capacity-bar">
  {#if containerContents}
    <CapacityBar
      container={rowDocument}
      capacity={containerContents.capacity}
      showTracker={false}
    />
  {/if}
</div>
