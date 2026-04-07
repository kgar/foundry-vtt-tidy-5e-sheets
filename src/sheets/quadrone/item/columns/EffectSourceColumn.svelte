<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import type { ActiveEffect5e, ActiveEffectContext } from 'src/types/types';

  let {
    rowDocument,
    rowContext,
    section,
  }: ColumnCellProps<ActiveEffect5e, ActiveEffectContext> = $props();
</script>

{#if rowContext.effect.source}
  <a data-action="showDocument" data-uuid={rowContext.effect.source?.uuid}>
    {rowContext.effect.source.name ?? ''}
  </a>
{:else}
  <span class="color-text-disabled"> &mdash; </span>
{/if}
