<script lang="ts">
  import ButtonMenu from 'src/components/button-menu/ButtonMenu.svelte';
  import ButtonMenuCommand from 'src/components/button-menu/ButtonMenuCommand.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { createEventDispatcher, getContext } from 'svelte';
  import type { ThemeSettingsSheetFunctions } from './Tidy5eKgarThemeSettingsSheet';
  import type { Writable } from 'svelte/store';
  import type { CurrentSettings } from 'src/settings/settings';

  let functions = getContext<ThemeSettingsSheetFunctions>('functions');
  let store = getContext<Writable<CurrentSettings>>('store');
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
  <ButtonMenuCommand on:click={() => fileImportInput.click()}>
    <span class="flex-row justify-content-space-between align-items-baseline">
      <span class="command-icon-and-label">
        <i class="fas fa-file-import" />
        {localize('T5EK.ThemeSettings.Sheet.import')}
      </span>
      <i class="fas fa-info-circle" title={localize('T5EK.ThemeSettings.Sheet.importDropHint')} />
    </span>
  </ButtonMenuCommand>
  <ButtonMenuCommand on:click={() => functions.exportTheme($store)}>
    <i class="fas fa-file-export" />
    {localize('T5EK.ThemeSettings.Sheet.export')}
  </ButtonMenuCommand>
  <ButtonMenuCommand on:click={() => functions.useExistingThemeColors('light')}>
    <i class="fas fa-sun" />
    {localize('T5EK.ThemeSettings.Sheet.useDefaultLightColors')}
  </ButtonMenuCommand>
  <ButtonMenuCommand on:click={() => functions.useExistingThemeColors('dark')}>
    <i class="fas fa-moon" />
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

  .command-icon-and-label {
    display: flex;
    align-items: center;
    gap: 0.25rem;

    > i {
      flex: 0 0 1.25rem;
    }

    > :not(i) {
      flex: 1;
    }
  }
</style>
