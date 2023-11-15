<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import CheckboxSetting from 'src/sheets/settings/parts/CheckboxSetting.svelte';
  import NumberInputSetting from 'src/sheets/settings/parts/NumberInputSetting.svelte';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import {
    SettingsProvider,
    type CurrentSettings,
  } from 'src/settings/settings';
  import SelectSetting from 'src/sheets/settings/parts/SelectSetting.svelte';

  let context = getContext<Writable<CurrentSettings>>('context');
  const appId = getContext<string>('appId');

  const userIsGm = FoundryAdapter.userIsGm();
  const localize = FoundryAdapter.localize;
</script>

<h2>{localize('T5EK.Settings.TabNPCs.header')}</h2>
{#if userIsGm}
  <SelectSetting
    options={SettingsProvider.settings.defaultNpcSheetTab.options.choices()}
    bind:value={$context.defaultNpcSheetTab}
    name={SettingsProvider.settings.defaultNpcSheetTab.options.name}
    hint={SettingsProvider.settings.defaultNpcSheetTab.options.hint}
    id="defaultNpcSheetTab"
  />
{/if}

<CheckboxSetting
  bind:value={$context.useClassicControlsForNpc}
  name={SettingsProvider.settings.useClassicControlsForNpc.options.name}
  hint={SettingsProvider.settings.useClassicControlsForNpc.options.hint}
  id="useClassicControlsForNpc"
/>

<CheckboxSetting
  bind:value={$context.useJournalTabForNpc}
  name={'T5EK.Settings.UseJournalTabForNPC.name'}
  hint={'T5EK.Settings.UseJournalTabForNPC.hint'}
  id="useJournalTabForNpc"
/>

{#if userIsGm}
  <CheckboxSetting
    bind:value={$context.useNpcRest}
    name={'T5EK.Settings.UseNPCRest.name'}
    hint={'T5EK.Settings.UseNPCRest.hint'}
    id="useNpcRest"
  />

  <CheckboxSetting
    bind:value={$context.showNpcRestInChat}
    name={'T5EK.Settings.ShowNPCRestInChat.name'}
    hint={'T5EK.Settings.ShowNPCRestInChat.hint'}
    id="showNpcRestInChat"
  />

  <SelectSetting
    options={{
      default: 'T5EK.Settings.ShowNPCActorLinkMarker.default',
      unlinked: 'T5EK.Settings.ShowNPCActorLinkMarker.unlinked',
      both: 'T5EK.Settings.ShowNPCActorLinkMarker.both',
    }}
    bind:value={$context.showNpcActorLinkMarker}
    name="T5EK.Settings.ShowNPCActorLinkMarker.name"
    hint="T5EK.Settings.ShowNPCActorLinkMarker.hint"
    id="showNpcActorLinkMarker"
  />
{/if}

<CheckboxSetting
  bind:value={$context.useHpBarNpc}
  name={'T5EK.Settings.UseHpBar.name'}
  hint={'T5EK.Settings.UseHpBar.hint'}
  id="useHpBarNpc"
/>

<CheckboxSetting
  bind:value={$context.useHpOverlayNpc}
  name={'T5EK.Settings.UseHpOverlay.name'}
  hint={'T5EK.Settings.UseHpOverlay.hint'}
  id="useHpOverlayNpc"
/>

<CheckboxSetting
  bind:value={$context.alwaysShowNpcTraits}
  name={'T5EK.Settings.AlwaysShowTraits.name'}
  hint={'T5EK.Settings.AlwaysShowTraits.hint'}
  id="alwaysShowNpcTraits"
/>

<CheckboxSetting
  bind:value={$context.moveTraitsBelowNpcResources}
  name={'T5EK.Settings.MoveTraitsBelowResources.name'}
  hint={'T5EK.Settings.MoveTraitsBelowResources.hint'}
  id="moveTraitsBelowNpcResources"
/>

<CheckboxSetting
  bind:value={$context.alwaysShowNpcSkills}
  name={'T5EK.Settings.AlwaysShowSkills.name'}
  hint={'T5EK.Settings.AlwaysShowSkills.hint'}
  id="alwaysShowNpcSkills"
/>

<CheckboxSetting
  bind:value={$context.showSpellbookTabNpc}
  name={'T5EK.Settings.ShowNPCSpellbookTab.name'}
  hint={'T5EK.Settings.ShowNPCSpellbookTab.hint'}
  id="showSpellbookTabNpc"
/>

<NumberInputSetting
  bind:value={$context.npcSheetWidth}
  name={'T5EK.Settings.NPCSheetWidth.name'}
  hint={'T5EK.Settings.NPCSheetWidth.hint'}
  id="npcSheetWidth"
/>
