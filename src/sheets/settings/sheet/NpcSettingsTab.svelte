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
    bind:value={$context.restingForNpcsEnabled}
    name={'T5EK.Settings.RestingForNpcs.name'}
    hint={'T5EK.Settings.RestingForNpcs.hint'}
    id="restingForNpcsEnabled"
  />

  <CheckboxSetting
    bind:value={$context.restingForNpcsChatDisabled}
    name={'T5EK.Settings.RestingForNpcsChat.name'}
    hint={'T5EK.Settings.RestingForNpcsChat.hint'}
    id="restingForNpcsChatDisabled"
  />

  <SelectSetting
    options={{
      default: 'T5EK.Settings.LinkMarker.default',
      unlinked: 'T5EK.Settings.LinkMarker.unlinked',
      both: 'T5EK.Settings.LinkMarker.both',
    }}
    bind:value={$context.linkMarkerNpc}
    name="T5EK.Settings.LinkMarker.name"
    hint="T5EK.Settings.LinkMarker.hint"
    id="linkMarkerNpc"
  />
{/if}

<CheckboxSetting
  bind:value={$context.useHpBarNpc}
  name={'T5EK.Settings.HpBar.name'}
  hint={'T5EK.Settings.HpBar.hint'}
  id="useHpBarNpc"
/>

<CheckboxSetting
  bind:value={$context.useHpOverlayNpc}
  name={'T5EK.Settings.HpOverlay.name'}
  hint={'T5EK.Settings.HpOverlay.hint'}
  id="useHpOverlayNpc"
/>

<CheckboxSetting
  bind:value={$context.traitsAlwaysShownNpc}
  name={'T5EK.Settings.TraitsAlwaysShown.name'}
  hint={'T5EK.Settings.TraitsAlwaysShown.hint'}
  id="traitsAlwaysShownNpc"
/>

<CheckboxSetting
  bind:value={$context.traitsMovedBelowResourceNpc}
  name={'T5EK.Settings.TraitsMovedBelowResource.name'}
  hint={'T5EK.Settings.TraitsMovedBelowResource.hint'}
  id="traitsMovedBelowResourceNpc"
/>

<CheckboxSetting
  bind:value={$context.skillsAlwaysShownNpc}
  name={'T5EK.Settings.SkillsAlwaysShown.name'}
  hint={'T5EK.Settings.SkillsAlwaysShown.hint'}
  id="skillsAlwaysShownNpc"
/>

<CheckboxSetting
  bind:value={$context.showSpellbookTabNpc}
  name={'T5EK.Settings.ShowSpellbookTabNpc.name'}
  hint={'T5EK.Settings.ShowSpellbookTabNpc.hint'}
  id="showSpellbookTabNpc"
/>

<NumberInputSetting
  bind:value={$context.npcSheetWidth}
  name={'T5EK.Settings.npcSheetWidth.name'}
  hint={'T5EK.Settings.npcSheetWidth.hint'}
  id="npcSheetWidth"
/>
