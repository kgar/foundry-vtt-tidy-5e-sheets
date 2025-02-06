<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let denomination = $derived(
    CONFIG.DND5E.currencies[context.system.price.denomination],
  );

  let itemValueText = $derived(
    FoundryAdapter.formatNumber(context.system.price?.value),
  );
</script>

<div class="item-price font-weight-label">
  <!-- Currency Image -->
  <i
    class="currency {context.system?.price?.denomination ?? ''}"
    aria-label={denomination?.label ?? ''}
  ></i>
  <span class="item-price-number">
    <!-- Value Text -->
    <span class="color-text-default">
      {itemValueText}
    </span>
    <!-- Denom -->
    <span class="item-price-denomination color-text-lighter">
      {denomination?.abbreviation ?? ''}
    </span>
  </span>
</div>
