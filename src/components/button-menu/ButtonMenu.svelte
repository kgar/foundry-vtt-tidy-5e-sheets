<script lang="ts">
  import { setContext, type Snippet } from 'svelte';
  import { clickOutside } from '../../events/clickOutside.svelte';
  import type {
    ButtonMenuAnchor,
    ButtonMenuContext,
    ButtonMenuPosition,
  } from './button-menu-types';
  import { getPositionStyles } from './button-menu-position';
  import { settings } from 'src/settings/settings.svelte';
  import { CONSTANTS } from 'src/constants';

  type StatefulIconClass = {
    opened: string | null;
    closed: string | null;
  };

  interface Props {
    open?: boolean;
    buttonText?: string;
    iconClass?: string | StatefulIconClass | null;
    wrapperClass?: string | null;
    listClass?: string | null;
    buttonClass?: string | null;
    openerPadding?: string | null;
    ariaLabel?: string | null;
    title?: string | null;
    gap?: string | false;
    position?: ButtonMenuPosition;
    anchor?: ButtonMenuAnchor;
    menuElement?: keyof HTMLElementTagNameMap;
    buttonStyle?: 'solid' | 'transparent-inline' | 'transparent-inline-icon';
    children?: Snippet;
  }

  let {
    open = $bindable(false),
    buttonText = '',
    iconClass = null,
    wrapperClass = null,
    listClass = null,
    buttonClass = null,
    openerPadding = null,
    ariaLabel = null,
    title = null,
    gap = '0.25rem',
    position = 'bottom',
    anchor = 'center',
    menuElement = 'ul',
    buttonStyle = 'solid',
    children,
  }: Props = $props();

  let openerEl: HTMLElement;
  let menuStyles: string = $state('');

  setContext<ButtonMenuContext>(CONSTANTS.SVELTE_CONTEXT.BUTTON_MENU_CONTEXT, {
    close: close,
  });

  function close() {
    open = false;
  }

  function positionMenu(menuEl: HTMLElement) {
    menuStyles = getPositionStyles(openerEl, menuEl, position, anchor, gap);
  }

  let actualIconClass: string | null = $derived.by(() => {
    if (iconClass !== null) {
      if (typeof iconClass === 'string') {
        return iconClass;
      } else {
        let potentialClass = open ? iconClass.opened : iconClass.closed;
        potentialClass ??= iconClass.opened ?? iconClass.closed;
        return potentialClass;
      }
    }
    return null;
  });
</script>

<div class="button-menu-wrapper {wrapperClass ?? ''}">
  <button
    type="button"
    onclick={() => (open = !open)}
    aria-label={ariaLabel}
    bind:this={openerEl}
    {title}
    class="button-menu-opener {buttonClass ?? ''} {buttonStyle}"
    style:padding={openerPadding}
  >
    {#if iconClass}
      <i class={actualIconClass}></i>
    {/if}
    {buttonText}
  </button>

  {#if open}
    <svelte:element
      this={menuElement}
      class="button-menu-list {listClass ?? ''}"
      use:clickOutside={{ callback: () => close() }}
      style={menuStyles}
      use:positionMenu
    >
      {@render children?.()}
    </svelte:element>
  {/if}
</div>
