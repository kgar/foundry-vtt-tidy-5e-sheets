<script lang="ts">
  import type { Item5e } from 'src/types/item.types';

  let { rowDocument }: { rowDocument: Item5e } = $props();
</script>

{#if rowDocument.labels.recovery}
  {rowDocument.labels.recovery}
{:else}
  <span class="color-text-disabled">—</span>
{/if}
