<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';

  let { rowDocument, section }: ColumnCellProps = $props();
</script>

{#each section.rowActions as action}
  {#if action.condition?.({ data: rowDocument, section }) ?? true}
    {@const props = action.props(rowDocument)}
    <action.component {...props} />
  {/if}
{/each}
