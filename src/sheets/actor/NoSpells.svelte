<script lang="ts">
  import Notice from 'src/components/shared/Notice.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ActorSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let allowEdit: boolean;
  export let cssClass: string | null = null;

  let store = getContext<Readable<ActorSheetContext>>('store');

  const localize = FoundryAdapter.localize;
</script>

<div class="no-spells-container {cssClass}">
  <Notice>{localize('DND5E.NoSpellLevels')}</Notice>
  {#if allowEdit}
    <button
      class="create-spell-btn flex-row align-items-center no-gap"
      on:click={() =>
        FoundryAdapter.createItem({ type: 'spell', level: '' }, $store.actor)}
    >
      <i class="fas fa-plus-circle" />
      {localize('DND5E.SpellCreate')}
    </button>
  {/if}
</div>

<style lang="scss">
  .no-spells-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .create-spell-btn {
      text-align: center;
      min-width: 7.5rem;
      align-self: center;
      font-size: 0.75rem;
      border-radius: 0.3125rem;
      line-height: 1.5;
      width: auto;
      padding: 0.125rem 1.5rem;
      border: none;
      color: var(--t5e-secondary-color);
      background-color: var(--t5e-faintest-color);

      &:hover {
        background-color: var(--t5e-light-color);
      }
    }
  }
</style>
