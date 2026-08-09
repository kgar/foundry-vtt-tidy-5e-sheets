<script lang="ts">
  import type { HTMLAttributes, HTMLInputAttributes } from 'svelte/elements';
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';

  type Props = {
    property: string;
    containerAttributes?: HTMLAttributes<HTMLElement>;
  } & HTMLInputAttributes;

  let { property, containerAttributes, ...attributes }: Props = $props();
</script>

<article
  class={['tidy-inline-quantity-tracker', { disabled: attributes.disabled }]}
  {...containerAttributes}
>
  <a
    class="command decrementer"
    data-action="decrease"
    data-property={property}
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
    data-action="increase"
    data-property={property}
  >
    <i class="fa-solid fa-plus"></i>
  </a>
</article>
