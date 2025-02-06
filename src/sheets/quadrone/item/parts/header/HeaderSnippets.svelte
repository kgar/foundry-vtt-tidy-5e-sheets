<script lang="ts" module>
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetQuadroneContext } from 'src/types/item.types';

  export { itemCharges };
</script>

{#snippet itemCharges(context: ItemSheetQuadroneContext)}
  {#if context.item.hasLimitedUses}
    <div class="item-charges">
      <div class="counter">
        <span class="value">
          {context.item.system.uses.max - context.item.system.uses.spent}
        </span>
        <span class="charges-slash">/</span>
        <span class="max">
          {context.item.system.uses.max}
        </span>
      </div>
      <span class="charges-text">
        {FoundryAdapter.localize('DND5E.Charges')}
      </span>
    </div>

    <div class="item-header-summary-separator" role="presentation"></div>
  {/if}
{/snippet}
