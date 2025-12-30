<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import type { VehicleItemContext } from 'src/types/types';

  let { rowDocument, rowContext }: ColumnCellProps<any, VehicleItemContext> =
    $props();

  const value = $derived(
    rowContext.crew?.filter((c) => c.actor && !c.brokenLink).length ?? 0,
  );
  const max = $derived(rowDocument.system.crew?.max);
</script>

{#if max !== undefined || value > 0}
  <span class="inline-crew-count">
    <span class="uses-value color-text-default">
      {value}
    </span>/<span class="uses-max color-text-lighter">{max ?? "?"}</span>
  </span>
{/if}
