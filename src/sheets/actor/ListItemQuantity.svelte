<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { SettingsProvider } from 'src/settings/settings';
  import type { Item5e } from 'src/types/item';

  export let item: Item5e;
  export let ctx: any;

  function updateItemQuantity(
    event: FocusEvent & {
      currentTarget: EventTarget & HTMLInputElement;
    },
    item: Item5e
  ) {
    const input = parseInt(event.currentTarget.value);
    const uses = !isNaN(input) ? input : item.system.quantity;
    event.currentTarget.value = uses.toString();
    item.update({ 'system.quantity': uses });
  }
</script>

{#if item.system.quantity}
  <span class="item-quantity" class:isStack={ctx.isStack}>
    (<input
      class="item-count"
      type="text"
      value={item.system.quantity}
      maxlength="3"
      on:click|stopPropagation
      on:blur={(event) => updateItemQuantity(event, item)}
      readonly={!FoundryAdapter.userIsGm() &&
        SettingsProvider.settings.lockItemQuantity.get()}
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

    input {
      width: 1.4375rem;
      height: 100%;
    }
  }
</style>
