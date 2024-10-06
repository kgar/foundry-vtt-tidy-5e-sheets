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
      event: MouseEvent & { currentTarget: HTMLElement };
    };
  }>();

  function handleClick(event: MouseEvent & { currentTarget: HTMLElement }) {
    buttonMenuContext.close();
    dispatch('click', { event });
  }
</script>

<ButtonMenuItem cssClass="button-menu-command-li">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-missing-attribute -->
  <a
    class="button-menu-command {size}"
    class:disabled
    on:click={handleClick}
    {title}
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
  </a>
</ButtonMenuItem>
