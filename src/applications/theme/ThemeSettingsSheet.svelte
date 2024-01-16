<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { CurrentSettings } from 'src/settings/settings';
  import { getContext, onDestroy } from 'svelte';
  import type { Writable } from 'svelte/store';
  import type { ThemeColorSetting, Tidy5eThemeDataV1 } from 'src/types/theme';
  import { applyCurrentTheme } from 'src/theme/theme';
  import { error } from 'src/utils/logging';
  import ThemeSettingSheetMenu from './ThemeSettingSheetMenu.svelte';
  import ThemeSettingColorArticle from './ThemeSettingColorArticle.svelte';
  import {
    clearTidy5eRootCssVariables,
    extractSettingsUpdateDeltaFromTheme,
    trySetRootCssVariable,
    validateImportFile,
  } from 'src/theme/theme';
  import { getSingleFileFromDropEvent, readFileAsText } from 'src/utils/file';
  import type { ThemeSettingsSheetFunctions } from './ThemeSettingsFormApplication';

  export let themeableColors: ThemeColorSetting[];
  $: {
    if ($context.colorPickerEnabled) {
      themeableColors.forEach((color) =>
        trySetRootCssVariable(
          color.cssVariable,
          $context[color.key]?.toString(),
          $context.colorPickerEnabled,
        ),
      );
    } else {
      clearTidy5eRootCssVariables();
      applyCurrentTheme(false);
    }
  }

  let context = getContext<Writable<CurrentSettings>>('context');
  let appId = getContext<string>('appId');
  let functions = getContext<ThemeSettingsSheetFunctions>('functions');
  const localize = FoundryAdapter.localize;

  async function processImportFile(file: File) {
    try {
      const result = await readFileAsText(file);

      const theme = JSON.parse(result) as Tidy5eThemeDataV1;

      const isValid = validateImportFile(theme);

      if (!isValid) {
        throw new Error(`Theme file ${file.name} is in an invalid format.`);
      }

      const storeUpdateData = extractSettingsUpdateDeltaFromTheme(
        theme,
        themeableColors,
      );

      context.update((settings) => ({
        ...settings,
        ...storeUpdateData,
      }));

      ui.notifications.info(localize('T5EK.ThemeSettings.Sheet.importSuccess'));
    } catch (e) {
      ui.notifications.error(localize('T5EK.ThemeSettings.Sheet.importError'));
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

  onDestroy(() => {
    clearTidy5eRootCssVariables();
  });
</script>

<section class="theme-settings-wrapper" on:drop={onDrop} aria-label="dropzone">
  <div class="theme-settings-form scroll-container">
    <h2 class="header flex-row justify-content-space-between">
      {localize('T5EK.ThemeSettings.Sheet.header')}
      <ThemeSettingSheetMenu
        on:selectFile={(ev) => processImportFile(ev.detail)}
      />
    </h2>

    <div>
      <label
        for="colorPickerEnabled-{appId}"
        class="flex-row align-items-center extra-small-gap"
      >
        <input
          type="checkbox"
          id="colorPickerEnabled-{appId}"
          bind:checked={$context.colorPickerEnabled}
        />
        {localize('T5EK.Settings.ColorPickerEnabled.name')}
      </label>
    </div>

    <p class="explanation">
      {localize('T5EK.ThemeSettings.Sheet.explanation')}
    </p>

    <p class="explanation drop-hint">
      {localize('T5EK.ThemeSettings.Sheet.importDropHint')}
    </p>

    <div class="color-pickers">
      {#each themeableColors as colorToConfigure}
        <ThemeSettingColorArticle {colorToConfigure} />
      {/each}
    </div>
  </div>
  <div class="button-bar">
    <button type="submit" class="save-changes-btn">
      <i class="fas fa-save" />
      {localize('T5EK.SaveChanges')}
    </button>
  </div>
</section>

<style lang="scss">
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
      color: var(--t5ek-secondary-color);
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
      }
    }
  }
</style>
