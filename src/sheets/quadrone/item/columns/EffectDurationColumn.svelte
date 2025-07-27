<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import type { ActiveEffect5e, ActiveEffectContext } from 'src/types/types';

  let {
    rowDocument,
    rowContext,
    section,
  }: ColumnCellProps<ActiveEffect5e, ActiveEffectContext> = $props();
</script>

<span class="truncate">
  {rowContext.effect.effect.duration.label ?? ''}
</span>
