<script lang="ts">
  import { longpress } from 'src/actions/longpress';
  import { tick } from 'svelte';

  export let expanded: boolean = false;
  export let active: boolean = false;
  export let disabled: boolean = false;
  export let anchor: 'left' | 'right' = 'left';

  let menuEl: HTMLElement;
  let menuOpenerEl: HTMLElement;

  function handleFocusOut(
    event: FocusEvent & { currentTarget: EventTarget & HTMLElement },
  ) {
    const relatedTarget = event.relatedTarget;
    const nearestMenuElement =
      relatedTarget instanceof HTMLElement
        ? relatedTarget.closest<HTMLElement>('menu, .button.with-options')
        : null;

    if (
      nearestMenuElement &&
      [menuEl, menuOpenerEl].includes(nearestMenuElement)
    ) {
      return;
    }

    menuEl.blur();
    expanded = false;
  }

  async function toggleMenu(expand?: boolean): Promise<void> {
    expanded = expand ?? !expanded;

    if (expanded) {
      await tick();
      menuOpenerEl.focus();
    }
  }
</script>

<div class="button-with-options-wrapper">
  <!-- svelte-ignore a11y-missing-attribute -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <a
    class="button with-options {$$restProps.class ?? ''}"
    class:expanded
    class:active
    class:disabled
    use:longpress
    on:longpress={() => toggleMenu()}
    on:click
    on:contextmenu={() => toggleMenu(true)}
    on:focusout={handleFocusOut}
    tabindex={expanded ? 0 : null}
    bind:this={menuOpenerEl}
  >
    <slot />
    {#if expanded}
      <i class="expand-indicator fas fa-caret-up"></i>
    {:else}
      <i class="expand-indicator fas fa-caret-down"></i>
    {/if}
  </a>

  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <menu
    class:expanded
    class="anchor-{anchor}"
    on:focusout={handleFocusOut}
    tabindex={expanded ? 0 : null}
    bind:this={menuEl}
  >
    <slot name="options" />
  </menu>
</div>
