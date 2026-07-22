<script lang="ts">
  import type { ColumnCellProps } from 'src/types/types';

  let { rowDocument }: ColumnCellProps = $props();
</script>

{#if rowDocument.labels.target}
  <span class="condensed">{rowDocument.labels.target}</span>
{:else}
  <span class="color-text-disabled">—</span>
{/if}
