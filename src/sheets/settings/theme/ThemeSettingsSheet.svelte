<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { CurrentSettings } from 'src/settings/settings';
  import { themeVariables } from 'src/theme/theme-reference';
  import { getContext, onDestroy } from 'svelte';
  import type { Writable } from 'svelte/store';
  import type { ThemeSettingsSheetFunctions } from './Tidy5eKgarThemeSettingsSheet';
  import type { ThemeColorSetting, Tidy5eThemeDataV1 } from 'src/types/theme';
  import ColorPicker from 'svelte-awesome-color-picker';
  import { Colord } from 'colord';
  import { applyCurrentTheme } from 'src/theme/theme';
  import { CONSTANTS } from 'src/constants';
  import { error } from 'src/utils/logging';

  let store = getContext<Writable<CurrentSettings>>('store');
  let appId = getContext<string>('appId');
  let functions = getContext<ThemeSettingsSheetFunctions>('functions');

  export let themeableColors: ThemeColorSetting[];

  const eyeDropperEnabled = 'EyeDropper' in window;

  $: {
    if ($store.colorPickerEnabled) {
      themeableColors.forEach((color) =>
        trySetCssVariable(color.cssVariable, $store[color.key]?.toString())
      );
    } else {
      clearCssVariables();
      applyCurrentTheme(false);
    }
  }

  function trySetCssVariable(cssVariable: string, value: string) {
    if ($store.colorPickerEnabled) {
      document.documentElement.style.setProperty(cssVariable, value);
    }
  }

  function clearCssVariables() {
    Object.keys(themeVariables).forEach((key) =>
      document.documentElement.style.removeProperty(key)
    );
  }

  let applyingChanges = false;

  async function save() {
    applyingChanges = true;

    try {
      await functions.save($store);
    } finally {
      applyingChanges = false;
    }
  }

  onDestroy(() => {
    clearCssVariables();
  });

  function settingValueToHexaString(value: unknown | undefined) {
    const result = colorToHexaString(new Colord(value?.toString() ?? ''));

    if (result !== '') {
      return result;
    }

    var ctx = document.createElement('canvas').getContext('2d');
    if (ctx) {
      ctx.fillStyle = value?.toString() ?? '';
      return ctx.fillStyle;
    }

    return '';
  }

  function colorToHexaString(color: Colord | undefined): string {
    if (color?.isValid()) {
      return color.toHex();
    }

    return '';
  }

  function activateEyeDropper(colorToConfigure: ThemeColorSetting) {
    if ('EyeDropper' in window) {
      const EyeDropper = window.EyeDropper as any;
      const eyeDropper = new EyeDropper();
      eyeDropper.open().then(({ sRGBHex }: { sRGBHex: string }) => {
        onColorSelected(colorToConfigure, sRGBHex);
      });
    }
  }

  function onColorSelected(colorToConfigure: ThemeColorSetting, value: string) {
    const parsedColor = settingValueToHexaString(value);
    if (!parsedColor) {
      return;
    }
    trySetCssVariable(colorToConfigure.cssVariable, value);
    $store = {
      ...$store,
      [colorToConfigure.key]: value,
    };
  }

  function processFile(file: File) {
    const fileReader = new FileReader();
    fileReader.addEventListener('load', (event) => {
      console.log(event);

      try {
        const result = event.target?.result?.toString();
        if (!result) {
          throw new Error('File does not contain any text.');
        }
        const theme = JSON.parse(result) as Tidy5eThemeDataV1;

        const isValid =
          theme.version === 1 && typeof theme.variables === 'object';
        if (!isValid) {
          throw new Error(`Theme file ${file.name} is in an invalid format.`);
        }

        const storeUpdateData = Object.keys(theme.variables).reduce<
          Record<string, string>
        >((prev, key) => {
          const themeableColor = themeableColors.find(
            (c) => c.cssVariable === key
          );
          if (themeableColor) {
            prev[themeableColor.key] = theme.variables[key];
          }

          return prev;
        }, {});

        store.update((settings) => ({
          ...settings,
          ...storeUpdateData,
        }));

        ui.notifications.info(
          localize('T5EK.ThemeSettings.Sheet.importSuccess')
        );
      } catch (e) {
        ui.notifications.error(
          localize('T5EK.ThemeSettings.Sheet.importError')
        );
        error(
          e?.toString() ??
            'An error occurred while attempting to import a theme file.'
        );
      }
    });

    fileReader.readAsText(file);
  }

  function onFileChanged(
    ev: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ) {
    const file = ev.currentTarget.files?.[0];

    ev.currentTarget.value = '';

    if (!file) {
      return;
    }

    processFile(file);
  }

  function onDrop(
    ev: DragEvent & {
      currentTarget: EventTarget & HTMLElement;
    }
  ) {
    console.log('File(s) dropped');

    ev.preventDefault();

    let file: File | null = null;
    if (ev.dataTransfer?.items) {
      file = ev.dataTransfer.items[0]?.getAsFile();
    } else if (ev.dataTransfer?.files) {
      file = ev.dataTransfer.files[0];
    }

    if (file) {
      processFile(file);
    }
  }

  let fileImportInput: HTMLInputElement;

  const localize = FoundryAdapter.localize;
