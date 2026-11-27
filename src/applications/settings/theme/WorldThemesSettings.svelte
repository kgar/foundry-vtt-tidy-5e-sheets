<script lang="ts">
  import type { WorldThemesSettingsEditor } from 'src/settings/editors/world-themes-settings-editor.svelte';
  import WorldThemeSettingsThemeList from './parts/WorldThemesList.svelte';
  import WorldThemeSettingForm from './parts/WorldThemeSettingForm.svelte';
  import WorldThemeOptions from './parts/WorldThemeOptions.svelte';

  type Props = {
    app: WorldThemesSettingsEditor;
  };

  let { app }: Props = $props();

  let selectedTheme = $derived(app.selectedTheme);
</script>

{#key app.updateSignal}
  <div class="dialog-content-container flexcol world-theme-settings">
    {#if selectedTheme}
      <WorldThemeSettingForm {app} />
    {:else}
      <WorldThemeSettingsThemeList {app} />
      <WorldThemeOptions {app} />
    {/if}
  </div>
{/key}
