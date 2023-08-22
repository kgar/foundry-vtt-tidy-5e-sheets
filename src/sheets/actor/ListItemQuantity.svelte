<script lang="ts">
  import NumberInput from 'src/components/form/NumberInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { SettingsProvider } from 'src/settings/settings';
  import type { Item5e } from 'src/types/item';

  export let item: Item5e;
  export let ctx: any;
</script>

{#if item.system.quantity}
  <span class="item-quantity" class:isStack={ctx.isStack}>
    (<NumberInput
      cssClass="item-count"
      document={item}
      field="system.quantity"
      value={item.system.quantity}
      maxlength={3}
      readonly={!FoundryAdapter.userIsGm() &&
        SettingsProvider.settings.lockItemQuantity.get()}
      selectOnFocus={true}
      stopClickPropagation={true}
    />)
  </span>
{/if}

<style lang="scss">
  .item-quantity {
    flex: 0;
    display: flex;
    align-items: center;
    text-align: center;
    transition: opacity 0.3s ease;

    :global(input) {
      width: 1.4375rem;
      height: 100%;
    }
  }
</style>
