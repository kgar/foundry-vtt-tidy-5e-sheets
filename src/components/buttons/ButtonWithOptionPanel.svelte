<script lang="ts">
  import { longpress } from 'src/actions/longpress';
  import { tick, type Snippet } from 'svelte';
  import type { MouseEventHandler } from 'svelte/elements';

  interface Props {
    expanded?: boolean;
    active?: boolean;
    disabled?: boolean;
    anchor?: 'left' | 'right';
    children?: Snippet;
    options?: Snippet;
    onclick?: MouseEventHandler<HTMLElement>;
    [key: string]: any;
  }

  let {
    expanded = $bindable(false),
    active = false,
    disabled = false,
    anchor = 'left',
    children,
    options,
    onclick,
    ...rest
  }: Props = $props();

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
  <!-- kgar-migration-task - ensure longpress works as advertized -->
  <a
    class="button with-options {rest.class ?? ''}"
    class:expanded
    class:active
    class:disabled
    use:longpress={{ callback: () => toggleMenu() }}
    {onclick}
    oncontextmenu={() => toggleMenu(true)}
    onfocusout={handleFocusOut}
    tabindex={expanded ? 0 : null}
    bind:this={menuOpenerEl}
  >
    {@render children?.()}
    {#if expanded}
      <i class="expand-indicator fas fa-caret-up"></i>
    {:else}
      <i class="expand-indicator fas fa-caret-down"></i>
    {/if}
  </a>

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
