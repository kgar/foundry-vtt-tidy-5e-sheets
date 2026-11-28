<script lang="ts">
  import type { WorldThemesSettingsEditor } from 'src/settings/editors/world-themes-settings-editor.svelte';
  import WorldThemeSettingsThemeList from './parts/WorldThemesList.svelte';
  import WorldThemeSettingForm from './parts/WorldThemeSettingForm.svelte';
  import WorldThemeOptions from './parts/WorldThemeOptions.svelte';
  import { getFilesFromDropEvent } from 'src/utils/file';
  import { CONSTANTS } from 'src/constants';

  type Props = {
    app: WorldThemesSettingsEditor;
  };

  let { app }: Props = $props();

  let selectedTheme = $derived(app.selectedTheme);

  async function onDrop(
    event: DragEvent & {
      currentTarget: EventTarget & HTMLElement;
    },
  ) {
    let files = getFilesFromDropEvent(event);

    let themeFiles = files.filter(
      (file) =>
        file.name.trim().endsWith(CONSTANTS.THEME_EXTENSION_WITH_DOT) ||
        file.name.trim().endsWith(CONSTANTS.THEME_BUNDLE_EXTENSION_WITH_DOT),
    );

    // Apply a single theme file drop
    // when a theme is selected for viewing.
    if (
      themeFiles.length === 1 &&
      themeFiles[0].name.trim().endsWith(CONSTANTS.THEME_EXTENSION_WITH_DOT)
    ) {
      app.processImportFile(themeFiles[0], app.selectedTheme);

      return;
    }

    // Process multiple theme files and/or bundle(s)
    // via a bulk import.
    if (themeFiles.length >= 1) {
      await app.processImportFiles(themeFiles);
      return;
    }
  }
</script>

{#key app.updateSignal}
  <div
    class="dialog-content-container flexcol world-theme-settings"
    ondrop={onDrop}
  >
    {#if selectedTheme}
      <WorldThemeSettingForm {app} />
    {:else}
      <WorldThemeSettingsThemeList {app} />
      <WorldThemeOptions {app} />
    {/if}
  </div>
{/key}
