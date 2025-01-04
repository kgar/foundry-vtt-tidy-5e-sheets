<script lang="ts">
  import type { Item5e } from 'src/types/item.types';
  import TextInput from '../inputs/TextInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { isNil } from 'src/utils/data';

  interface Props {
    item: Item5e;
    field?: string;
    disabled?: boolean;
  }

  let { item, field = 'system.quantity', disabled = false }: Props = $props();

  let quantity = $derived(FoundryAdapter.getProperty<number>(item, field));

  async function increment() {
    if (!isNil(quantity)) {
      await item.update({
        [field]: quantity + 1,
      });
    }
  }

  async function decrement() {
    if (!isNil(quantity)) {
      await item.update({
        [field]: quantity - 1,
      });
    }
  }
</script>

<article class="inline-item-quantity-tracker" class:disabled>
  <a class="decrementer" onclick={() => !disabled && decrement()}>
    <i class="fa-solid fa-minus"></i>
  </a>
  <TextInput
    document={item}
    {field}
    class="item-quantity-tracker-input"
    allowDeltaChanges={true}
    {disabled}
    value={quantity}
  ></TextInput>
  <a class="incrementer" onclick={() => !disabled && increment()}>
    <i class="fa-solid fa-plus"></i>
  </a>
</article>

<!-- TODO: Make a generic counter that can be injected onto the sheet for things like `So Inspired!` 🔥 -->
