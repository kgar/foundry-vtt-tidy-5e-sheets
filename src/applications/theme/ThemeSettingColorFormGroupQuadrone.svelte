<script lang="ts">
  import { settingValueToHexaString } from 'src/theme/theme';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { isNil } from 'src/utils/data';

  interface Props {
    key: string;
    label: string;
    value: string;
    colorSelected?: () => void;
  }

  let { label, value = $bindable(), key, colorSelected }: Props = $props();

  const eyeDropperEnabled = 'EyeDropper' in window;

  let inputId = $derived(`color-setting-${key}-${foundry.utils.randomID()}`);

  let colorInput: HTMLInputElement | undefined;

  function activateEyeDropper() {
    if ('EyeDropper' in window) {
      const EyeDropper = window.EyeDropper as any;
      const eyeDropper = new EyeDropper();
      eyeDropper.open().then(({ sRGBHex }: { sRGBHex: string }) => {
        onColorSelected(sRGBHex);
      });
    }
  }

  function onColorSelected(selectedValue: string) {
    const parsedColor = settingValueToHexaString(selectedValue);
    if (!parsedColor) {
      return;
    }

    value = selectedValue;

    colorSelected?.();
  }
</script>

<div class="form-group">
  <!-- TODO: hightouch to backtrack on eyedropper  -->
  <label for={inputId}>{label}</label>
  <div class="form-fields">
    <label
      for="{inputId}-picker"
      class="color-picker-preview"
      style="--bg-color: {value};"
    >
      <i class="fa-solid fa-eye-dropper"></i>
    </label>

    <!-- This input is driving the Coloris color picker. -->
    <input
      type="text"
      id="{inputId}-picker"
      {value}
      class="coloris"
      style="width: 0; flex: 0; padding: 0; border: 0"
      oninput={(ev) => onColorSelected(ev.currentTarget.value)}
    />

    <input
      bind:this={colorInput}
      type="text"
      id={inputId}
      {value}
      class="theme-color-textbox"
      placeholder="#FFFFFF"
      oninput={(ev) => onColorSelected(ev.currentTarget.value)}
    />

    {#if eyeDropperEnabled}
      <button
        type="button"
        class="button button-borderless button-icon-only eye-dropper"
        onclick={() => activateEyeDropper()}
      >
        <i class="fa-solid fa-eye-dropper"></i>
      </button>
    {/if}

    <button
      type="button"
      title={FoundryAdapter.localize('TIDY5E.ContextMenuActionDelete')}
      class="button button-borderless button-icon-only"
      onclick={() => {
        value = '';
      }}
      disabled={isNil(value, '')}
    >
      <i class="fa-solid fa-xmark"></i>
    </button>
  </div>
</div>
