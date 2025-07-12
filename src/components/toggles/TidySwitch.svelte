<script lang="ts">
  import type { Snippet } from 'svelte';
  import type {
    ChangeEventHandler,
    ClassValue,
    HTMLAttributes,
  } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLElement> {
    checked?: boolean;
    disabled?: boolean;
    thumbIconClass?: string | undefined;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    children?: Snippet;
    class?: ClassValue;
  }

  let {
    checked = $bindable(false),
    disabled = false,
    thumbIconClass = undefined,
    onChange,
    children,
    class: cssClass,
    ...rest
  }: Props = $props();

  const switchLabelId = `switch-${foundry.utils.randomID()}-label`;
</script>

<label
  class={['tidy-switch', cssClass]}
  class:disabled
  id={switchLabelId}
  {...rest}
>
  {@render children?.()}
  <div role="switch" aria-checked={checked} aria-labelledby={switchLabelId}>
    {#if thumbIconClass}
      <i class="thumb-icon {thumbIconClass}"></i>
    {/if}
  </div>

  <input
    type="checkbox"
    onchange={onChange}
    {checked}
    {disabled}
    class="hidden"
  />
</label>
