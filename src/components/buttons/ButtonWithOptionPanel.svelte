<script lang="ts">
  import { longpress } from 'src/actions/longpress';
  import { tick } from 'svelte';

  export let expanded: boolean = false;
  export let active: boolean = false;
  export let disabled: boolean = false;

  let menuEl: HTMLElement;
  let menuOpenerEl: HTMLElement;

  function handleFocusOut(
    event: FocusEvent & { currentTarget: EventTarget & HTMLElement },
  ) {
    console.warn('focusout');
    const relatedTarget = event.relatedTarget;
    const nearestMenuElement =
      relatedTarget instanceof HTMLElement
        ? relatedTarget.closest<HTMLElement>('menu, .button.with-options')
        : null;

    if (
      nearestMenuElement &&
      [menuEl, menuOpenerEl].includes(nearestMenuElement)
    ) {
      console.warn('focusout : still within menu or opener, ignoring');
      return;
    }

    console.warn('focusout : blurring');
    menuEl.blur();
    expanded = false;
  }

  async function toggleMenu(expand?: boolean): Promise<void> {
    console.warn('contextmenu');
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
      <i class="expand-indicator fas fa-caret-up fa-fw"></i>
    {:else}
      <i class="expand-indicator fas fa-caret-down fa-fw"></i>
    {/if}
  </a>

  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <menu
    class:expanded
    on:focusout={handleFocusOut}
    tabindex={expanded ? 0 : null}
    bind:this={menuEl}
  >
    <slot name="options" />
  </menu>
</div>
