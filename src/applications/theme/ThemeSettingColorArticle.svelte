<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ThemeColorSetting } from 'src/types/theme.types';
  import { getContext, onMount } from 'svelte';
  import type { CurrentSettings } from 'src/settings/settings.svelte';
  import {
    settingValueToHexaString,
    trySetRootCssVariable,
  } from 'src/theme/theme';
  import { CONSTANTS } from 'src/constants';

  interface Props {
    colorToConfigure: ThemeColorSetting;
  }

  let { colorToConfigure }: Props = $props();

  let appId = getContext(CONSTANTS.SVELTE_CONTEXT.APP_ID);
  let context = getContext<CurrentSettings>(CONSTANTS.SVELTE_CONTEXT.CONTEXT);

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
      context.colorPickerEnabled,
    );
    context = {
      ...context,
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
    <label
      for="{colorToConfigure.key}-{appId}"
      class="color-picker-preview"
      style="--bg-color: {context[colorToConfigure.key]};"
    ></label>

    <input
      type="text"
      id="{colorToConfigure.key}-{appId}"
      value={context[colorToConfigure.key]}
      class="theme-color-textbox coloris"
      onchange={(ev) =>
        onColorSelected(colorToConfigure, ev.currentTarget.value)}
    />
    {#if eyeDropperEnabled}
      <button
        type="button"
        class="eye-dropper"
        onclick={() => activateEyeDropper(colorToConfigure)}
        ><i class="fas fa-eye-dropper"></i></button
      >
    {/if}
  </div>
</article>

<style lang="scss">
  article {
    background: var(--t5e-faintest-color);
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

    .color-picker-preview {
      background: var(--bg-color);
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      cursor: pointer;
    }
  }
</style>
