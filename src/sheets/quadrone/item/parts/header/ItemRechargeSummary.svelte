<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import { getUsesRechargeDiceRange } from 'src/utils/formula';

  let context = $derived(getItemSheetContextQuadrone());

  const localize = FoundryAdapter.localize;

  let gmEditMode = $derived(FoundryAdapter.isInGmEditMode(context.document));

  let conceal = $derived(
    context.item.system.identified === false && !gmEditMode,
  );

  let { rechargeRange, diceIconClass } = $derived(getUsesRechargeDiceRange(context.item.system.uses));
</script>

<div class="item-recharge">
  <span class="color-text-lighter text-data">
    {localize('TIDY5E.RollRecharge.Label')}
  </span>
  {#if !conceal}
    <i class="{diceIconClass} color-text-lighter text-label-icon"></i>
    <span class="recharge-range-text text-data">
      {rechargeRange}
    </span>
  {:else}
    <span class="recharge-range-text text-data"> ? </span>
  {/if}
</div>
