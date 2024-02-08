<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import CheckboxSetting from 'src/applications/settings/parts/CheckboxSetting.svelte';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import { SettingsProvider } from 'src/settings/settings';
  import NumberInputSetting from 'src/applications/settings/parts/NumberInputSetting.svelte';
  import SelectSetting from '../parts/SelectSetting.svelte';
  import type {
    SettingsSheetContext,
    SettingsSheetFunctions,
  } from '../ClientSettings.types';
  import ListboxSetting from '../parts/ListboxSetting.svelte';
  import { CONSTANTS } from 'src/constants';

  let context = getContext<Writable<SettingsSheetContext>>('context');
  let functions = getContext<SettingsSheetFunctions>('functions');

  const userIsGm = FoundryAdapter.userIsGm();
  const localize = FoundryAdapter.localize;
</script>

<h2>{localize('TIDY5E.Settings.TabVehicles.header')}</h2>
{#if userIsGm}
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
{/if}

<CheckboxSetting
  bind:value={$context.settings.useClassicControlsForVehicle}
  name={SettingsProvider.settings.useClassicControlsForVehicle.options.name}
  hint={SettingsProvider.settings.useClassicControlsForVehicle.options.hint}
  id="useClassicControlsForVehicle"
/>

<CheckboxSetting
  bind:value={$context.settings.useHpBarVehicle}
  name={'TIDY5E.Settings.UseHpBar.name'}
  hint={'TIDY5E.Settings.UseHpBar.hint'}
  id="useHpBarVehicle"
/>

<CheckboxSetting
  bind:value={$context.settings.useHpOverlayVehicle}
  name={'TIDY5E.Settings.UseHpOverlay.name'}
  hint={'TIDY5E.Settings.UseHpOverlay.hint'}
  id="useHpOverlayVehicle"
/>

<NumberInputSetting
  bind:value={$context.settings.vehicleSheetWidth}
  name={'TIDY5E.Settings.VehicleSheetWidth.name'}
  hint={'TIDY5E.Settings.VehicleSheetWidth.hint'}
  id="vehicleSheetWidth"
/>
