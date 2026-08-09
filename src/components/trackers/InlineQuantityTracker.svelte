<script lang="ts">
  import type { HTMLAttributes, HTMLInputAttributes } from 'svelte/elements';
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';

  type Props = {
    property: string;
    containerAttributes?: HTMLAttributes<HTMLElement>;
    increaseAction?: string;
    increaseAttributes?: HTMLAttributes<HTMLAnchorElement>;
    decreaseAction?: string;
    decreaseAttributes?: HTMLAttributes<HTMLAnchorElement>;
  } & HTMLInputAttributes;

  let {
    property,
    containerAttributes,
    decreaseAction,
    decreaseAttributes,
    increaseAction,
    increaseAttributes,
    ...attributes
  }: Props = $props();
</script>

<article
  class={['tidy-inline-quantity-tracker', { disabled: attributes.disabled }]}
  {...containerAttributes}
>
  <a
    class="command decrementer"
    data-action={decreaseAction ?? 'decrease'}
    data-property={property}
    {...decreaseAttributes}
  >
    <i class="fa-solid fa-minus"></i>
  </a>
  <span class="quantity-tracker-input-wrapper">
    <input
      type="text"
      inputmode="numeric"
      class="quantity-tracker-input"
      {@attach InputAttachments.selectOnFocus}
      data-name={property}
      {...attributes}
    />
  </span>
  <a
    class="command incrementer"
    data-action={increaseAction ?? 'increase'}
    data-property={property}
    {...increaseAttributes}
  >
    <i class="fa-solid fa-plus"></i>
  </a>
</article>
