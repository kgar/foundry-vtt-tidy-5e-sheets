<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  const localize = FoundryAdapter.localize;
</script>

<div class="item-quantity">
  <span class="item-quantity-label color-text-lighter">
    {localize('DND5E.Quantity')}
  </span>
  <span class="item-quantity-value">
    {context.system.quantity}
  </span>
</div>
