<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let checked: boolean = false;
  export let disabled: boolean = false;
  export let thumbIconClass: string | undefined = undefined;

  const switchLabelId = `switch-${foundry.utils.randomID()}-label`;

  const dispatcher = createEventDispatcher<{
    change: Event & { currentTarget: HTMLInputElement };
  }>();
</script>

<label
  class="tidy-switch {$$props.class ?? ''}"
  class:disabled
  id={switchLabelId}
  title={$$props.title ?? null}
>
  <slot />
  <div role="switch" aria-checked={checked} aria-labelledby={switchLabelId}>
    {#if thumbIconClass}
      <i class="thumb-icon {thumbIconClass}"></i>
    {/if}
  </div>

  <input
    type="checkbox"
    on:change={(ev) => dispatcher('change', ev)}
    {checked}
    {disabled}
    class="hidden"
  />
</label>
