<script lang="ts">
  import { settingStore } from 'src/settings/settings';
  import type { Item5e } from 'src/types/item';
  import { createEventDispatcher } from 'svelte';
  import ActiveEffectsMarker from './ActiveEffectsMarker.svelte';

  export let cssClass: string = '';
  export let hasChildren = true;
  export let item: Item5e;
  export let useActiveEffectsMarker: boolean = true;

  $: hasActiveEffects = !!item.effects?.size;

  const dispatcher = createEventDispatcher<{ toggle: Event }>();
</script>

<!-- TODO: Make this a button -->
<span
  role="button"
  tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
  on:click={(ev) => dispatcher('toggle', ev)}
  class="item-name truncate {cssClass}"
  class:has-children={hasChildren}
  on:keypress={(ev) => ev.key === 'Enter' && dispatcher('toggle', ev)}
>
  <slot />
</span>
{#if useActiveEffectsMarker && $settingStore.showActiveEffectsMarker && hasActiveEffects}
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

    &:focus-visible {
      outline: 0.0625rem solid var(--t5ek-primary-accent-color);
    }
  }
</style>
