<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import CheckboxSetting from 'src/applications/sheet-settings/parts/CheckboxSetting.svelte';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import {
    SettingsProvider,
    type CurrentSettings,
  } from 'src/settings/settings';
  import NumberInputSetting from 'src/applications/sheet-settings/parts/NumberInputSetting.svelte';
  import SelectSetting from '../parts/SelectSetting.svelte';

  let context = getContext<Writable<CurrentSettings>>('context');

  const userIsGm = FoundryAdapter.userIsGm();
  const localize = FoundryAdapter.localize;
</script>

<h2>{localize('T5EK.Settings.TabVehicles.header')}</h2>
{#if userIsGm}
  <SelectSetting
    options={SettingsProvider.settings.defaultVehicleSheetTab.options.choices()}
    bind:value={$context.defaultVehicleSheetTab}
    name={SettingsProvider.settings.defaultVehicleSheetTab.options.name}
    hint={SettingsProvider.settings.defaultVehicleSheetTab.options.hint}
    id="defaultVehicleSheetTab"
  />
{/if}

<CheckboxSetting
  bind:value={$context.useClassicControlsForVehicle}
  name={SettingsProvider.settings.useClassicControlsForVehicle.options.name}
  hint={SettingsProvider.settings.useClassicControlsForVehicle.options.hint}
  id="useClassicControlsForVehicle"
/>

<CheckboxSetting
  bind:value={$context.useHpBarVehicle}
  name={'T5EK.Settings.UseHpBar.name'}
  hint={'T5EK.Settings.UseHpBar.hint'}
  id="useHpBarVehicle"
/>

<CheckboxSetting
  bind:value={$context.useHpOverlayVehicle}
  name={'T5EK.Settings.UseHpOverlay.name'}
  hint={'T5EK.Settings.UseHpOverlay.hint'}
  id="useHpOverlayVehicle"
/>

<NumberInputSetting
  bind:value={$context.vehicleSheetWidth}
  name={'T5EK.Settings.VehicleSheetWidth.name'}
  hint={'T5EK.Settings.VehicleSheetWidth.hint'}
  id="vehicleSheetWidth"
/>
