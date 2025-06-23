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
  <label for={inputId}>{label}</label>
  <div class="form-fields">
    <label
      for={inputId}
      class="color-picker-preview"
      style="--bg-color: {value};"
    ></label>

    <input
      bind:this={colorInput}
      type="text"
      id={inputId}
      {value}
      class="theme-color-textbox coloris"
      oninput={(ev) => onColorSelected(ev.currentTarget.value)}
    />

    <button
      type="button"
      title={FoundryAdapter.localize('TIDY5E.ContextMenuActionDelete')}
      class="button clear-color"
      onclick={() => {
        if (!colorInput) {
          return;
        }
        colorInput.value = '';
        colorInput.dispatchEvent(new Event('change', { bubbles: true }));
      }}
    >
      <i class="fa-solid fa-eraser"></i>
    </button>
    {#if eyeDropperEnabled}
      <button
        type="button"
        class="button eye-dropper"
        onclick={() => activateEyeDropper()}
      >
        <i class="fa-solid fa-eye-dropper"></i>
      </button>
    {/if}
  </div>
</div>
