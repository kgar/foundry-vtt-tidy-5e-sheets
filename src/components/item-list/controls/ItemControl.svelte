<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  export let iconCssClass: string;
  export let title: string | undefined = undefined;
  export let active = true;

  const localize = FoundryAdapter.localize;
</script>

<button
  type="button"
  class="item-list-button"
  class:inactive={!active}
  on:click
  title={title !== undefined ? localize(title) : ''}
  on:keydown={(ev) => FoundryAdapter.forceKeyboardManagerEvent(false, ev)}
  on:keyup={(ev) => FoundryAdapter.forceKeyboardManagerEvent(true, ev)}
>
  <i class={iconCssClass} />
</button>

<style lang="scss">
  .item-list-button {
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: stretch;
  }
</style>
