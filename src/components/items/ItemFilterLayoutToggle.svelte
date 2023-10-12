<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemLayoutMode } from 'src/types/types';
  import { createEventDispatcher } from 'svelte';

  export let mode: ItemLayoutMode;
  export let element: HTMLElement['tagName'] = 'li';

  const localize = FoundryAdapter.localize;
  const dispatcher = createEventDispatcher<{ toggle: void }>();
</script>

<svelte:element this={element} class="toggle-layout">
  {#if mode === 'grid'}
    <button
      class="inline-icon-button"
      title={localize('T5EK.ListLayout')}
      on:click={() => dispatcher('toggle')}
    >
      <i class="fas fa-th-list toggle-list" />
    </button>
  {:else if mode === 'list'}
    <button
      type="button"
      class="inline-icon-button"
      title={localize('T5EK.GridLayout')}
      on:click={() => dispatcher('toggle')}
    >
      <i class="fas fa-th-large toggle-grid" />
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
