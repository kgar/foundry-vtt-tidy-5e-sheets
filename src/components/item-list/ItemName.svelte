<script lang="ts">
  import { settingStore } from 'src/settings/settings';
  import type { Item5e } from 'src/types/item.types';
  import { createEventDispatcher } from 'svelte';
  import ActiveEffectsMarker from './ActiveEffectsMarker.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    cssClass?: string;
    hasChildren?: boolean;
    item: Item5e;
    useActiveEffectsMarker?: boolean;
    children?: import('svelte').Snippet;
  }

  let {
    cssClass = '',
    hasChildren = true,
    item,
    useActiveEffectsMarker = true,
    children,
  }: Props = $props();

  let hasActiveEffects = $derived(!!item.effects?.size);

  const dispatcher = createEventDispatcher<{ toggle: Event }>();
</script>

<!-- TODO: Make this a button -->
<span
  role="button"
  tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
  onclick={(ev) => dispatcher('toggle', ev)}
  class="item-name truncate {cssClass}"
  class:has-children={hasChildren}
  onkeypress={(ev) => ev.key === 'Enter' && dispatcher('toggle', ev)}
  class:italic={item.system.identified === false}
>
  {@render children?.()}
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
      outline: 0.0625rem solid var(--t5e-primary-accent-color);
    }
  }
</style>
