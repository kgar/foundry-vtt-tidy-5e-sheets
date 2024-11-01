<script lang="ts">
  import { getContext } from 'svelte';
  import { SettingsProvider } from 'src/settings/settings';
  import SelectSetting from 'src/applications/settings/parts/SelectSetting.svelte';
  import type { WorldSettingsContextStore } from '../WorldSettings.types';
  import CheckboxSetting from '../../parts/CheckboxSetting.svelte';
  import { CONSTANTS } from 'src/constants';

  const context = getContext<WorldSettingsContextStore>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
</script>

<div class="settings-form">
  <CheckboxSetting
    name={SettingsProvider.settings.includeTidySectionFieldsInDefaultSheets
      .options.name}
    hint={SettingsProvider.settings.includeTidySectionFieldsInDefaultSheets
      .options.hint}
    bind:value={$context.settings.includeTidySectionFieldsInDefaultSheets}
    id="includeTidySectionFieldsInDefaultSheets"
  />

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
