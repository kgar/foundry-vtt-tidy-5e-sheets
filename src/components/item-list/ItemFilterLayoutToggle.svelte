<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemLayoutMode } from 'src/types/types';
  import { createEventDispatcher } from 'svelte';

  export let mode: ItemLayoutMode;
  export let element: HTMLElement['tagName'] = 'li';

  $: toggleButtonPresentation =
    mode === 'grid'
      ? {
          title: localize('T5EK.ListLayout'),
          iconClass: 'fas fa-th-list toggle-list',
        }
      : mode === 'list'
        ? {
            title: localize('T5EK.GridLayout'),
            iconClass: 'fas fa-th-large toggle-grid',
          }
        : null;

  const localize = FoundryAdapter.localize;
  const dispatcher = createEventDispatcher<{ toggle: void }>();
</script>

<svelte:element this={element} class="toggle-layout">
  {#if mode === 'grid' || mode === 'list'}
    <button
      type="button"
      class="icon-button"
      title={toggleButtonPresentation?.title}
      on:click={() => dispatcher('toggle')}
    >
      <i class={toggleButtonPresentation?.iconClass} />
    </button>
  {:else}
    <span title={localize('T5EK.LayoutNotSupported')}>😞</span>
  {/if}
</svelte:element>

<style lang="scss">
  .toggle-layout {
    margin: 0 0.25rem;
    padding: 0 0.125rem;
  }
</style>
