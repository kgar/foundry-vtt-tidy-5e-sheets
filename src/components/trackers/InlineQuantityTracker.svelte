<script lang="ts">
  import type { Item5e } from 'src/types/item.types';
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { processInputChangeDeltaFromValues } from 'src/utils/form';
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';

  let attributes: HTMLInputAttributes = $props();

  let input: HTMLInputElement;

  function adjust(delta: string) {
    const newValue = processInputChangeDeltaFromValues(delta, input.value);
    if (newValue !== undefined) {
      input.value = newValue.toString();
      const changeEvent = new Event('change', { bubbles: true });
      input.dispatchEvent(changeEvent);
    }
  }
</script>

<article
  class={['tidy-inline-quantity-tracker', { disabled: attributes.disabled }]}
>
  <a
    class="command decrementer"
    onclick={() => !attributes.disabled && adjust('-1')}
  >
    <i class="fa-solid fa-minus"></i>
  </a>
  <span class="quantity-tracker-input-wrapper">
    <input
      bind:this={input}
      type="text"
      class="quantity-tracker-input"
      {@attach InputAttachments.selectOnFocus}
      {...attributes}
    />
  </span>
  <a
    class="command incrementer"
    onclick={() => !attributes.disabled && adjust('+1')}
  >
    <i class="fa-solid fa-plus"></i>
  </a>
</article>
