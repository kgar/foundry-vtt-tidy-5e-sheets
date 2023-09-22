<script lang="ts">
  import { createEventDispatcher, getContext } from "svelte";
  import ButtonMenuItem from "./ButtonMenuItem.svelte";
  import type { ButtonMenuContext } from "./button-menu-types";

  const buttonMenuContext = getContext<ButtonMenuContext>("buttonMenuContext");
  const dispatch = createEventDispatcher<{
    click: {
      event: MouseEvent & { currentTarget: HTMLButtonElement };
    };
  }>();

  function handleClick(
    event: MouseEvent & { currentTarget: HTMLButtonElement }
  ) {
    buttonMenuContext.close();
    dispatch("click", { event });
  }
</script>

<ButtonMenuItem cssClass="button-menu-command-li">
  <button class="button-menu-command" on:click={handleClick}>
    <slot />
  </button>
</ButtonMenuItem>
