<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { SettingsEditorController } from 'src/settings/editors/settings-editors.svelte';

  interface Props {
    /**
     * The settings editor controller that will conduct Undo Changes and Use Default.
     */
    host: SettingsEditorController;
    /**
     * The user has indicated they wish to save. No action has been taken by the
     * settings footer. The caller must save the changes.
     */
    save?: () => Promise<void> | void;
    /**
     * The user has successfully conducted an undo operation, and the caller
     * can react to this.
     */
    onUndo?: () => void;
    /**
     * The user has successfully conducted a reset to default operation, and
     * the caller can react to this.
     */
    onResetDefault?: () => Promise<void> | void;
  }

  let { host, save, onResetDefault, onUndo }: Props = $props();

  const localize = FoundryAdapter.localize;

  function undoClicked() {
    if (host.canUndo) {
      host.undoChanges();
      onUndo?.();
    }
  }

  async function useDefaultClicked() {
    if (host.canUseDefault) {
      await host.useDefault();
      onResetDefault?.();
    }
  }
</script>

<div class="button-bar">
  <button
    type="button"
    class="button button-secondary button-large use-default-btn"
    onclick={useDefaultClicked}
  >
    <i class="fas fa-rotate-left"></i>
    {localize(host.useDefaultLabel ?? 'TIDY5E.UseGlobalDefaults')}
  </button>
  <button
    type="button"
    class="button button-secondary button-large undo-changes-btn"
    onclick={undoClicked}
  >
    <i class="fas fa-arrow-rotate-left"></i>
    {localize('TIDY5E.UndoChanges')}
  </button>
  <button
    type="button"
    class={[
      'button button-large button-save save-changes-btn',
      host.hasChanges ? 'button-primary' : 'button-secondary',
    ]}
    onclick={save}
  >
    <i class="fas fa-save"></i>
    {localize('TIDY5E.SaveChanges')}
  </button>
</div>
