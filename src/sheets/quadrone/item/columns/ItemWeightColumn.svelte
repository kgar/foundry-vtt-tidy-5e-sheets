<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ColumnCellProps } from 'src/runtime/types';

  let { rowDocument: item, rowContext }: ColumnCellProps = $props();

  let weight = $derived(
    FoundryAdapter.formatNumber(
      rowContext?.totalWeight ?? item.system.weight.value,
    ),
  );
</script>

<span>
  {weight} <span class="color-text-lighter">{item.system.weight.units}</span>
</span>
