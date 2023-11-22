<script lang="ts">
  import ButtonMenu from 'src/components/button-menu/ButtonMenu.svelte';
  import ButtonMenuCommand from 'src/components/button-menu/ButtonMenuCommand.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { createEventDispatcher, getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import type { CurrentSettings } from 'src/settings/settings';
  import ThemeSelectorButtonMenuCommand from 'src/sheets/shared/ThemeSelectorButtonMenuCommand.svelte';
  import ButtonMenuDivider from 'src/components/button-menu/ButtonMenuDivider.svelte';
  import type { ThemeSettingsSheetFunctions } from './ThemeSettingsFormApplication';

  let functions = getContext<ThemeSettingsSheetFunctions>('functions');
  let context = getContext<Writable<CurrentSettings>>('context');
  const dispatch = createEventDispatcher<{
    selectFile: File;
  }>();

  let fileImportInput: HTMLInputElement;

  const localize = FoundryAdapter.localize;

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

    dispatch('selectFile', file);
  }
</script>

<ButtonMenu
  iconClass={{
    opened: 'fas fa-caret-up',
    closed: 'fas fa-caret-down',
  }}
  position="bottom"
  anchor="right"
  openerPadding="0.125rem 0.5rem"
  buttonText={localize('T5EK.ThemeSettings.Sheet.menuLabel')}
>
  <ThemeSelectorButtonMenuCommand />
  <ButtonMenuDivider />
  <ButtonMenuCommand
    on:click={() => fileImportInput.click()}
    iconClass="fas fa-file-import"
  >
    {localize('T5EK.ThemeSettings.Sheet.import')}
  </ButtonMenuCommand>
  <ButtonMenuCommand
    on:click={() => functions.exportTheme($context)}
    iconClass="fas fa-file-export"
  >
    {localize('T5EK.ThemeSettings.Sheet.export')}
  </ButtonMenuCommand>
  <ButtonMenuCommand
    on:click={() =>
      functions.useExistingThemeColors(CONSTANTS.THEME_ID_DEFAULT_LIGHT)}
    iconClass="fas fa-sun"
  >
    {localize('T5EK.ThemeSettings.Sheet.useDefaultLightColors')}
  </ButtonMenuCommand>
  <ButtonMenuCommand
    on:click={() =>
      functions.useExistingThemeColors(CONSTANTS.THEME_ID_DEFAULT_DARK)}
    iconClass="fas fa-moon"
  >
    {localize('T5EK.ThemeSettings.Sheet.useDefaultDarkColors')}
  </ButtonMenuCommand>
</ButtonMenu>
<input
  class="theme-import-input"
  type="file"
  accept={CONSTANTS.THEME_EXTENSION_WITH_DOT}
  on:change={onFileChanged}
  bind:this={fileImportInput}
/>

<style lang="scss">
  .theme-import-input {
    display: none;
  }
</style>
