<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemLayoutMode } from 'src/types/types';
  import { createEventDispatcher } from 'svelte';

  export let mode: ItemLayoutMode;
  export let element: HTMLElement['tagName'] = 'li';

  $: toggleButtonPresentation =
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
        : null;

  const localize = FoundryAdapter.localize;
  const dispatcher = createEventDispatcher<{ toggle: void }>();
</script>

<svelte:element this={element} class="toggle-layout">
  {#if mode === 'grid' || mode === 'list'}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-missing-attribute -->
    <a
      class="icon-button"
      title={toggleButtonPresentation?.title}
      on:click={() => dispatcher('toggle')}
    >
      <i class={toggleButtonPresentation?.iconClass} />
    </a>
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
