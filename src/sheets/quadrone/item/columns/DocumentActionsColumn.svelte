<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';

  let { rowDocument, rowContext, section }: ColumnCellProps = $props();
</script>

{#each section.rowActions as action}
  {#if action.condition?.({ data: rowDocument, section, rowContext: rowContext }) ?? true}
    {@const props = action.props({ data: rowDocument, section, rowContext: rowContext })}
    <action.component {...props} />
  {/if}
{/each}
