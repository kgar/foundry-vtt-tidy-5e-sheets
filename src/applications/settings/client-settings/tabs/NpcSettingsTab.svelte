<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import CheckboxSetting from 'src/applications/settings/parts/CheckboxSetting.svelte';
  import NumberInputSetting from 'src/applications/settings/parts/NumberInputSetting.svelte';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import { SettingsProvider } from 'src/settings/settings';
  import SelectSetting from 'src/applications/settings/parts/SelectSetting.svelte';
  import type {
    SettingsSheetContext,
    SettingsSheetFunctions,
  } from '../ClientSettings.types';
  

  let context = getContext<Writable<SettingsSheetContext>>('context');
  let functions = getContext<SettingsSheetFunctions>('functions');

    const localize = FoundryAdapter.localize;
</script>

<h2>{localize('TIDY5E.Settings.TabNPCs.header')}</h2>

<CheckboxSetting
  bind:value={$context.settings.useClassicControlsForNpc}
  name={SettingsProvider.settings.useClassicControlsForNpc.options.name}
  hint={SettingsProvider.settings.useClassicControlsForNpc.options.hint}
  id="useClassicControlsForNpc"
/>

<CheckboxSetting
  bind:value={$context.settings.useHpBarNpc}
  name={'TIDY5E.Settings.UseHpBar.name'}
  hint={'TIDY5E.Settings.UseHpBar.hint'}
  id="useHpBarNpc"
/>

<CheckboxSetting
  bind:value={$context.settings.useHpOverlayNpc}
  name={'TIDY5E.Settings.UseHpOverlay.name'}
  hint={'TIDY5E.Settings.UseHpOverlay.hint'}
  id="useHpOverlayNpc"
/>

<CheckboxSetting
  bind:value={$context.settings.alwaysShowNpcTraits}
  name={'TIDY5E.Settings.AlwaysShowTraits.name'}
  hint={'TIDY5E.Settings.AlwaysShowTraits.hint'}
  id="alwaysShowNpcTraits"
/>

<CheckboxSetting
  bind:value={$context.settings.moveTraitsBelowNpcResources}
  name={'TIDY5E.Settings.MoveTraitsBelowResources.name'}
  hint={'TIDY5E.Settings.MoveTraitsBelowResources.hint'}
  id="moveTraitsBelowNpcResources"
/>

<CheckboxSetting
  bind:value={$context.settings.alwaysShowNpcSkills}
  name={'TIDY5E.Settings.AlwaysShowSkills.name'}
  hint={'TIDY5E.Settings.AlwaysShowSkills.hint'}
  id="alwaysShowNpcSkills"
/>

<CheckboxSetting
  bind:value={$context.settings.showSpellbookTabNpc}
  name={'TIDY5E.Settings.ShowNPCSpellbookTab.name'}
  hint={'TIDY5E.Settings.ShowNPCSpellbookTab.hint'}
  id="showSpellbookTabNpc"
/>

<NumberInputSetting
  bind:value={$context.settings.npcSheetWidth}
  name={'TIDY5E.Settings.NPCSheetWidth.name'}
  hint={'TIDY5E.Settings.NPCSheetWidth.hint'}
  id="npcSheetWidth"
/>
