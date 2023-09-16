<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { CurrentSettings } from 'src/settings/settings';
  import { themeVariables } from 'src/theme/theme-reference';
  import { getContext, onDestroy } from 'svelte';
  import type { Writable } from 'svelte/store';
  import type { ThemeSettingsSheetFunctions } from './Tidy5eKgarThemeSettingsSheet';
  import type { ThemeColorSetting } from 'src/types/theme';
  import ColorPicker from 'svelte-awesome-color-picker';
  import { Colord } from 'colord';

  let store = getContext<Writable<CurrentSettings>>('store');
  let appId = getContext<string>('appId');
  let functions = getContext<ThemeSettingsSheetFunctions>('functions');

  export let themeableColors: ThemeColorSetting[];

  $: {
    if ($store.colorPickerEnabled) {
      themeableColors.forEach((color) =>
        setProperty(color.cssVariable, $store[color.key]?.toString())
      );
    } else {
      clearCssVariables();
    }
  }

  function setProperty(cssVariable: string, value: string) {
    document.documentElement.style.setProperty(cssVariable, value);
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
    return colorToHexaString(new Colord(value?.toString() ?? ''));
  }

  function colorToHexaString(color: Colord | undefined): string {
    if (color?.isValid()) {
      return color.toHex();
    }

    return '';
  }

  const localize = FoundryAdapter.localize;
</script>

<section class="fred">
  <div class="fred-2">
    <h2>{localize('T5EK.ThemeSettings.Sheet.header')}</h2>

    <div>
      <input
        type="checkbox"
        data-dtype="boolean"
        id="colorPickerEnabled-{appId}"
        bind:checked={$store.colorPickerEnabled}
      />

      <label for="colorPickerEnabled-{appId}">
        {localize('TIDY5E.Settings.ColorPickerEnabled.name')}
      </label>
    </div>

    <div class="fred-4">
      {#each themeableColors as colorToConfigure}
        <div>
          <label for="{colorToConfigure.key}-{appId}">
            {localize(colorToConfigure.name)}
          </label>
          <div class="flex-row align-items-center extra-small-gap">
            <input
              type="text"
              id="{colorToConfigure.key}-{appId}"
              bind:value={$store[colorToConfigure.key]}
              on:change={(ev) =>
                setProperty(
                  colorToConfigure.cssVariable,
                  ev.currentTarget.value
                )}
              style="flex-basis: 8rem"
            />
            <ColorPicker
              label=""
              hex={settingValueToHexaString($store[colorToConfigure.key])}
              on:input={(ev) =>
                store.update((settings) => {
                  return {
                    ...settings,
                    [colorToConfigure.key]: colorToHexaString(ev.detail.color),
                  };
                })}
            />
          </div>
        </div>
      {/each}
    </div>
  </div>
  <div class="fred-3">
    <button type="button" name="save" class="save-changes-btn" on:click={save}>
      <i class="fas fa-save" />
      {localize('T5EK.SaveChanges')}
    </button>
  </div>
</section>

<style lang="scss">
  .fred {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    height: 100%;
    padding: 0.5rem 0 0.5rem 0.5rem;
  }

  .fred-2 {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .fred-3 {
    flex: 0;
  }

  .fred-4 {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1rem;
  }
</style>
