<script lang="ts">
  import { getContext } from 'svelte';
  import { SettingsProvider } from 'src/settings/settings';
  import SelectSetting from 'src/applications/settings/parts/SelectSetting.svelte';
  import type { WorldSettingsContextStore } from '../WorldSettings.types';
  import CheckboxSetting from '../../parts/CheckboxSetting.svelte';

  const context = getContext<WorldSettingsContextStore>('context');
</script>

<div class="settings-form">
  <SelectSetting
    options={SettingsProvider.settings.itemIdentificationPermission.options
      .choices}
    bind:value={$context.settings.itemIdentificationPermission}
    name={SettingsProvider.settings.itemIdentificationPermission.options.name}
    hint={SettingsProvider.settings.itemIdentificationPermission.options.hint}
    id="initialCharacterSheetTab"
  />

  <CheckboxSetting
    name={SettingsProvider.settings.includeFlagsInSpellScrollCreation.options
      .name}
    hint={SettingsProvider.settings.includeFlagsInSpellScrollCreation.options
      .hint}
    bind:value={$context.settings.includeFlagsInSpellScrollCreation}
    id="includeFlagsInSpellScrollCreation"
  />
</div>
