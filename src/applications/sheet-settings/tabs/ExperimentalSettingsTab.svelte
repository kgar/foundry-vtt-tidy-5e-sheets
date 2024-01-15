<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import type { SettingsSheetContext } from '../SheetSettings.types';
  import { SettingsProvider } from 'src/settings/settings';
  import CheckboxSetting from '../parts/CheckboxSetting.svelte';

  let context = getContext<Writable<SettingsSheetContext>>('context');

  const localize = FoundryAdapter.localize;
</script>

<h2>{localize('T5EK.Settings.TabExperimental.tabLabel')}</h2>

<CheckboxSetting
  bind:value={$context.settings.experimentalForwardButtonKeyboardEvents}
  name={SettingsProvider.settings.experimentalForwardButtonKeyboardEvents
    .options.name}
  hint={SettingsProvider.settings.experimentalForwardButtonKeyboardEvents
    .options.hint}
  id="experimentalForwardButtonKeyboardEvents"
/>
