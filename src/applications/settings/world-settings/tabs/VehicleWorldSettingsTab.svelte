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
  <CheckboxSetting
    bind:value={context.settings.useVehicleEncumbranceBar}
    name={SettingsProvider.settings.useVehicleEncumbranceBar.options.name}
    hint={SettingsProvider.settings.useVehicleEncumbranceBar.options.hint}
    id="useVehicleEncumbranceBar"
  />

  <CheckboxSetting
    bind:value={context.settings.useVehicleMotion}
    name={'TIDY5E.Settings.UseVehicleMotion.name'}
    hint={'TIDY5E.Settings.UseVehicleMotion.hint'}
    id="useVehicleMotion"
  />
</div>

<style lang="less">
</style>
