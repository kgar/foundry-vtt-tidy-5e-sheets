<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ChangeEventHandler } from 'svelte/elements';

  interface Props {
    checked?: boolean;
    disabled?: boolean;
    thumbIconClass?: string | undefined;
    onChange?: ChangeEventHandler<HTMLElement>;
    children?: Snippet;
    [key: string]: any;
  }

  let {
    checked = $bindable(false),
    disabled = false,
    thumbIconClass = undefined,
    onChange,
    children,
    ...rest
  }: Props = $props();

  const switchLabelId = `switch-${foundry.utils.randomID()}-label`;
</script>

<label
  class="tidy-switch {rest.class ?? ''}"
  class:disabled
  id={switchLabelId}
  title={rest.title ?? null}
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
