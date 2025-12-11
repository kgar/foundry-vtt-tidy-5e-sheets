<script lang="ts">
  import { getContext, type Snippet } from 'svelte';
  import ButtonMenuItem from './ButtonMenuItem.svelte';
  import type { ButtonMenuContext } from './button-menu-types';
  import { settings } from 'src/settings/settings.svelte';
  import { CONSTANTS } from 'src/constants';
  import type { MouseEventHandler } from 'svelte/elements';

  interface Props {
    iconClass?: string;
    useIconColumn?: boolean;
    title?: string | null;
    size?: 'standard' | 'compact';
    disabled?: boolean;
    onMenuClick?: MouseEventHandler<HTMLElement>;
    children?: Snippet;
  }

  let {
    iconClass = '',
    useIconColumn = true,
    title = null,
    size = 'standard',
    disabled = false,
    onMenuClick,
    children,
  }: Props = $props();

  const buttonMenuContext = getContext<ButtonMenuContext>(
    CONSTANTS.SVELTE_CONTEXT.BUTTON_MENU_CONTEXT,
  );

  function handleClick(
    event: MouseEvent & { currentTarget: HTMLButtonElement },
  ) {
    buttonMenuContext.close();
    onMenuClick?.(event);
  }
</script>

<ButtonMenuItem cssClass="button-menu-command-li">
  <button
    type="button"
    class="button-menu-command {size}"
    onclick={handleClick}
    {title}
    {disabled}
  >
    {#if useIconColumn}
      <span class="icon-container">
        {#if iconClass}
          <i class={iconClass} role="presentation"></i>
        {/if}
      </span>
    {/if}
    <span class="command-text">
      {@render children?.()}
    </span>
  </button>
</ButtonMenuItem>
