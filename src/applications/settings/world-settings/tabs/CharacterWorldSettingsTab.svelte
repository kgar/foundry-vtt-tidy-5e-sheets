<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import CheckboxSetting from 'src/applications/settings/parts/CheckboxSetting.svelte';
  import { getContext } from 'svelte';
  import { SettingsProvider } from 'src/settings/settings';
  import SelectSetting from 'src/applications/settings/parts/SelectSetting.svelte';
  import type {
    WorldSettingsContextStore,
    WorldSettingsFunctions,
  } from '../WorldSettings.types';
  import ListboxSetting from '../../parts/ListboxSetting.svelte';
  import { CONSTANTS } from 'src/constants';

  const context = getContext<WorldSettingsContextStore>('context');
  let functions = getContext<WorldSettingsFunctions>('functions');

  const localize = FoundryAdapter.localize;
</script>

<div class="settings-form">
  <SelectSetting
    options={SettingsProvider.settings.initialCharacterSheetTab.options.choices()}
    bind:value={$context.settings.initialCharacterSheetTab}
    name={SettingsProvider.settings.initialCharacterSheetTab.options.name}
    hint={SettingsProvider.settings.initialCharacterSheetTab.options.hint}
    id="initialCharacterSheetTab"
  />

  <ListboxSetting
    name={SettingsProvider.settings.defaultCharacterSheetTabs.options.name}
    hint={SettingsProvider.settings.defaultCharacterSheetTabs.options.hint}
    leftHeader="TIDY5E.Settings.DefaultSheetTabs.AvailableHeader"
    bind:leftItems={$context.defaultCharacterTabs.available}
    rightHeader="TIDY5E.Settings.DefaultSheetTabs.SelectedHeader"
    bind:rightItems={$context.defaultCharacterTabs.selected}
    labelProp="label"
    valueProp="id"
  >
    <div slot="below-listbox">
      <button
        type="button"
        on:click={() =>
          functions.resetDefaultTabs(context, CONSTANTS.SHEET_TYPE_CHARACTER)}
      >
        <i class="fas fa-rotate-right" />
        {localize('TIDY5E.Reset')}
      </button>
    </div>
  </ListboxSetting>

  <CheckboxSetting
    bind:value={$context.settings.useCharacterEncumbranceBar}
    name={SettingsProvider.settings.useCharacterEncumbranceBar.options.name}
    hint={SettingsProvider.settings.useCharacterEncumbranceBar.options.hint}
    id="useCharacterEncumbranceBar"
  />

  <CheckboxSetting
    bind:value={$context.settings.showPlayerName}
    name={'TIDY5E.Settings.ShowPlayerName.name'}
    hint={'TIDY5E.Settings.ShowPlayerName.hint'}
    id="showPlayerName"
  />

  <CheckboxSetting
    bind:value={$context.settings.useCharacterInspiration}
    name={'TIDY5E.Settings.UseInspiration.name'}
    hint={'TIDY5E.Settings.UseInspiration.hint'}
    id="useCharacterInspiration"
  />

  <CheckboxSetting
    bind:value={$context.settings.allowHpMaxOverride}
    name={'TIDY5E.Settings.AllowHpMaxOverride.name'}
    hint={'TIDY5E.Settings.AllowHpMaxOverride.hint'}
    id="allowHpMaxOverride"
  />
</div>

<style lang="scss">
</style>
