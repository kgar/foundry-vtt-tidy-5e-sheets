<script lang="ts">
    import { FoundryAdapter } from 'src/foundry/foundry-adapter';
    import { getContext } from 'svelte';
    import { SettingsProvider } from 'src/settings/settings';
    import SelectSetting from 'src/applications/settings/parts/SelectSetting.svelte';
    import type {
      WorldSettingsContextStore,
      WorldSettingsFunctions,
    } from '../WorldSettings.types';
  
    const context = getContext<WorldSettingsContextStore>('context');
  
    const localize = FoundryAdapter.localize;
  </script>

<div class="settings-form">
  <SelectSetting
    options={SettingsProvider.settings.itemIdentificationPermission.options.choices}
    bind:value={$context.settings.itemIdentificationPermission}
    name={SettingsProvider.settings.itemIdentificationPermission.options.name}
    hint={SettingsProvider.settings.itemIdentificationPermission.options.hint}
    id="initialCharacterSheetTab"
  />
</div>
