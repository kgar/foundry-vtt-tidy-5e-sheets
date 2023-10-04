<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settingStore } from 'src/settings/settings';
  import type { Item5e } from 'src/types/item';
  import { createEventDispatcher } from 'svelte';
  import ActiveEffectsMarker from './ActiveEffectsMarker.svelte';

  export let cssClass: string = '';
  export let hasChildren = true;
  export let item: Item5e;

  $: hasActiveEffects = !!item.effects?.size;

  const dispatcher = createEventDispatcher<{ click: MouseEvent }>();
</script>

<span
  role="button"
  tabindex="0"
  on:click={(event) => dispatcher('click', event)}
  class="item-name truncate {cssClass}"
  class:has-children={hasChildren}
>
  <slot />
</span>
{#if $settingStore.activeEffectsMarker && hasActiveEffects}
  <ActiveEffectsMarker />
{/if}

<style lang="scss">
  .item-name {
    flex: 1 1 0.0625rem;
    min-width: 0;

    &:not(.has-children) {
      align-self: center;
    }

    &.has-children {
      display: flex;
      align-items: center;
    }
  }
</style>
