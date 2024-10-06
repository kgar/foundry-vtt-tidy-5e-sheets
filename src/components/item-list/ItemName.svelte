<script lang="ts">
  import type { Item5e } from 'src/types/item.types';
  import { createEventDispatcher, getContext } from 'svelte';
  import ActiveEffectsMarker from './ActiveEffectsMarker.svelte';
  import type { Readable } from 'svelte/store';
  import type { CurrentSettings } from 'src/settings/settings';
  import { CONSTANTS } from 'src/constants';

  export let cssClass: string = '';
  export let hasChildren = true;
  export let item: Item5e;
  export let useActiveEffectsMarker: boolean = true;

  let context = getContext<Readable<{ settings: CurrentSettings }>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: hasActiveEffects = !!item.effects?.size;

  const dispatcher = createEventDispatcher<{ toggle: Event }>();
</script>

<!-- svelte-ignore a11y-interactive-supports-focus -->
<span
  role="button"
  on:click={(ev) => dispatcher('toggle', ev)}
  class="item-name truncate {cssClass}"
  class:has-children={hasChildren}
  on:keypress={(ev) => ev.key === 'Enter' && dispatcher('toggle', ev)}
  class:italic={item.system.identified === false}
>
  <slot />
</span>
{#if useActiveEffectsMarker && $context.settings.showActiveEffectsMarker && hasActiveEffects}
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
