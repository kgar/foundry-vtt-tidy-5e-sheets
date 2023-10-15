<script lang="ts">
  import Notice from 'src/components/shared/Notice.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { CharacterSheetContext, NpcSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let editable: boolean;
  export let cssClass: string | null = null;

  let context =
    getContext<Readable<CharacterSheetContext | NpcSheetContext>>('context');

  const localize = FoundryAdapter.localize;
</script>

<div class="no-spells-container {cssClass}">
  <Notice>{localize('DND5E.NoSpellLevels')}</Notice>
  {#if $context.owner && editable}
    <button
      type="button"
      class="create-spell-btn flex-row align-items-center extra-small-gap"
      on:click={() =>
        FoundryAdapter.createItem({ type: 'spell', level: '' }, $context.actor)}
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
      color: var(--t5ek-secondary-color);
      background-color: var(--t5ek-faintest-color);

      &:hover {
        background-color: var(--t5ek-light-color);
      }
    }
  }
</style>
