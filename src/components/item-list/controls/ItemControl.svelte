<script lang="ts">
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settingStore } from 'src/settings/settings';
  
  export let iconCssClass: string | undefined = undefined;
  export let iconSrc: string | undefined = undefined;
  export let title: string | undefined = undefined;
  export let active = true;
  export let onclick:
    | ((
        ev: MouseEvent & {
          currentTarget: EventTarget & HTMLButtonElement;
        },
      ) => any)
    | undefined = undefined;

  const localize = FoundryAdapter.localize;
</script>

<button
  type="button"
  class="item-list-button"
  class:inactive={!active}
  on:click={onclick}
  title={title !== undefined ? localize(title) : ''}
  tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
>
  {#if iconCssClass}
    <i class={iconCssClass} />
  {/if}
  {#if iconSrc}
    <Dnd5eIcon src={iconSrc} />
  {/if}
</button>

<style lang="scss">
  .item-list-button {
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: stretch;
  }
</style>
