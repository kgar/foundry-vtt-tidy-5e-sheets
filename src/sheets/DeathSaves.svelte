<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { SettingsProvider } from 'src/settings/settings';
  import { createEventDispatcher, getContext } from 'svelte';
  import type { ActorSheetContext } from 'src/types/types';
  import type { Readable } from 'svelte/store';
  import TextInput from 'src/components/form/TextInput.svelte';

  let store = getContext<Readable<ActorSheetContext>>('store');

  export let successes: number;
  export let failures: number;
  export let useRoundedPortraitStyle: boolean;
  export let successesField: string;
  export let failuresField: string;

  const localize = FoundryAdapter.localize;
  const hpOverlayDisabled = SettingsProvider.settings.hpOverlayDisabled.get();

  const dispatcher = createEventDispatcher<{
    rollDeathSave: { mouseEvent: MouseEvent };
  }>();
</script>

<!-- Death Saves -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="death-saves" class:rounded={useRoundedPortraitStyle}>
  <div class="counter-value" class:show-backdrop={hpOverlayDisabled}>
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
    border-radius: 5px;
    z-index: 20;
    display: flex;
    justify-content: center;
    align-items: center;
    text-shadow: 0 0 5px 1px #222;
  }

  .rounded {
    border-radius: 50%;
  }

  .counter-value {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;

    &.show-backdrop {
      background: rgba(255, 0, 0, 0.5);
      padding: 0 0.5rem;
      border-radius: 5px;
    }

    :global(input[type='text'].death-save-result) {
      color: var(--t5e-white);
      font-weight: 700;
      font-size: 16px;
      height: 19px;
      padding: 5px 4px 4px 4px;
      min-width: unset;
      text-align: center;
      width: 18px;
    }

    :global(input:hover) {
      border-color: var(--t5e-white);
    }

    :global(.death-save) {
      position: relative;
      margin: 0 0.25rem;
      color: var(--t5e-death-save-color);
      font-size: 30px;
      transition: color 0.3s ease;
    }

    :global(.death-save:hover) {
      color: var(--t5e-white);
    }
  }
</style>
