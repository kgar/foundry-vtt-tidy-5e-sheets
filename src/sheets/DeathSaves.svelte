<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { createEventDispatcher, getContext } from 'svelte';
  import type { CharacterSheetContext, NpcSheetContext } from 'src/types/types';
  import type { Readable } from 'svelte/store';
  import TextInput from 'src/components/form/TextInput.svelte';

  let store =
    getContext<Readable<CharacterSheetContext | NpcSheetContext>>('store');

  export let successes: number;
  export let failures: number;
  export let successesField: string;
  export let failuresField: string;
  export let hpOverlayDisabled: boolean;

  const localize = FoundryAdapter.localize;

  const dispatcher = createEventDispatcher<{
    rollDeathSave: { mouseEvent: MouseEvent };
  }>();
</script>

<!-- Death Saves -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="death-saves" class:rounded={$store.useRoundedPortraitStyle}>
  <div class="death-save-counters" class:show-backdrop={hpOverlayDisabled}>
    <i class="fas fa-check" />
    <TextInput
      document={$store.actor}
      field={successesField}
      cssClass="death-save-result"
      dtype="Number"
      selectOnFocus={true}
      allowDeltaChanges={true}
      placeholder="0"
      value={successes}
      maxlength={1}
      title={localize('DND5E.DeathSave')}
      disabled={!$store.owner}
      />
    <div
      class="death-save rollable"
      on:click={(event) => dispatcher('rollDeathSave', { mouseEvent: event })}
    >
      <i class="fas fa-skull" />
    </div>
    <TextInput
      document={$store.actor}
      field={failuresField}
      cssClass="death-save-result"
      dtype="Number"
      selectOnFocus={true}
      allowDeltaChanges={true}
      placeholder="0"
      value={failures}
      maxlength={1}
      disabled={!$store.owner}
      />
    <i class="fas fa-times" />
  </div>
</div>

<style lang="scss">
  .death-saves {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 0.3125rem;
    z-index: 20;
    display: flex;
    justify-content: center;
    align-items: center;
    text-shadow: 0 0 0.3125rem 0.0625rem
      var(--t5ek-death-save-text-shadow-color);
    pointer-events: none;

    .death-save-counters {
      pointer-events: auto;
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--t5ek-death-save-text-color);

      &.show-backdrop {
        background: var(--t5ek-death-save-backdrop-background);
        padding: 0 0.5rem;
        border-radius: 0.3125rem;
      }

      :global(input[type='text'].death-save-result) {
        color: var(--t5ek-death-save-text-color);
        font-weight: 700;
        font-size: 1rem;
        height: 1.1875rem;
        padding: 0.3125rem 0.25rem 0.25rem 0.25rem;
        min-width: unset;
        text-align: center;
        width: 1.125rem;
      }

      :global(input:hover) {
        border-color: var(--t5ek-death-save-text-color);
      }

      :global(.death-save) {
        position: relative;
        margin: 0 0.25rem;
        color: var(--t5ek-death-save-icon-color);
        font-size: 1.875rem;
        transition: color 0.3s ease;
      }

      :global(.death-save:hover) {
        color: var(--t5ek-death-save-text-color);
      }
    }
  }

  .rounded {
    border-radius: 50%;
  }
</style>