</script>

<section class="wrapper" on:drop={onDrop} aria-label="dropzone">
  <div class="theme-settings-form">
    <h2>{localize('T5EK.ThemeSettings.Sheet.header')}</h2>

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

    <div class="color-pickers">
      {#each themeableColors as colorToConfigure}
        <article>
          <div class="description">
            <label for="{colorToConfigure.key}-{appId}">
              {localize(colorToConfigure.name)}
            </label>
          </div>
          <div
            class="theme-settings-group flex-row align-items-center extra-small-gap"
          >
            <ColorPicker
              isPopup={true}
              label=""
              hex={settingValueToHexaString($store[colorToConfigure.key])}
              on:input={(ev) =>
                onColorSelected(
                  colorToConfigure,
                  colorToHexaString(ev.detail.color)
                )}
            />
            <input
              type="text"
              id="{colorToConfigure.key}-{appId}"
              value={$store[colorToConfigure.key]}
              class="theme-color-textbox"
              on:change={(ev) =>
                onColorSelected(colorToConfigure, ev.currentTarget.value)}
            />
            {#if eyeDropperEnabled}
              <button
                type="button"
                class="eye-dropper"
                on:click={() => activateEyeDropper(colorToConfigure)}
                ><i class="fas fa-eye-dropper" /></button
              >
            {/if}
          </div>
        </article>
      {/each}
    </div>
  </div>
  <div class="button-bar">
    <div class="commands flex-row extra-small-gap">
      <button type="button" on:click={() => fileImportInput.click()}>
        <i class="fas fa-file-import" />
        {localize('T5EK.ThemeSettings.Sheet.import')}
      </button>
      <input
        class="theme-import-input"
        type="file"
        accept={CONSTANTS.THEME_EXTENSION_WITH_DOT}
        on:change={onFileChanged}
        bind:this={fileImportInput}
      />
      <button type="button" on:click={() => functions.exportTheme($store)}>
        <i class="fas fa-file-export" />
        {localize('T5EK.ThemeSettings.Sheet.export')}
      </button>
      <button
        type="button"
        on:click={() => functions.useExistingThemeColors('light')}
      >
        <i class="fas fa-sun" />
        {localize('T5EK.ThemeSettings.Sheet.useDefaultLightColors')}
      </button>
      <button
        type="button"
        on:click={() => functions.useExistingThemeColors('dark')}
      >
        <i class="fas fa-moon" />
        {localize('T5EK.ThemeSettings.Sheet.useDefaultDarkColors')}
      </button>
    </div>
    <button type="submit" class="save-changes-btn" on:click={save}>
      <i class="fas fa-save" />
      {localize('T5EK.SaveChanges')}
    </button>
  </div>
</section>

<style lang="scss">
  .wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    height: 100%;
    padding: 0.5rem 0 0.5rem 0.5rem;

    .theme-settings-form {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding-right: 0.5rem;

      article {
        background: var(--t5ek-faintest-color);
        border-radius: 0.3125rem;
        margin: 0.125rem 0;
        padding: 0.25rem;

        label {
          font-weight: 600;
          padding-left: 0.25rem;
        }

        .theme-settings-group {
          height: 3rem;

          .theme-color-textbox {
            flex-basis: 10rem;
            flex: 1;
          }

          .eye-dropper {
            flex: 0;
            line-height: 1.25;
            padding: 0.25rem 0.375rem;
          }
        }
      }
    }

    .button-bar {
      padding-right: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      button {
        margin: 0;
      }

      .commands {
        display: flex;
        flex-direction: row;
        gap: 0.25rem;
        flex-wrap: wrap;

        > * {
          flex: 1;
          white-space: nowrap;
        }

        .theme-import-input {
          display: none;
        }
      }
    }
  }
</style>
