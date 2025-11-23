<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { CurrentSettings } from 'src/settings/settings.svelte';
  import { getContext, onDestroy } from 'svelte';
  import type {
    ThemeColorSetting,
    Tidy5eThemeDataV1,
  } from 'src/types/theme.types';
  import {
    applyCurrentThemeClassic,
    applyThemeColorsToHead,
  } from 'src/theme/theme';
  import { error } from 'src/utils/logging';
  import ThemeSettingSheetMenu from './ThemeSettingSheetMenu.svelte';
  import ThemeSettingColorArticle from './ThemeSettingColorArticle.svelte';
  import {
    extractSettingsUpdateDeltaFromTheme,
    validateImportFile,
  } from 'src/theme/theme';
  import { getSingleFileFromDropEvent, readFileAsText } from 'src/utils/file';
  import { CONSTANTS } from 'src/constants';
  import type { ThemeSettingsSheetFunctions } from './ThemeSettingsFormApplication.svelte';

  interface Props {
    themeableColors: ThemeColorSetting[];
    settings: CurrentSettings;
  }

  let { themeableColors, settings }: Props = $props();

  $effect(() => {
    refreshLiveTheming();
  });

  let appId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.APP_ID);

  let functions = getContext<ThemeSettingsSheetFunctions>(
    CONSTANTS.SVELTE_CONTEXT.FUNCTIONS,
  );

  const localize = FoundryAdapter.localize;

  let variables = $derived(
    themeableColors.reduce<Record<string, string>>((acc, curr) => {
      acc[curr.cssVariable] = settings[curr.key] as string;
      return acc;
    }, {}),
  );

  function refreshLiveTheming() {
    if (settings.colorPickerEnabled) {
      applyThemeColorsToHead(variables);
    } else {
      applyCurrentThemeClassic(false);
    }
  }

  async function processImportFile(file: File) {
    try {
      let result = await readFileAsText(file);

      const theme = JSON.parse(result) as Tidy5eThemeDataV1;

      const isValid = validateImportFile(theme);

      if (!isValid) {
        throw new Error(`Theme file ${file.name} is in an invalid format.`);
      }

      const updateDelta = extractSettingsUpdateDeltaFromTheme(
        theme,
        themeableColors,
      );

      Object.assign(settings, updateDelta);

      ui.notifications.info(
        localize('TIDY5E.ThemeSettings.Sheet.importSuccess'),
      );
    } catch (e) {
      ui.notifications.error(
        localize('TIDY5E.ThemeSettings.Sheet.importError'),
      );
      error(
        'An error occurred while attempting to import a theme file. See the devtools console for more details.',
        true,
        e,
      );
    }
  }

  function onDrop(
    ev: DragEvent & {
      currentTarget: EventTarget & HTMLElement;
    },
  ) {
    let file = getSingleFileFromDropEvent(ev);

    if (file) {
      processImportFile(file);
    }
  }

  function clearAllColors() {
    for (let color of themeableColors) {
      // @ts-expect-error
      settings[color.key] = '';
    }
  }

  onDestroy(() => {
    applyCurrentThemeClassic();
  });
</script>

<section class="theme-settings-wrapper" ondrop={onDrop} aria-label="dropzone">
  <div class="theme-settings-form scroll-container">
    <h2 class="header flex-row justify-content-space-between">
      {localize('TIDY5E.ThemeSettings.Sheet.header')}
      <ThemeSettingSheetMenu {settings} onSelectFile={processImportFile} />
    </h2>

    <div>
      <label
        for="colorPickerEnabled-{appId}"
        class="flex-row align-items-center extra-small-gap"
      >
        <input
          type="checkbox"
          id="colorPickerEnabled-{appId}"
          bind:checked={settings.colorPickerEnabled}
        />
        {localize('TIDY5E.Settings.ColorPickerEnabled.name')}
      </label>
    </div>

    <p class="explanation">
      {localize('TIDY5E.ThemeSettings.Sheet.explanation')}
    </p>

    <p class="explanation drop-hint">
      {localize('TIDY5E.ThemeSettings.Sheet.importDropHint')}
    </p>

    <div class="flex-row">
      <button type="button" class="flex-1" onclick={() => clearAllColors()}>
        {FoundryAdapter.localize('TIDY5E.ItemFilters.ClearAll')}
      </button>
    </div>

    <div class="color-pickers">
      {#each themeableColors as colorToConfigure}
        <ThemeSettingColorArticle
          {settings}
          {colorToConfigure}
          colorSelected={() => refreshLiveTheming()}
        />
      {/each}
    </div>
  </div>
  <div class="button-bar">
    <button
      type="button"
      class="save-changes-btn"
      onclick={() => functions.save(settings)}
    >
      <i class="fas fa-save"></i>
      {localize('TIDY5E.SaveChanges')}
    </button>
  </div>
</section>

<style lang="less">
  .theme-settings-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    height: 100%;
    margin-right: -0.25rem;

    .header {
      margin: 0;
    }

    .explanation {
      margin: 0 0.5rem;
    }

    .drop-hint {
      font-size: 0.75rem;
      color: var(--t5e-secondary-color);
    }

    .theme-settings-form {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding-right: 0.5rem;
    }

    .button-bar {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-right: 0.75rem;

      button {
        margin: 0;
        flex: 1;
        min-height: 2rem;
      }
    }
  }
</style>
