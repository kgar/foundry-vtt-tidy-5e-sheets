<script lang="ts">
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settingStore } from 'src/settings/settings';
  import type { Item5e } from 'src/types/item';
  import type { ActorSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let item: Item5e;
  export let ctx: any;

  let context = getContext<Readable<ActorSheetContext>>('context');
</script>

{#if !isNaN(item.system.quantity)}
  <span class="item-quantity" class:isStack={ctx.isStack}>
    (<NumberInput
      cssClass="item-count"
      document={item}
      field="system.quantity"
      value={item.system.quantity}
      maxlength={3}
      readonly={!FoundryAdapter.userIsGm() && $settingStore.lockItemQuantity}
      selectOnFocus={true}
      stopClickPropagation={true}
      disabled={!$context.owner || $context.lockItemQuantity}
      placeholder="0"
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
