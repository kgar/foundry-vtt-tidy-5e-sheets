<script lang="ts">
  import { getContext } from 'svelte';
  import { SettingsProvider } from 'src/settings/settings.svelte';
  import type { UserSettingsContext } from '../UserSettings.types';
  import { CONSTANTS } from 'src/constants';
  import SelectSetting from '../../parts/SelectSetting.svelte';

  let context = getContext<UserSettingsContext>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
</script>

<SelectSetting
  options={SettingsProvider.settings.inlineActivitiesPosition.options.choices}
  bind:value={context.settings.inlineActivitiesPosition}
  name={SettingsProvider.settings.inlineActivitiesPosition.options.name}
  hint={SettingsProvider.settings.inlineActivitiesPosition.options.hint}
  id="inlineActivitiesPosition"
/>
