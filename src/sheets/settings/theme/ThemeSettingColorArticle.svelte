<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ThemeColorSetting } from 'src/types/theme';
  import { getContext, onMount } from 'svelte';
  import ColorPicker from 'svelte-awesome-color-picker';
  import type { Writable } from 'svelte/store';
  import type { CurrentSettings } from 'src/settings/settings';
  import {
    settingValueToHexaString,
    trySetRootCssVariable,
    colorToHexaString,
  } from 'src/theme/theme';

  export let colorToConfigure: ThemeColorSetting;

  let appId = getContext('appId');
  let store = getContext<Writable<CurrentSettings>>('store');
  let colorPickerIsOpen: boolean = false;

  const eyeDropperEnabled = 'EyeDropper' in window;

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
    trySetRootCssVariable(
      colorToConfigure.cssVariable,
      value,
      $store.colorPickerEnabled
    );
    $store = {
      ...$store,
      [colorToConfigure.key]: value,
    };
  }

  let article: HTMLElement;
  onMount(() => {
    // Required in order to prevent unwanted form submissions by the chosen Color Picker.
    article.querySelectorAll('button').forEach((button) => {
      if (button.type === 'submit') {
        button.type = 'button';
      }
    });
  });

  const localize = FoundryAdapter.localize;
</script>

<article bind:this={article}>
  <div class="description">
    <label for="{colorToConfigure.key}-{appId}">
      {localize(colorToConfigure.name)}
    </label>
  </div>
  <div class="theme-settings-group flex-row align-items-center extra-small-gap">
    <ColorPicker
      bind:isOpen={colorPickerIsOpen}
      isPopup={true}
      label=""
      hex={settingValueToHexaString(
        $store[colorToConfigure.key]?.toString() ?? ''
      ).hexa}
      on:input={(ev) =>
        colorPickerIsOpen &&
        onColorSelected(colorToConfigure, colorToHexaString(ev.detail.color))}
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

<style lang="scss">
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
</style>
