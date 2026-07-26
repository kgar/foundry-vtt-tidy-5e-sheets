<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e } from 'src/types/item.types';

  type Props = {
    rowDocument: Item5e;
    // TODO: eliminate any
    rowContext: any;
  };

  let { rowDocument: item, rowContext }: Props = $props();

  let weight = $derived(
    FoundryAdapter.formatNumber(
      (rowContext?.totalWeight ?? item.system.weight.value)?.toNearest(0.01),
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
