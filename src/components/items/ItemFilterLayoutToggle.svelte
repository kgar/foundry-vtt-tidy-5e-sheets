<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
    import type { ItemLayoutMode } from 'src/types/types';
  import { createEventDispatcher } from 'svelte';

  export let mode: ItemLayoutMode;

  const localize = FoundryAdapter.localize;
  const dispatcher = createEventDispatcher<{ toggle: void }>();
</script>

<li class="toggle-layout" title="todo: implement">
  {#if mode === 'grid'}
    <i
      class="fas fa-th-large toggle-grid"
      title={localize('TIDY5E.GridLayout')}
      on:click={() => dispatcher('toggle')}
      role="button"
      tabindex="0"
    />
  {:else if mode === 'list'}
    <i
      class="fas fa-th-list toggle-list"
      title={localize('TIDY5E.ListLayout')}
      on:click={() => dispatcher('toggle')}
      role="button"
      tabindex="0"
    />
  {:else}
    <span title="Grid mode not supported.">😞</span>
  {/if}
</li>

<style lang="scss">
  .toggle-layout {
    margin: 0 4px;
    padding: 0 2px;

    &:hover {
      color: var(--t5e-primary-accent);
    }
  }
</style>
