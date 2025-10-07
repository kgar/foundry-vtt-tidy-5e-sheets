<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let weight = $derived(
    FoundryAdapter.formatNumber(context.system.weight.value?.toNearest(0.01)),
  );

  let unit = $derived(
    CONFIG.DND5E.weightUnits[context.system.weight.units]?.abbreviation ??
      context.system.weight.units,
  );
</script>

<div class="item-weight">
  <i class="fas fa-weight-hanging item-weight-icon text-label-icon"></i>
  <span class="item-weight-value text-data">
    {weight}
  </span>
  {#if unit}
    <span class="item-weight-unit color-text-lighter">
      {unit}
    </span>
  {/if}
</div>
