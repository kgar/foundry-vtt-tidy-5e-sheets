<script lang="ts">
  import ButtonMenu from 'src/components/button-menu/ButtonMenu.svelte';
  import ButtonMenuCommand from 'src/components/button-menu/ButtonMenuCommand.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import type { CurrentSettings } from 'src/settings/settings.svelte';
  import ThemeSelectorButtonMenuCommand from 'src/sheets/classic/shared/ThemeSelectorButtonMenuCommand.svelte';
  import ButtonMenuDivider from 'src/components/button-menu/ButtonMenuDivider.svelte';
  import type { ThemeSettingsSheetFunctions } from './ThemeSettingsFormApplication.svelte';

  interface Props {
    onSelectFile?: (file: File) => void;
    settings: CurrentSettings;
  }

  let { onSelectFile, settings }: Props = $props();

  let functions = getContext<ThemeSettingsSheetFunctions>(
    CONSTANTS.SVELTE_CONTEXT.FUNCTIONS,
  );

  let fileImportInput: HTMLInputElement;

  const localize = FoundryAdapter.localize;

  function onFileChanged(
    ev: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    },
  ) {
    const file = ev.currentTarget.files?.[0];

    ev.currentTarget.value = '';

    if (!file) {
      return;
    }

    onSelectFile?.(file);
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
  buttonText={localize('TIDY5E.ThemeSettings.Sheet.menuLabel')}
>
  <ThemeSelectorButtonMenuCommand />
  <ButtonMenuDivider />
  <ButtonMenuCommand
    onMenuClick={() => fileImportInput.click()}
    iconClass="fas fa-file-import"
  >
    {localize('TIDY5E.ThemeSettings.Sheet.import')}
  </ButtonMenuCommand>
  <ButtonMenuCommand
    onMenuClick={() => functions.exportTheme(settings)}
    iconClass="fas fa-file-export"
  >
    {localize('TIDY5E.ThemeSettings.Sheet.export')}
  </ButtonMenuCommand>
  <ButtonMenuCommand
    onMenuClick={() =>
      functions.useExistingThemeColors(CONSTANTS.THEME_ID_DEFAULT_LIGHT)}
    iconClass="fas fa-sun"
  >
    {localize('TIDY5E.ThemeSettings.Sheet.useDefaultLightColors')}
  </ButtonMenuCommand>
  <ButtonMenuCommand
    onMenuClick={() =>
      functions.useExistingThemeColors(CONSTANTS.THEME_ID_DEFAULT_DARK)}
    iconClass="fas fa-moon"
  >
    {localize('TIDY5E.ThemeSettings.Sheet.useDefaultDarkColors')}
  </ButtonMenuCommand>
</ButtonMenu>
<input
  class="theme-import-input"
  type="file"
  accept={CONSTANTS.THEME_EXTENSION_WITH_DOT}
  onchange={onFileChanged}
  bind:this={fileImportInput}
/>

<style lang="scss">
  .theme-import-input {
    display: none;
  }
</style>
