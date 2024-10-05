<script lang="ts">
  import { createEventDispatcher, getContext } from 'svelte';
  import ButtonMenuItem from './ButtonMenuItem.svelte';
  import type { ButtonMenuContext } from './button-menu-types';
  import { CONSTANTS } from 'src/constants';

  export let iconClass: string = '';
  export let useIconColumn: boolean = true;
  export let title: string | null = null;
  export let size: 'standard' | 'compact' = 'standard';
  export let disabled = false;

  const buttonMenuContext = getContext<ButtonMenuContext>(
    CONSTANTS.SVELTE_CONTEXT.BUTTON_MENU_CONTEXT,
  );
  const dispatch = createEventDispatcher<{
    click: {
      event: MouseEvent & { currentTarget: HTMLButtonElement };
    };
  }>();

  function handleClick(
    event: MouseEvent & { currentTarget: HTMLButtonElement },
  ) {
    buttonMenuContext.close();
    dispatch('click', { event });
  }
</script>

<ButtonMenuItem cssClass="button-menu-command-li">
  <button
    type="button"
    class="button-menu-command {size}"
    on:click={handleClick}
    {title}
    {disabled}
  >
    {#if useIconColumn}
      <span class="icon-container">
        {#if iconClass}
          <i class={iconClass} role="presentation" />
        {/if}
      </span>
    {/if}
    <span class="command-text">
      <slot />
    </span>
  </button>
</ButtonMenuItem>
