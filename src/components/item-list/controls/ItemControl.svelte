<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settingStore } from 'src/settings/settings';

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
  tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
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
