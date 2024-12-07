<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import CheckboxSetting from 'src/applications/settings/parts/CheckboxSetting.svelte';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import { SettingsProvider } from 'src/settings/settings.svelte';
  import type { UserSettingsContext } from '../UserSettings.types';
  import { CONSTANTS } from 'src/constants';

  let context = getContext<Writable<UserSettingsContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;
</script>

<h2>{localize('TIDY5E.UserSettings.TabNPCs.header')}</h2>

<CheckboxSetting
  bind:value={$context.settings.useClassicControlsForNpc}
  name={SettingsProvider.settings.useClassicControlsForNpc.options.name}
  hint={SettingsProvider.settings.useClassicControlsForNpc.options.hint}
  id="useClassicControlsForNpc"
/>

<CheckboxSetting
  bind:value={$context.settings.useHpBarNpc}
  name={SettingsProvider.settings.useHpBarNpc.options.name}
  hint={SettingsProvider.settings.useHpBarNpc.options.hint}
  id="useHpBarNpc"
/>

<CheckboxSetting
  bind:value={$context.settings.useHpOverlayNpc}
  name={SettingsProvider.settings.useHpOverlayNpc.options.name}
  hint={SettingsProvider.settings.useHpOverlayNpc.options.hint}
  id="useHpOverlayNpc"
/>

<CheckboxSetting
  bind:value={$context.settings.alwaysShowNpcTraits}
  name={SettingsProvider.settings.alwaysShowNpcTraits.options.name}
  hint={SettingsProvider.settings.alwaysShowNpcTraits.options.hint}
  id="alwaysShowNpcTraits"
/>

<CheckboxSetting
  bind:value={$context.settings.moveTraitsBelowNpcResources}
  name={SettingsProvider.settings.moveTraitsBelowNpcResources.options.name}
  hint={SettingsProvider.settings.moveTraitsBelowNpcResources.options.hint}
  id="moveTraitsBelowNpcResources"
/>

<CheckboxSetting
  bind:value={$context.settings.alwaysShowNpcSkills}
  name={SettingsProvider.settings.alwaysShowNpcSkills.options.name}
  hint={SettingsProvider.settings.alwaysShowNpcSkills.options.hint}
  id="alwaysShowNpcSkills"
/>

<CheckboxSetting
  bind:value={$context.settings.showSpellbookTabNpc}
  name={SettingsProvider.settings.showSpellbookTabNpc.options.name}
  hint={SettingsProvider.settings.showSpellbookTabNpc.options.hint}
  id="showSpellbookTabNpc"
/>
