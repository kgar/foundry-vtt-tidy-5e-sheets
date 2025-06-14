<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';

  let { rowDocument }: ColumnCellProps = $props();
</script>

{#if rowDocument.labels.recovery}
  {rowDocument.labels.recovery}
{:else}
  <span class="color-text-disabled">—</span>
{/if}
