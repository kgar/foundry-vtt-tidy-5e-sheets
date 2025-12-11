<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import CheckboxSetting from 'src/applications/settings/parts/CheckboxSetting.svelte';
  import { getContext } from 'svelte';
  import { SettingsProvider } from 'src/settings/settings.svelte';
  import type {
    WorldSettingsContext,
    WorldSettingsFunctions,
  } from '../WorldSettings.types';
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
