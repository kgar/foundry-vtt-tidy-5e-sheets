<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { CurrentSettings } from 'src/settings/settings';
  import { getContext, onDestroy } from 'svelte';
  import type { Writable } from 'svelte/store';
  import type { ThemeSettingsSheetFunctions } from './Tidy5eKgarThemeSettingsSheet';
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

  export let themeableColors: ThemeColorSetting[];
  $: {
    if ($store.colorPickerEnabled) {
      themeableColors.forEach((color) =>
        trySetRootCssVariable(
          color.cssVariable,
          $store[color.key]?.toString(),
          $store.colorPickerEnabled
        )
      );
    } else {
      clearTidy5eRootCssVariables();
      applyCurrentTheme(false);
    }
  }

  let store = getContext<Writable<CurrentSettings>>('store');
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
        themeableColors
      );

      store.update((settings) => ({
        ...settings,
        ...storeUpdateData,
      }));

      ui.notifications.info(localize('T5EK.ThemeSettings.Sheet.importSuccess'));
    } catch (e) {
      ui.notifications.error(localize('T5EK.ThemeSettings.Sheet.importError'));
      error(
        'An error occurred while attempting to import a theme file. See the devtools console for more details.',
        true,
        e
      );
    }
  }

  function onDrop(
    ev: DragEvent & {
      currentTarget: EventTarget & HTMLElement;
    }
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
  <div class="theme-settings-form">
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
          data-dtype="boolean"
          id="colorPickerEnabled-{appId}"
          bind:checked={$store.colorPickerEnabled}
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
    <button
      type="submit"
      class="save-changes-btn"
      on:click={() => functions.save($store)}
    >
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
    padding: 0.5rem 0 0.5rem 0.5rem;

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
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding-right: 0.5rem;
    }

    .button-bar {
      padding-right: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      button {
        margin: 0;
      }
    }
  }
</style>
