<script lang="ts">
  import { SettingsProvider } from 'src/settings/settings';
  import CheckboxSetting from '../../parts/CheckboxSetting.svelte';
  import { getContext } from 'svelte';
  import type { WorldSettingsContextStore } from '../WorldSettings.types';

  const context = getContext<WorldSettingsContextStore>('context');
</script>

<div class="settings-form">
  <CheckboxSetting
    bind:value={$context.settings.useTidySpellSchoolIcons}
    name={SettingsProvider.settings.useTidySpellSchoolIcons.options.name}
    hint={SettingsProvider.settings.useTidySpellSchoolIcons.options.hint}
    id="useTidySpellSchoolIcons"
  />
</div>
