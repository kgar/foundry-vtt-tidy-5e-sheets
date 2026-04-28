<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import type { ActiveEffect5e, ActiveEffectContext } from 'src/types/types';

  let {
    rowDocument,
    rowContext,
    section,
  }: ColumnCellProps<ActiveEffect5e, ActiveEffectContext> = $props();
</script>

{#if rowContext.source}
  <a data-action="showDocument" data-uuid={rowContext.source?.uuid}>
    {rowContext.source.name ?? ''}
  </a>
{:else}
  <span class="color-text-disabled"> &mdash; </span>
{/if}
