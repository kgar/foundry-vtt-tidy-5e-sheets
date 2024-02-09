<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import CheckboxSetting from 'src/applications/settings/parts/CheckboxSetting.svelte';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import { SettingsProvider } from 'src/settings/settings';
  import NumberInputSetting from 'src/applications/settings/parts/NumberInputSetting.svelte';
  import type { UserSettingsContext } from '../UserSettings.types';

  let context = getContext<Writable<UserSettingsContext>>('context');
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
  name={SettingsProvider.settings.useHpBarVehicle.options.name}
  hint={SettingsProvider.settings.useHpBarVehicle.options.hint}
  id="useHpBarVehicle"
/>

<CheckboxSetting
  bind:value={$context.settings.useHpOverlayVehicle}
  name={SettingsProvider.settings.useHpOverlayVehicle.options.name}
  hint={SettingsProvider.settings.useHpOverlayVehicle.options.hint}
  id="useHpOverlayVehicle"
/>

<NumberInputSetting
  bind:value={$context.settings.vehicleSheetWidth}
  name={SettingsProvider.settings.vehicleSheetWidth.options.name}
  hint={SettingsProvider.settings.vehicleSheetWidth.options.hint}
  id="vehicleSheetWidth"
/>
