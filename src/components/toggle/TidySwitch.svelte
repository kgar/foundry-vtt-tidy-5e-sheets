<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let value: boolean = false;
  export let disabled: boolean = false;
  export let thumbIconClass: string | undefined = undefined;

  const switchLabelId = `switch-${foundry.utils.randomID()}-label`;
  const dispatcher = createEventDispatcher<{
    change: { originalValue: boolean };
  }>();

  function handleClick(
    _: MouseEvent & {
      currentTarget: EventTarget & HTMLElement;
    },
  ) {
    const originalValue = value;
    value = !value;
    dispatcher('change', { originalValue: originalValue });
  }
</script>

<label
  class="tidy-switch {$$props.class ?? ''}"
  class:disabled
  id={switchLabelId}
  title={$$props.title ?? null}
>
  <slot />
  <!-- svelte-ignore a11y-interactive-supports-focus -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-missing-attribute -->
  <a
    role="switch"
    on:click={(ev) => !disabled && handleClick(ev)}
    aria-checked={value}
    aria-labelledby={switchLabelId}
  >
    {#if thumbIconClass}
      <i class="thumb-icon {thumbIconClass}"></i>
    {/if}
  </a>
</label>
