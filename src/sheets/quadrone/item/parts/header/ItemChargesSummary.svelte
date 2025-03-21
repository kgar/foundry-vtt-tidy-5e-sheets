<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  const localize = FoundryAdapter.localize;

  let gmEditMode = $derived(FoundryAdapter.isInGmEditMode(context.document));

  let conceal = $derived(
    context.item.system.identified === false && !gmEditMode,
  );
</script>

<div class="item-charges">
  {#if !conceal}
    <div class="counter">
      <span class="value text-data">
        {context.item.system.uses.max - context.item.system.uses.spent}
      </span>
      <span class="charges-slash separator">/</span>
      <span class="max text-data">
        {context.item.system.uses.max}
      </span>
    </div>
  {:else}
    <div class="counter color-text-diminished">&mdash;</div>
  {/if}
  <span class="charges-text text-label">
    {localize('DND5E.Charges')}
  </span>
</div>
