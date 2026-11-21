<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { WorldThemesSettingsEditor } from 'src/settings/editors/world-themes-settings-editor.svelte';

  type Props = {
    app: WorldThemesSettingsEditor;
  };

  let { app }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

<h2 class="world-theme-list-header">
  {localize('TIDY5E.COMMON.Theme.Options')}
</h2>
<div class="form-group">
  <label for="apply-theme-to-embedded-documents">
    {localize('TIDY5E.SETTINGS.Theme.ApplyThemeToEmbeddedDocuments.Title')}
  </label>
  <div class="form-fields">
    <input
      id="apply-theme-to-embedded-documents"
      type="checkbox"
      bind:checked={app.value.options.applyThemeToEmbeddedDocuments}
    />
  </div>
  <p class="hint">
    {localize('TIDY5E.SETTINGS.Theme.ApplyThemeToEmbeddedDocuments.Hint')}
  </p>
</div>
