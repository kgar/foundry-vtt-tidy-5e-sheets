<script lang="ts">
  import { settings } from 'src/settings/settings.svelte';
  import type { Item5e } from 'src/types/item.types';
  import ActiveEffectsMarker from './ActiveEffectsMarker.svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    cssClass?: string;
    hasChildren?: boolean;
    item: Item5e;
    useActiveEffectsMarker?: boolean;
    onToggle?: (event: Event) => void;
    children?: Snippet;
  }

  let {
    cssClass = '',
    hasChildren = true,
    item,
    useActiveEffectsMarker = true,
    onToggle,
    children,
  }: Props = $props();

  let hasActiveEffects = $derived(!!item.effects?.size);
</script>

<a
  onclick={(ev) => onToggle?.(ev)}
  class="item-name truncate {cssClass}"
  class:has-children={hasChildren}
  class:italic={item.system.identified === false}
>
  {@render children?.()}
</a>
{#if useActiveEffectsMarker && settings.value.showActiveEffectsMarker && hasActiveEffects}
  <ActiveEffectsMarker />
{/if}

<style lang="less">
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
