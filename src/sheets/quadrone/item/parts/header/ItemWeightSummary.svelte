<script lang="ts">
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  let context = $derived(getItemSheetContextQuadrone());

  function formatWeight(value: number | undefined): string {
    const rounded = Math.round((value ?? 0) * 100) / 100;
    return rounded.toFixed(2).replace(/\.0+$/, '').replace(/\.$/, '');
  }

  let unitsAbbreviation = $derived(FoundryAdapter.getWeightUnit());
</script>

<div class="item-weight">
  <i class="fas fa-weight-hanging item-weight-icon text-label-icon"></i>
  <span class="item-weight-value">
    <span class="color-text-default font-weight-label">
      {formatWeight(context.system.weight?.value)}
    </span>
    <span class="item-weight-units color-text-lighter">{unitsAbbreviation}</span>
  </span>
</div>
