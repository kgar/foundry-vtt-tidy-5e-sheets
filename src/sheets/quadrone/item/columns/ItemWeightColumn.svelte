<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ColumnCellProps } from 'src/runtime/types';

  let { rowDocument: item, rowContext }: ColumnCellProps = $props();

  let weight = $derived(
    FoundryAdapter.formatNumber(
      rowContext?.totalWeight ?? item.system.weight.value,
    ),
  );

  let unit = $derived(
    CONFIG.DND5E.weightUnits[item.system.weight.units]?.abbreviation ??
      item.system.weight.units,
  );
</script>

<span>
  {weight}
  <span class="color-text-lighter">{unit}</span>
</span>
