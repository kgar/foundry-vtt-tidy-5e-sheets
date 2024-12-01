<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  interface Props {
    checked?: boolean;
    disabled?: boolean;
    thumbIconClass?: string | undefined;
    children?: import('svelte').Snippet;
    [key: string]: any;
  }

  let {
    checked = $bindable(false),
    disabled = false,
    thumbIconClass = undefined,
    children,
    ...rest
  }: Props = $props();

  const switchLabelId = `switch-${foundry.utils.randomID()}-label`;

  const dispatcher = createEventDispatcher<{
    change: Event & { currentTarget: HTMLInputElement };
  }>();
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
    onchange={(ev) => dispatcher('change', ev)}
    {checked}
    {disabled}
    class="hidden"
  />
</label>
