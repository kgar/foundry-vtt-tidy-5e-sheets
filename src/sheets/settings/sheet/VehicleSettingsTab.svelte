<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import CheckboxSetting from 'src/sheets/settings/parts/CheckboxSetting.svelte';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import {
    SettingsProvider,
    type CurrentSettings,
  } from 'src/settings/settings';
  import NumberInputSetting from 'src/sheets/settings/parts/NumberInputSetting.svelte';
  import SelectSetting from '../parts/SelectSetting.svelte';

  let store = getContext<Writable<CurrentSettings>>('store');

  const userIsGm = FoundryAdapter.userIsGm();
  const localize = FoundryAdapter.localize;
</script>

<h2>{localize('T5EK.Settings.TabVehicles.labelVehicles')}</h2>
{#if userIsGm}
  <SelectSetting
    options={SettingsProvider.settings.defaultVehicleSheetTab.options.choices()}
    bind:value={$store.defaultVehicleSheetTab}
    name={SettingsProvider.settings.defaultVehicleSheetTab.options.name}
    hint={SettingsProvider.settings.defaultVehicleSheetTab.options.hint}
    id="defaultVehicleSheetTab"
  />
{/if}

<CheckboxSetting
  bind:value={$store.enableClassicControlsForVehicle}
  name={SettingsProvider.settings.enableClassicControlsForVehicle.options.name}
  hint={SettingsProvider.settings.enableClassicControlsForVehicle.options.hint}
  id="enableClassicControlsForVehicle"
/>

<CheckboxSetting
  bind:value={$store.hpBarDisabledVehicle}
  name={'T5EK.Settings.HpBar.name'}
  hint={'T5EK.Settings.HpBar.hint'}
  id="hpBarDisabledVehicle"
/>

<CheckboxSetting
  bind:value={$store.hpOverlayDisabledVehicle}
  name={'T5EK.Settings.HpOverlay.name'}
  hint={'T5EK.Settings.HpOverlay.hint'}
  id="hpOverlayDisabledVehicle"
/>

<NumberInputSetting
  bind:value={$store.vehicleSheetWidth}
  name={'T5EK.Settings.vehicleSheetWidth.name'}
  hint={'T5EK.Settings.vehicleSheetWidth.hint'}
  id="vehicleSheetWidth"
/>
