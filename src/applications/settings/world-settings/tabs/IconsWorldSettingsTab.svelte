<script lang="ts">
  import { SettingsProvider } from 'src/settings/settings.svelte';
  import CheckboxSetting from '../../parts/CheckboxSetting.svelte';
  import { getContext } from 'svelte';
  import type { WorldSettingsContext } from '../WorldSettings.types';
  import { CONSTANTS } from 'src/constants';

  const context = getContext<WorldSettingsContext>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
</script>

<div class="settings-form">
  <CheckboxSetting
    bind:value={context.settings.useTidySpellSchoolIcons}
    name={SettingsProvider.settings.useTidySpellSchoolIcons.options.name}
    hint={SettingsProvider.settings.useTidySpellSchoolIcons.options.hint}
    id="useTidySpellSchoolIcons"
  />
</div>
