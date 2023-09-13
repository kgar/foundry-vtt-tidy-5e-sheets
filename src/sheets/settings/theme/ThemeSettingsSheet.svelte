<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { CurrentSettings } from 'src/settings/settings';
  import { themeVariables } from 'src/theme/theme-reference';
  import { getContext, onDestroy } from 'svelte';
  import type { Writable } from 'svelte/store';

  let store = getContext<Writable<CurrentSettings>>('store');
  let appId = getContext<string>('appId');

  type ThemeColorSetting = {
    name: string;
    hint: string;
    key: keyof CurrentSettings;
    cssVariable: string;
  };

  const themeColorsToConfigure: ThemeColorSetting[] = [
    {
      key: 'colorPickerPrimaryAccent',
      name: 'T5EK.Settings.ColorPickerPrimaryAccent.name',
      hint: 'T5EK.Settings.ColorPickerPrimaryAccent.hint',
      cssVariable: '--t5ek-primary-accent-color',
    },
    {
      key: 'colorPickerEquipped',
      name: 'T5EK.Settings.ColorPickerEquipped.name',
      hint: 'T5EK.Settings.ColorPickerEquipped.hint',
      cssVariable: '--t5ek-equipped-background',
    },
    {
      key: 'colorPickerEquippedOutline',
      name: 'T5EK.Settings.ColorPickerEquippedOutline.name',
      hint: 'T5EK.Settings.ColorPickerEquippedOutline.hint',
      cssVariable: '--t5ek-equipped-item-grid-tile-accent-color',
    },
    {
      key: 'colorPickerEquippedAccent',
      name: 'T5EK.Settings.ColorPickerEquippedAccent.name',
      hint: 'T5EK.Settings.ColorPickerEquippedAccent.hint',
      cssVariable: '--t5ek-equipped-item-grid-tile-accent-color',
    },
    {
      key: 'colorPickerPrepared',
      name: 'T5EK.Settings.ColorPickerPrepared.name',
      hint: 'T5EK.Settings.ColorPickerPrepared.hint',
      cssVariable: '--t5ek-prepared-background',
    },
    {
      key: 'colorPickerPreparedOutline',
      name: 'T5EK.Settings.ColorPickerPreparedOutline.name',
      hint: 'T5EK.Settings.ColorPickerPreparedOutline.hint',
      cssVariable: '--t5ek-prepared-item-grid-tile-outline-color',
    },
    {
      key: 'colorPickerPreparedAccent',
      name: 'T5EK.Settings.ColorPickerPreparedAccent.name',
      hint: 'T5EK.Settings.ColorPickerPreparedAccent.hint',
      cssVariable: '--t5ek-prepared-item-grid-tile-accent-color',
    },
    {
      key: 'colorPickerPact',
      name: 'T5EK.Settings.ColorPickerPact.name',
      hint: 'T5EK.Settings.ColorPickerPact.hint',
      cssVariable: '--t5ek-pact-background',
    },
    {
      key: 'colorPickerPactOutline',
      name: 'T5EK.Settings.ColorPickerPactOutline.name',
      hint: 'T5EK.Settings.ColorPickerPactOutline.hint',
      cssVariable: '--t5ek-pact-outline-color',
    },
    {
      key: 'colorPickerPactAccent',
      name: 'T5EK.Settings.ColorPickerPactAccent.name',
      hint: 'T5EK.Settings.ColorPickerPactAccent.hint',
      cssVariable: '--t5ek-pact-accent-color',
    },
    {
      key: 'colorPickerAtWill',
      name: 'T5EK.Settings.ColorPickerAtWill.name',
      hint: 'T5EK.Settings.ColorPickerAtWill.hint',
      cssVariable: '--t5ek-atwill-background',
    },
    {
      key: 'colorPickerAtWillOutline',
      name: 'T5EK.Settings.ColorPickerAtWillOutline.name',
      hint: 'T5EK.Settings.ColorPickerAtWillOutline.hint',
      cssVariable: '--t5ek-atwill-outline-color',
    },
    {
      key: 'colorPickerAtWillAccent',
      name: 'T5EK.Settings.ColorPickerAtWillAccent.name',
      hint: 'T5EK.Settings.ColorPickerAtWillAccent.hint',
      cssVariable: '--t5ek-atwill-accent-color',
    },
    {
      key: 'colorPickerInnate',
      name: 'T5EK.Settings.ColorPickerInnate.name',
      hint: 'T5EK.Settings.ColorPickerInnate.hint',
      cssVariable: '--t5ek-innate-background',
    },
    {
      key: 'colorPickerInnateOutline',
      name: 'T5EK.Settings.ColorPickerInnateOutline.name',
      hint: 'T5EK.Settings.ColorPickerInnateOutline.hint',
      cssVariable: '--t5ek-innate-outline',
    },
    {
      key: 'colorPickerInnateAccent',
      name: 'T5EK.Settings.ColorPickerInnateAccent.name',
      hint: 'T5EK.Settings.ColorPickerInnateAccent.hint',
      cssVariable: '--t5ek-innate-accent',
    },
    {
      key: 'colorPickerAlwaysPrepared',
      name: 'T5EK.Settings.ColorPickerAlwaysPrepared.name',
      hint: 'T5EK.Settings.ColorPickerAlwaysPrepared.hint',
      cssVariable: '--t5ek-alwaysprepared-background',
    },
    {
      key: 'colorPickerAlwaysPreparedOutline',
      name: 'T5EK.Settings.ColorPickerAlwaysPreparedOutline.name',
      hint: 'T5EK.Settings.ColorPickerAlwaysPreparedOutline.hint',
      cssVariable: '--t5ek-alwaysprepared-outline-color',
    },
    {
      key: 'colorPickerAlwaysPreparedAccent',
      name: 'T5EK.Settings.ColorPickerAlwaysPreparedAccent.name',
      hint: 'T5EK.Settings.ColorPickerAlwaysPreparedAccent.hint',
      cssVariable: '--t5ek-alwaysprepared-accent-color',
    },
  ];

  $: {
    if ($store.colorPickerEnabled) {
      themeColorsToConfigure.forEach((color) =>
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

{#each themeColorsToConfigure as colorToConfigure}
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
