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

  const context = getContext<WorldSettingsContextStore>(CONSTANTS.SVELTE_CONTEXT.CONTEXT);
  let functions = getContext<WorldSettingsFunctions>(CONSTANTS.SVELTE_CONTEXT.FUNCTIONS);

  const localize = FoundryAdapter.localize;
</script>

<div class="settings-form">
  <SelectSetting
    options={SettingsProvider.settings.initialVehicleSheetTab.options.choices()}
    bind:value={$context.settings.initialVehicleSheetTab}
    name={SettingsProvider.settings.initialVehicleSheetTab.options.name}
    hint={SettingsProvider.settings.initialVehicleSheetTab.options.hint}
    id="initialVehicleSheetTab"
  />

  <ListboxSetting
    name={SettingsProvider.settings.defaultVehicleSheetTabs.options.name}
    hint={SettingsProvider.settings.defaultVehicleSheetTabs.options.hint}
    leftHeader="TIDY5E.Settings.DefaultSheetTabs.AvailableHeader"
    bind:leftItems={$context.defaultVehicleTabs.available}
    rightHeader="TIDY5E.Settings.DefaultSheetTabs.SelectedHeader"
    bind:rightItems={$context.defaultVehicleTabs.selected}
    labelProp="label"
    valueProp="id"
  >
    <div slot="below-listbox">
      <button
        type="button"
        on:click={() =>
          functions.resetDefaultTabs(context, CONSTANTS.SHEET_TYPE_VEHICLE)}
      >
        <i class="fas fa-rotate-right" />
        {localize('TIDY5E.Reset')}
      </button>
    </div>
  </ListboxSetting>

  <CheckboxSetting
    bind:value={$context.settings.useVehicleEncumbranceBar}
    name={SettingsProvider.settings.useVehicleEncumbranceBar.options.name}
    hint={SettingsProvider.settings.useVehicleEncumbranceBar.options.hint}
    id="useVehicleEncumbranceBar"
  />

  <CheckboxSetting
    bind:value={$context.settings.useVehicleMotion}
    name={'TIDY5E.Settings.UseVehicleMotion.name'}
    hint={'TIDY5E.Settings.UseVehicleMotion.hint'}
    id="useVehicleMotion"
  />
</div>

<style lang="scss">
</style>
