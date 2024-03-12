<script lang="ts">
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import type { Item5e } from 'src/types/item.types';
  import type { ActorSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let item: Item5e;
  export let ctx: any;

  let context = getContext<Readable<ActorSheetContext>>('context');
</script>

{#if !isNaN(item.system.quantity)}
  <span class="item-quantity" class:isStack={ctx?.isStack}>
    (<TextInput
      cssClass="item-count"
      document={item}
      field="system.quantity"
      value={item.system.quantity}
      selectOnFocus={true}
      disabled={!$context.editable || $context.lockItemQuantity}
      placeholder="0"
      allowDeltaChanges={true}
      on:click={(ev) => ev.stopPropagation()}
      on:keypress={(ev) => ev.stopPropagation()}
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
