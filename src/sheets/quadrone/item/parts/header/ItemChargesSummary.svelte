<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  const localize = FoundryAdapter.localize;
</script>

<div class="item-charges">
  <div class="counter">
    <span class="value text-data">
      {context.item.system.uses.max - context.item.system.uses.spent}
    </span>
    <span class="charges-slash separator">/</span>
    <span class="max text-data">
      {context.item.system.uses.max}
    </span>
  </div>
  <span class="charges-text text-label">
    {localize('DND5E.Charges')}
  </span>
</div>
