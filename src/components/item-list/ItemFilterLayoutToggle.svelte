<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settings } from 'src/settings/settings.svelte';
  import type { ItemLayoutMode } from 'src/types/types';

  interface Props {
    mode: ItemLayoutMode;
    element?: HTMLElement['tagName'];
    onToggle?: () => void;
  }

  let { mode, element = 'li', onToggle }: Props = $props();

  const localize = FoundryAdapter.localize;
  let toggleButtonPresentation = $derived(
    mode === 'grid'
      ? {
          title: localize('TIDY5E.ListLayout'),
          iconClass: 'fas fa-th-list fa-fw toggle-list',
        }
      : mode === 'list'
        ? {
            title: localize('TIDY5E.GridLayout'),
            iconClass: 'fas fa-th-large fa-fw toggle-grid',
          }
        : null,
  );
</script>

<svelte:element this={element} class="toggle-layout">
  {#if mode === 'grid' || mode === 'list'}
    <button
      type="button"
      class="icon-button"
      title={toggleButtonPresentation?.title}
      onclick={() => onToggle?.()}
    >
      <i class={toggleButtonPresentation?.iconClass}></i>
    </button>
  {:else}
    <span title={localize('TIDY5E.LayoutNotSupported')}>😞</span>
  {/if}
</svelte:element>

<style lang="less">
  .toggle-layout {
    margin: 0 0.25rem;
    padding: 0 0.125rem;
  }
</style>
