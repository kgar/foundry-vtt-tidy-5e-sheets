<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import CheckboxSetting from 'src/applications/settings/parts/CheckboxSetting.svelte';
  import { getContext } from 'svelte';
  import { SettingsProvider } from 'src/settings/settings.svelte';
  import SelectSetting from 'src/applications/settings/parts/SelectSetting.svelte';
  import type {
    WorldSettingsContext,
    WorldSettingsFunctions,
  } from '../WorldSettings.types';
  import ListboxSetting from '../../parts/ListboxSetting.svelte';
  import { CONSTANTS } from 'src/constants';

  const context = getContext<WorldSettingsContext>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
  let functions = getContext<WorldSettingsFunctions>(
    CONSTANTS.SVELTE_CONTEXT.FUNCTIONS,
  );

  const localize = FoundryAdapter.localize;
</script>

<div class="settings-form">
  <SelectSetting
    options={SettingsProvider.settings.initialCharacterSheetTab.options.choices()}
    bind:value={context.settings.initialCharacterSheetTab}
    name={SettingsProvider.settings.initialCharacterSheetTab.options.name}
    hint={SettingsProvider.settings.initialCharacterSheetTab.options.hint}
    id="initialCharacterSheetTab"
  />

  <ListboxSetting
    name={SettingsProvider.settings.defaultCharacterSheetTabs.options.name}
    hint={SettingsProvider.settings.defaultCharacterSheetTabs.options.hint}
    leftHeaderText="TIDY5E.Settings.DefaultSheetTabs.SelectedHeader"
    bind:leftItems={context.defaultCharacterTabs.selected}
    rightHeaderText="TIDY5E.Settings.DefaultSheetTabs.AvailableHeader"
    bind:rightItems={context.defaultCharacterTabs.available}
    labelProp="label"
    valueProp="id"
  >
    {#snippet belowListbox()}
      <div>
        <button
          type="button"
          onclick={() =>
            functions.resetDefaultTabs(CONSTANTS.SHEET_TYPE_CHARACTER)}
        >
          <i class="fas fa-rotate-right"></i>
          {localize('TIDY5E.Reset')}
        </button>
      </div>
    {/snippet}
  </ListboxSetting>

  <CheckboxSetting
    bind:value={context.settings.useCharacterEncumbranceBar}
    name={SettingsProvider.settings.useCharacterEncumbranceBar.options.name}
    hint={SettingsProvider.settings.useCharacterEncumbranceBar.options.hint}
    id="useCharacterEncumbranceBar"
  />

  <CheckboxSetting
    bind:value={context.settings.showPlayerName}
    name={'TIDY5E.Settings.ShowPlayerName.name'}
    hint={'TIDY5E.Settings.ShowPlayerName.hint'}
    id="showPlayerName"
  />

  <CheckboxSetting
    bind:value={context.settings.useCharacterInspiration}
    name={'TIDY5E.Settings.UseInspiration.name'}
    hint={'TIDY5E.Settings.UseInspiration.hint'}
    id="useCharacterInspiration"
  />

  <CheckboxSetting
    bind:value={context.settings.allowHpMaxOverride}
    name={'TIDY5E.Settings.AllowHpMaxOverride.name'}
    hint={'TIDY5E.Settings.AllowHpMaxOverride.hint'}
    id="allowHpMaxOverride"
  />
</div>

<style lang="less">
</style>
