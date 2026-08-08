<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  const localize = FoundryAdapter.localize;

  let appId = $derived(context.document.id);
</script>

<div
  class="item-quantity pointer"
  data-action="emphasize"
  data-emphasize-tab-id={CONSTANTS.TAB_ITEM_DETAILS}
  data-emphasize-selector="[id='{appId}-quantity']"
>
  <span class="item-quantity-label color-text-lighter">
    {localize('DND5E.Quantity')}
  </span>
  <span class="item-quantity-value">
    {context.system.quantity}
  </span>
</div>
