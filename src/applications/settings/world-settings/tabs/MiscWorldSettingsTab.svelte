<script lang="ts">
  import CheckboxSetting from 'src/applications/settings/parts/CheckboxSetting.svelte';
  import { getContext } from 'svelte';
  import { SettingsProvider } from 'src/settings/settings.svelte';
  import SelectSetting from 'src/applications/settings/parts/SelectSetting.svelte';
  import type { WorldSettingsContext } from '../WorldSettings.types';
  import { CONSTANTS } from 'src/constants';

  const context = getContext<WorldSettingsContext>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
</script>

<SelectSetting
  options={SettingsProvider.settings.defaultDeathSaveRoll.options.choices}
  bind:value={context.settings.defaultDeathSaveRoll}
  name={'TIDY5E.Settings.DefaultDeathSaveRoll.name'}
  hint={'TIDY5E.Settings.DefaultDeathSaveRoll.hint'}
  id="defaultDeathSaveRoll"
/>


<CheckboxSetting
  bind:value={context.settings.allowCantripsToBePrepared}
  name={'TIDY5E.Settings.AllowCantripsToBePrepared.name'}
  hint={'TIDY5E.Settings.AllowCantripsToBePrepared.hint'}
  id="allowCantripsToBePrepared"
/>

