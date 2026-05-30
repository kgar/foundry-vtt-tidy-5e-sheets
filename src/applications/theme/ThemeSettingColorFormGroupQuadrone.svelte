<script lang="ts">
  import { settingValueToHexaString } from 'src/theme/theme';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { isNil } from 'src/utils/data';
  import chroma from 'chroma-js';

  interface Props {
    key: string;
    label: string;
    value: string;
    placeholder?: string;
    colorSelected?: () => void;
    disableDelete?: boolean;
    requireValue?: boolean;
  }

  let {
    label,
    value = $bindable(),
    key,
    colorSelected,
    placeholder = '#FFFFFF',
    disableDelete = false,
    requireValue = false,
  }: Props = $props();

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
  <div class="form-fields color-picker-container">
    <label
      for="{inputId}-picker"
      class="color-picker-preview"
      style:--bg-color={value || placeholder}
    >
      <i class="fa-solid fa-palette"></i>
    </label>

    <!-- This input is driving the Coloris color picker. -->
    <!-- When unset, default the picker to the inherited value from the inheritance stack rather than #000000. -->
    <input
      type="text"
      id="{inputId}-picker"
      value={value || placeholder}
      class="coloris hidden-input"
      oninput={(ev) => onColorSelected(ev.currentTarget.value)}
    />

    <input
      bind:this={colorInput}
      type="text"
      id={inputId}
      {value}
      class="theme-color-textbox"
      {placeholder}
      oninput={(ev) => onColorSelected(ev.currentTarget.value)}
      onblur={() => {
        if (requireValue && (isNil(value, '') || !chroma.valid(value))) {
          onColorSelected(placeholder);
        } else if (!isNil(value, '') && !chroma.valid(value)) {
          value = '';
        }
      }}
    />

    {#if eyeDropperEnabled}
      <button
        title={FoundryAdapter.localize('TIDY5E.ContextMenuActionPickColor')}
        type="button"
        class="button button-borderless button-icon-only eye-dropper"
        onclick={() => activateEyeDropper()}
      >
        <i class="fa-solid fa-eye-dropper"></i>
      </button>
    {/if}

    {#if !isNil(value, '') && !disableDelete}
      <button
        type="button"
        title={FoundryAdapter.localize('TIDY5E.ContextMenuActionDelete')}
        class="button button-secondary button-icon-only"
        onclick={() => {
          value = '';
        }}
      >
        <i class="fa-solid fa-trash"></i>
      </button>
    {/if}
  </div>
</div>
