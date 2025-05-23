<script lang="ts">
  import { longpress } from 'src/actions/longpress.svelte';
  import { tick, type Snippet } from 'svelte';
  import type { HTMLAttributes, MouseEventHandler } from 'svelte/elements';

  interface Props {
    expanded?: boolean;
    active?: boolean;
    disabled?: boolean;
    anchor?: 'left' | 'right';
    children?: Snippet;
    menu?: Snippet;
    onclick?: MouseEventHandler<HTMLElement>;
    longpressDelay?: number;
    buttonAttributes?: HTMLAttributes<HTMLButtonElement>;
    buttonClasses?: string;
    containerClasses?: string;
  }

  let {
    expanded = $bindable(false),
    active = false,
    disabled = false,
    anchor = 'left',
    children,
    menu: options,
    onclick,
    longpressDelay,
    buttonAttributes,
    buttonClasses,
    containerClasses,
    ...rest
  }: Props = $props();

  let menuEl: HTMLElement;
  let menuOpenerEl: HTMLElement;
  let longpressed = $state(false);

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
    longpressed = false;
  }

  async function toggleMenu(isLongpress: boolean): Promise<void> {
    expanded = !expanded;
    longpressed = isLongpress;

    if (expanded) {
      await tick();
      menuOpenerEl.focus();
    }
  }
</script>

<div class="button-with-options-wrapper {containerClasses}">
  <button
    type="button"
    class="button with-options {buttonClasses ?? ''}"
    class:expanded
    class:active
    class:disabled
    {disabled}
    use:longpress={{
      callback: () => toggleMenu(true),
      threshold: longpressDelay,
    }}
    onclick={(ev) => {
      if (!expanded) {
        onclick?.(ev);
      } else if (expanded && longpressed) {
        longpressed = false;
      } else {
        toggleMenu(false);
      }
    }}
    oncontextmenu={() => !expanded && toggleMenu(true)}
    onfocusout={handleFocusOut}
    tabindex={expanded ? 0 : null}
    bind:this={menuOpenerEl}
    {...buttonAttributes}
  >
    {@render children?.()}
    {#if expanded}
      <i class="expand-indicator fas fa-caret-up"></i>
    {:else}
      <i class="expand-indicator fas fa-caret-down"></i>
    {/if}
  </button>

  <menu
    class:expanded
    class="anchor-{anchor}"
    onfocusout={handleFocusOut}
    tabindex={expanded ? 0 : null}
    bind:this={menuEl}
  >
    {@render options?.()}
  </menu>
</div>
