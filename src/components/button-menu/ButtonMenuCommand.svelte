<script lang="ts">
  import { createEventDispatcher, getContext } from 'svelte';
  import ButtonMenuItem from './ButtonMenuItem.svelte';
  import type { ButtonMenuContext } from './button-menu-types';

  export let iconClass: string = '';
  export let title: string | null = null;

  const buttonMenuContext = getContext<ButtonMenuContext>('buttonMenuContext');
  const dispatch = createEventDispatcher<{
    click: {
      event: MouseEvent & { currentTarget: HTMLButtonElement };
    };
  }>();

  function handleClick(
    event: MouseEvent & { currentTarget: HTMLButtonElement }
  ) {
    buttonMenuContext.close();
    dispatch('click', { event });
  }
</script>

<ButtonMenuItem cssClass="button-menu-command-li">
  <button
    type="button"
    class="button-menu-command"
    on:click={handleClick}
    {title}
  >
    <span class="icon-container">
      {#if iconClass}
        <i class={iconClass} role="presentation" />
      {/if}
    </span>
    <span class="command-text">
      <slot />
    </span>
  </button>
</ButtonMenuItem>
