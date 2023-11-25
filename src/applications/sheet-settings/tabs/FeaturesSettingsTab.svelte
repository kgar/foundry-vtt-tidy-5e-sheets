<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import {
    SettingsProvider,
    type CurrentSettings,
  } from 'src/settings/settings';
  import CheckboxSetting from '../parts/CheckboxSetting.svelte';

  let context = getContext<Writable<CurrentSettings>>('context');

  const localize = FoundryAdapter.localize;
</script>

<h2>{localize('T5EK.Settings.ActionsList.Header')}</h2>

<CheckboxSetting
  bind:value={$context.actionListLimitActionsToCantrips}
  name={SettingsProvider.settings.actionListLimitActionsToCantrips.options.name}
  hint={SettingsProvider.settings.actionListLimitActionsToCantrips.options.hint}
  id="actionListLimitActionsToCantrips"
/>

<CheckboxSetting
  bind:value={$context.actionListIncludeMinuteLongSpellsAsActions}
  name={SettingsProvider.settings.actionListIncludeMinuteLongSpellsAsActions
    .options.name}
  hint={SettingsProvider.settings.actionListIncludeMinuteLongSpellsAsActions
    .options.hint}
  id="actionListIncludeMinuteLongSpellsAsActions"
/>

<CheckboxSetting
  bind:value={$context.actionListIncludeSpellsWithActiveEffects}
  name={SettingsProvider.settings.actionListIncludeSpellsWithActiveEffects
    .options.name}
  hint={SettingsProvider.settings.actionListIncludeSpellsWithActiveEffects
    .options.hint}
  id="actionListIncludeSpellsWithActiveEffects"
/>

<CheckboxSetting
  bind:value={$context.actionListIncludeConsumables}
  name={SettingsProvider.settings.actionListIncludeConsumables.options.name}
  hint={SettingsProvider.settings.actionListIncludeConsumables.options.hint}
  id="actionListIncludeConsumables"
/>
