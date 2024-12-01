<script lang="ts">
  import { run } from 'svelte/legacy';

  import { setContext, type Snippet } from 'svelte';
  import { clickOutside } from '../../events/clickOutside';
  import type {
    ButtonMenuAnchor,
    ButtonMenuContext,
    ButtonMenuPosition,
  } from './button-menu-types';
  import { getPositionStyles } from './button-menu-position';
  import { settingStore } from 'src/settings/settings';
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

  let openerEl: HTMLElement = $state();
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

  let actualIconClass: string | null = $state();
  run(() => {
    if (iconClass !== null) {
      if (typeof iconClass === 'string') {
        actualIconClass = iconClass;
      } else {
        let potentialClass = open ? iconClass.opened : iconClass.closed;
        potentialClass ??= iconClass.opened ?? iconClass.closed;
        actualIconClass = potentialClass;
      }
    }
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
    tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
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
      use:clickOutside
      onoutsideclick={() => close()}
      style={menuStyles}
      use:positionMenu
    >
      {@render children?.()}
    </svelte:element>
  {/if}
</div>
