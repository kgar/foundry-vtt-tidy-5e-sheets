<script lang="ts">
  import type { Item5e } from 'src/types/item.types';

  let { rowDocument }: { rowDocument: Item5e } = $props();
</script>

{#if rowDocument.labels.target}
  <span class="condensed">{rowDocument.labels.target}</span>
{:else}
  <span class="color-text-disabled">—</span>
{/if}
