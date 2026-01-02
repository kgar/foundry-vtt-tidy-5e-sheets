<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { processInputChangeDeltaFromValues } from 'src/utils/form';
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';

  type Props = {
    onIncrement?: (
      event: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement },
    ) => void;
    onDecrement?: (
      event: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement },
    ) => void;
  } & HTMLInputAttributes;

  let { onIncrement, onDecrement, ...attributes }: Props = $props();

  let input: HTMLInputElement;

  let min = $derived(attributes.min ? +attributes.min : -Infinity);

  function adjust(delta: string) {
    const newValue = processInputChangeDeltaFromValues(delta, input.value);

    if (newValue !== undefined) {
      input.value = newValue.toString();
      const changeEvent = new Event('change', { bubbles: true });
      input.dispatchEvent(changeEvent);
    }
  }

  function decrement(
    event: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement },
  ) {
    if (attributes.value - 1 < min || attributes.disabled) {
      return;
    }

    adjust('-1');

    onDecrement?.(event);
  }

  function increment(
    event: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement },
  ) {
    if (attributes.disabled) {
      return;
    }

    adjust('+1');

    onIncrement?.(event);
  }
</script>

<article
  class={['tidy-inline-quantity-tracker', { disabled: attributes.disabled }]}
>
  <a class="command decrementer" onclick={decrement}>
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
  <a class="command incrementer" onclick={increment}>
    <i class="fa-solid fa-plus"></i>
  </a>
</article>
