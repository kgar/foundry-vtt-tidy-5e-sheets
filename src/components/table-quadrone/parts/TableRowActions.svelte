<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';

  let { rowDocument, rowContext }: ColumnCellProps = $props();

  const rowActions = $derived(rowContext.rowActions);
</script>

{#each rowActions as action}
  {#if action.condition?.({ data: rowDocument, rowContext: rowContext }) ?? true}
    {const props = $derived(action.props({ data: rowDocument, rowContext: rowContext }))}
    <action.component {...props} />
  {/if}
{/each}
