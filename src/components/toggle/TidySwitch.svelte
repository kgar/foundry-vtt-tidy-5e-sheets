<script lang="ts">
  import { settingStore } from 'src/settings/settings';
  import { createEventDispatcher } from 'svelte';

  export let value: boolean = false;

  const switchLabelId = `switch-${Math.random()}-label`;
  const dispatcher = createEventDispatcher<{
    change: { originalValue: boolean };
  }>();

  function handleClick(
    ev: MouseEvent & {
      currentTarget: EventTarget & HTMLButtonElement;
    },
  ) {
    const originalValue = value;
    value = !value;
    dispatcher('change', { originalValue: originalValue });
  }
</script>

<label
  class="tidy-switch {$$props.class ?? ''}"
  id={switchLabelId}
  title={$$props.title ?? null}
>
  <slot />
  <button
    type="button"
    role="switch"
    on:click={(ev) => handleClick(ev)}
    aria-checked={value}
    aria-labelledby={switchLabelId}
    tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
  ></button>
</label>
