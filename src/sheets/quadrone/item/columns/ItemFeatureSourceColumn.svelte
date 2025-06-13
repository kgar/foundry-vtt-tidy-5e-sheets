<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import { isNil } from 'src/utils/data';

  let { rowDocument }: ColumnCellProps = $props();
</script>

{#if !isNil(rowDocument.system.requirements, '')}
  {rowDocument.system.requirements}
{:else}
  <span class="color-text-disabled">—</span>
{/if}
