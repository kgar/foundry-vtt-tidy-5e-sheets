<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import CheckboxSetting from 'src/applications/settings/parts/CheckboxSetting.svelte';
  import { getContext } from 'svelte';
  import { SettingsProvider } from 'src/settings/settings.svelte';
  import type { UserSettingsContext } from '../UserSettings.types';
  import { CONSTANTS } from 'src/constants';

  let context = getContext<UserSettingsContext>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
  const localize = FoundryAdapter.localize;
</script>

<h2>{localize('TIDY5E.UserSettings.TabVehicles.header')}</h2>

<CheckboxSetting
  bind:value={context.settings.useClassicControlsForVehicle}
  name={SettingsProvider.settings.useClassicControlsForVehicle.options.name}
  hint={SettingsProvider.settings.useClassicControlsForVehicle.options.hint}
  id="useClassicControlsForVehicle"
/>

<CheckboxSetting
  bind:value={context.settings.useHpBarVehicle}
  name={SettingsProvider.settings.useHpBarVehicle.options.name}
  hint={SettingsProvider.settings.useHpBarVehicle.options.hint}
  id="useHpBarVehicle"
/>

<CheckboxSetting
  bind:value={context.settings.useHpOverlayVehicle}
  name={SettingsProvider.settings.useHpOverlayVehicle.options.name}
  hint={SettingsProvider.settings.useHpOverlayVehicle.options.hint}
  id="useHpOverlayVehicle"
/>
