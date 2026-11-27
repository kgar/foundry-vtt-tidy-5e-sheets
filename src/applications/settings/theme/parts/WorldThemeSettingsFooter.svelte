<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { WorldThemesSettingsEditor } from 'src/settings/editors/world-themes-settings-editor.svelte';

  type Props = {
    app: WorldThemesSettingsEditor;
  };

  const localize = FoundryAdapter.localize;

  let { app }: Props = $props();

  function cancelClicked() {
    app.undoChanges();
    app.closeTheme();
  }

  async function saveClicked() {
    await app.save();
    app.closeTheme();
  }
</script>

<div class="button-bar">
  <button
    type="button"
    class="button button-secondary button-large undo-changes-btn"
    onclick={cancelClicked}
  >
    <i class="fas fa-xmark"></i>
    {localize('COMMON.Cancel')}
  </button>
  <button
    type="button"
    class={[
      'button button-large button-save save-changes-btn',
      app.hasChanges ? 'button-primary' : 'button-secondary',
    ]}
    onclick={saveClicked}
  >
    <i class="fas fa-save"></i>
    {localize('TIDY5E.COMMON.Action.SaveChanges')}
  </button>
</div>
