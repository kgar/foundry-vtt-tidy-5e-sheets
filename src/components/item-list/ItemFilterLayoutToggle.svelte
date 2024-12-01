<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settingStore } from 'src/settings/settings';
  import type { ItemLayoutMode } from 'src/types/types';
  import { createEventDispatcher } from 'svelte';

  interface Props {
    mode: ItemLayoutMode;
    element?: HTMLElement['tagName'];
  }

  let { mode, element = 'li' }: Props = $props();

  const localize = FoundryAdapter.localize;
  const dispatcher = createEventDispatcher<{ toggle: void }>();
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
      onclick={() => dispatcher('toggle')}
      tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
    >
      <i class={toggleButtonPresentation?.iconClass}></i>
    </button>
  {:else}
    <span title={localize('TIDY5E.LayoutNotSupported')}>😞</span>
  {/if}
</svelte:element>

<style lang="scss">
  .toggle-layout {
    margin: 0 0.25rem;
    padding: 0 0.125rem;
  }
</style>
