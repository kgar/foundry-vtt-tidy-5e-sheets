<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import { SettingsProvider } from 'src/settings/settings';
  import CheckboxSetting from '../../parts/CheckboxSetting.svelte';
  import type { SettingsSheetContext } from '../ClientSettings.types';

  let context = getContext<Writable<SettingsSheetContext>>('context');

  const localize = FoundryAdapter.localize;
</script>

<h2>{localize('TIDY5E.Settings.ActionList.Header')}</h2>

<CheckboxSetting
  bind:value={$context.settings.actionListLimitActionsToCantrips}
  name={SettingsProvider.settings.actionListLimitActionsToCantrips.options.name}
  hint={SettingsProvider.settings.actionListLimitActionsToCantrips.options.hint}
  id="actionListLimitActionsToCantrips"
/>

<CheckboxSetting
  bind:value={$context.settings.actionListIncludeMinuteLongSpellsAsActions}
  name={SettingsProvider.settings.actionListIncludeMinuteLongSpellsAsActions
    .options.name}
  hint={SettingsProvider.settings.actionListIncludeMinuteLongSpellsAsActions
    .options.hint}
  id="actionListIncludeMinuteLongSpellsAsActions"
/>

<CheckboxSetting
  bind:value={$context.settings.actionListIncludeSpellsWithActiveEffects}
  name={SettingsProvider.settings.actionListIncludeSpellsWithActiveEffects
    .options.name}
  hint={SettingsProvider.settings.actionListIncludeSpellsWithActiveEffects
    .options.hint}
  id="actionListIncludeSpellsWithActiveEffects"
/>

<CheckboxSetting
  bind:value={$context.settings.actionListIncludeConsumables}
  name={SettingsProvider.settings.actionListIncludeConsumables.options.name}
  hint={SettingsProvider.settings.actionListIncludeConsumables.options.hint}
  id="actionListIncludeConsumables"
/>

<CheckboxSetting
  bind:value={$context.settings.actionListScaleCantripDamage}
  name={SettingsProvider.settings.actionListScaleCantripDamage.options.name}
  hint={SettingsProvider.settings.actionListScaleCantripDamage.options.hint}
  id="actionListScaleCantripDamage"
/>
