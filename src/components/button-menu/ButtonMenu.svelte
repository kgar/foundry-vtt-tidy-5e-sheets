<script lang="ts">
  import { setContext } from 'svelte';
  import { clickOutside } from '../events/clickOutside';
  import type {
    ButtonMenuAnchor,
    ButtonMenuContext,
    ButtonMenuPosition,
  } from './button-menu-types';
  import { getPositionStyles } from './button-menu-position';

  export let open = false;
  export let buttonText: string = '';
  export let iconClass: string | null = null;
  export let ariaLabel: string | null = null;
  export let title: string | null = null;
  export let gap: string | false = '0.25rem';
  export let position: ButtonMenuPosition = 'bottom';
  export let anchor: ButtonMenuAnchor = 'center';

  let openerEl: HTMLElement;
  let menuStyles: string = '';

  setContext<ButtonMenuContext>('buttonMenuContext', { close: close });

  function close() {
    open = false;
  }

  function positionMenu(menuEl: HTMLElement) {
    menuStyles = getPositionStyles(openerEl, menuEl, position, anchor, gap);
  }
</script>

<div class="button-menu-wrapper">
  <button
    on:click={() => (open = !open)}
    aria-label={ariaLabel}
    bind:this={openerEl}
    {title}
    class="button-menu-opener"
  >
    {#if iconClass}
      <i class={iconClass} />
    {/if}
    {buttonText}
  </button>

  {#if open}
    <ul
      class="button-menu-list"
      use:clickOutside
      on:outsideclick={() => close()}
      style={menuStyles}
      use:positionMenu
    >
      <slot />
    </ul>
  {/if}
</div>
