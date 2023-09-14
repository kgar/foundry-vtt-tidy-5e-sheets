<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { CurrentSettings } from 'src/settings/settings';
  import { themeVariables } from 'src/theme/theme-reference';
  import { getContext, onDestroy } from 'svelte';
  import type { Writable } from 'svelte/store';
  import type { ThemeSettingsSheetFunctions } from './Tidy5eKgarThemeSettingsSheet';
  import type { ThemeColorSetting } from 'src/types/theme';

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

  const localize = FoundryAdapter.localize;
</script>

<!-- TODO: npm i svelte-awesome-color-picker -->

<h3>{localize('TIDY5E.Settings.ColorPickerLabel')}</h3>

<div>
  <input
    type="checkbox"
    data-dtype="boolean"
    id="colorPickerEnabled-{appId}"
    bind:checked={$store.colorPickerEnabled}
  />

  {localize('TIDY5E.Settings.ColorPickerEnabled.name')}
  {localize('TIDY5E.Settings.ColorPickerEnabled.hint')}
</div>

{#each themeableColors as colorToConfigure}
  <div>
    <label for="{colorToConfigure.key}-{appId}">
      {localize(colorToConfigure.name)}
    </label>
    <input
      type="text"
      id="{colorToConfigure.key}-{appId}"
      bind:value={$store[colorToConfigure.key]}
      on:change={(ev) =>
        setProperty(colorToConfigure.cssVariable, ev.currentTarget.value)}
    />
    {localize(colorToConfigure.hint)}
  </div>
{/each}

<button type="button" name="save" class="save-changes-btn" on:click={save}>
  <i class="fas fa-save" />
  {localize('T5EK.SaveChanges')}
</button>
