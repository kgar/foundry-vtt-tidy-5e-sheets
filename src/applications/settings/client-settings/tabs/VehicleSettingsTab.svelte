<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import CheckboxSetting from 'src/applications/settings/parts/CheckboxSetting.svelte';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import { SettingsProvider } from 'src/settings/settings';
  import NumberInputSetting from 'src/applications/settings/parts/NumberInputSetting.svelte';
  import type { SettingsSheetContext } from '../ClientSettings.types';

  let context = getContext<Writable<SettingsSheetContext>>('context');
  const localize = FoundryAdapter.localize;
</script>

<h2>{localize('TIDY5E.Settings.TabVehicles.header')}</h2>

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
