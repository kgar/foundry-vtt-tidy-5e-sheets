<script lang="ts">
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  export let iconCssClass: string | undefined = undefined;
  export let iconSrc: string | undefined = undefined;
  export let title: string | undefined = undefined;
  export let active = true;
  export let onclick:
    | ((
        ev: MouseEvent & {
          currentTarget: EventTarget & HTMLElement;
        },
      ) => any)
    | undefined = undefined;

  const localize = FoundryAdapter.localize;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-missing-attribute -->
<a
  class="item-list-button"
  class:inactive={!active}
  on:click={onclick}
  title={title !== undefined ? localize(title) : ''}
>
  {#if iconCssClass}
    <i class={iconCssClass} />
  {/if}
  {#if iconSrc}
    <Dnd5eIcon src={iconSrc} />
  {/if}
</a>

<style lang="scss">
  .item-list-button {
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: stretch;
  }
</style>
