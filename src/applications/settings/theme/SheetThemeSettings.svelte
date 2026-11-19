<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
  import { getSingleFileFromDropEvent } from 'src/utils/file';
  import { ThemeImportService } from 'src/theme/theme-import-service';
  import ImportButton from './parts/ImportButton.svelte';
  import { TidyHooks } from 'src/foundry/TidyHooks';
  import type { ThemeSettingsEditor } from 'src/settings/editors/theme-settings-editor.svelte';
  import { actorHeaderBackgroundSupportedActorTypes } from 'src/theme/theme';
  import { getWorldThemesSettingsEditor } from 'src/settings/editors/world-themes-settings-editor.svelte';
  import ThemeSettings from './parts/ThemeSettings.svelte';
  import { CONSTANTS } from 'src/constants';

  interface Props {
    app: ThemeSettingsEditor;
  }

  let { app }: Props = $props();

  let context = $derived(app.value);

  const localize = FoundryAdapter.localize;

  $effect(() => {
    const liveSettings = ThemeQuadrone.getSheetThemeSettings({
      doc: app.document,
      settingsOverride: app.mapContextToChangedSettings(context) as any,
    });

    TidyHooks.tidy5eSheetsThemeSettingsChanged(app.document, liveSettings);
  });

  let useBasicTheme = $derived(context.useBasicTheme ?? false);

  async function onDrop(
    ev: DragEvent & {
      currentTarget: EventTarget & HTMLElement;
    },
  ) {
    let file = getSingleFileFromDropEvent(ev);

    await processImportFile(file);
  }

  async function processImportFile(file: File | null | undefined) {
    if (file) {
      const imported = await ThemeImportService.import(file);

      if (imported) {
        app.resetToDefault();
        app.value = app.mapFromSettings(imported.settings);
      }
    }
  }

  async function applyPreset() {
    const editor = getWorldThemesSettingsEditor();
    const preset = await editor.promptForThemePreset();

    if (!preset) {
      return;
    }

    app.value = app.mapFromSettings(preset.settings);
  }
</script>

<div class="dialog-content-container flexcol" ondrop={onDrop} role="region">
  <div class="flexrow flexgap-1">
    <h2>
      {localize('TIDY5E.SETTINGS.Theme.Menu.name')}
    </h2>
    <button type="button" class="button flexshrink" onclick={applyPreset}>
      <i class="fa-solid fa-sliders"></i>
      {localize('TIDY5E.SETTINGS.Theme.Action.ApplyPreset')}
    </button>
    <ImportButton onfilechanged={(file) => processImportFile(file)} />
    <button
      type="button"
      class="button flexshrink"
      onclick={() =>
        ThemeImportService.export({
          id: foundry.utils.randomID(),
          sort: 0,
          filterMode: 'basic',
          name: app.document.name,
          settings: {
            ...app.mapContextToChangedSettings(context),
          },
        })}
    >
      <i class="fa-solid fa-file-export"></i>
      {localize('TIDY5E.SETTINGS.Theme.Action.Export')}
    </button>
  </div>

  <ThemeSettings
    bind:settings={context}
    rarities={app.rarities}
    spellPreparationMethodColors={app.spellMethods}
    doc={app.document}
    showActorPortraitShape={!useBasicTheme &&
      app.document.documentName === CONSTANTS.DOCUMENT_NAME_ACTOR}
    showActorHeaderBackground={!useBasicTheme &&
      actorHeaderBackgroundSupportedActorTypes.has(app.document.type)}
    showItemSidebarBackground={app.document.documentName ===
      CONSTANTS.DOCUMENT_NAME_ITEM}
  />
</div>
