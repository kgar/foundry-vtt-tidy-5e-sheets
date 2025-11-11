<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { CharacterSheetContext, NpcSheetContext } from 'src/types/types';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { CONSTANTS } from 'src/constants';
  import { settings } from 'src/settings/settings.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';

  let context =
    $derived(getSheetContext<CharacterSheetContext | NpcSheetContext>());

  interface Props {
    hasHpOverlay: boolean;
  }

  let { hasHpOverlay }: Props = $props();

  let hideDeathSaves = $derived(
    settings.value.hideDeathSavesFromPlayers && !FoundryAdapter.userIsGm(),
  );

  function rollDeathSave(event: MouseEvent) {
    context.actor.rollDeathSave(
      {
        event: event,
        legacy: false,
      },
      {
        options: {
          default: {
            rollMode: settings.value.defaultDeathSaveRoll,
          },
        },
      },
    );
  }

  const localize = FoundryAdapter.localize;
</script>

<div class="death-saves" class:rounded={context.useRoundedPortraitStyle}>
  <div class="death-save-counters" class:show-backdrop={!hasHpOverlay}>
    <i class="fas fa-check" class:hidden={hideDeathSaves}></i>
    <TextInput
      document={context.actor}
      field="system.attributes.death.success"
      class="death-save-result {hideDeathSaves ? 'hidden' : ''}"
      selectOnFocus={true}
      allowDeltaChanges={true}
      placeholder="0"
      value={context.system.attributes.death.success}
      maxlength={1}
      title={localize('DND5E.DeathSaveSuccesses')}
      disabled={!context.editable}
      attributes={{
        ['data-tidy-sheet-part']: CONSTANTS.SHEET_PARTS.DEATH_SAVE_SUCCESSES,
      }}
    />

    <button
      type="button"
      class="death-save rollable"
      onclick={(event) => rollDeathSave(event)}
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.DEATH_SAVE_ROLLER}
      tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
    >
      <i class="fas fa-skull"></i>
    </button>

    <TextInput
      document={context.actor}
      field="system.attributes.death.failure"
      class="death-save-result {hideDeathSaves ? 'hidden' : ''}"
      selectOnFocus={true}
      allowDeltaChanges={true}
      placeholder="0"
      value={context.system.attributes.death.failure}
      maxlength={1}
      disabled={!context.editable}
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.DEATH_SAVE_FAILURES}
      title={localize('DND5E.DeathSaveFailures')}
      attributes={{
        ['data-tidy-sheet-part']: CONSTANTS.SHEET_PARTS.DEATH_SAVE_FAILURES,
      }}
    />
    <i class="fas fa-times" class:hidden={hideDeathSaves}></i>
  </div>
</div>

<style lang="less">
  .death-saves {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 0.3125rem;
    display: flex;
    justify-content: center;
    align-items: center;
    text-shadow: 0 0 0.3125rem 0.0625rem var(--t5e-death-save-text-shadow-color);
    pointer-events: none;

    .death-save-counters {
      pointer-events: auto;
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--t5e-death-save-text-color);

      &.show-backdrop {
        background: var(--t5e-death-save-backdrop-background);
        padding: 0 0.5rem;
        border-radius: 0.3125rem;
      }

      :global(input[type='text'].death-save-result) {
        color: var(--t5e-death-save-text-color);
        font-weight: 700;
        font-size: 1rem;
        height: 1.1875rem;
        padding: 0.3125rem 0.25rem 0.25rem 0.25rem;
        min-width: unset;
        text-align: center;
        width: 1.125rem;
      }

      :global(input:hover) {
        border-color: var(--t5e-death-save-text-color);
      }

      :global(.death-save) {
        position: relative;
        margin: 0 0.25rem;
        color: var(--t5e-death-save-icon-color);
        font-size: 1.875rem;
        transition: color 0.3s ease;
        border: none;
        padding: 0;
      }

      :global(.death-save:hover) {
        background: none;
        color: var(--t5e-death-save-text-color);
      }
    }
  }

  .rounded {
    border-radius: 50%;
  }
</style>
