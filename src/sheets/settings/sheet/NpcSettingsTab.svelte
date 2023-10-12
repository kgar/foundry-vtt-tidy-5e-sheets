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

  let store = getContext<Writable<CurrentSettings>>('store');
  const appId = getContext<string>('appId');

  const userIsGm = FoundryAdapter.userIsGm();
  const localize = FoundryAdapter.localize;
</script>

<h2>{localize('T5EK.Settings.TabNPCs.labelNPCs')}</h2>
<CheckboxSetting
  bind:value={$store.journalTabNPCDisabled}
  name={'T5EK.Settings.JournalTabNPCDisabled.name'}
  hint={'T5EK.Settings.JournalTabNPCDisabled.hint'}
  id="journalTabNPCDisabled"
/>

{#if userIsGm}
  <CheckboxSetting
    bind:value={$store.restingForNpcsEnabled}
    name={'T5EK.Settings.RestingForNpcs.name'}
    hint={'T5EK.Settings.RestingForNpcs.hint'}
    id="restingForNpcsEnabled"
  />

  <CheckboxSetting
    bind:value={$store.restingForNpcsChatDisabled}
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
    bind:value={$store.linkMarkerNpc}
    name="T5EK.Settings.LinkMarker.name"
    hint="T5EK.Settings.LinkMarker.hint"
    id="linkMarkerNpc"
  />
{/if}

<CheckboxSetting
  bind:value={$store.hpBarDisabledNpc}
  name={'T5EK.Settings.HpBar.name'}
  hint={'T5EK.Settings.HpBar.hint'}
  id="hpBarDisabledNpc"
/>

<CheckboxSetting
  bind:value={$store.hpOverlayDisabledNpc}
  name={'T5EK.Settings.HpOverlay.name'}
  hint={'T5EK.Settings.HpOverlay.hint'}
  id="hpOverlayDisabledNpc"
/>

<CheckboxSetting
  bind:value={$store.traitsAlwaysShownNpc}
  name={'T5EK.Settings.TraitsAlwaysShown.name'}
  hint={'T5EK.Settings.TraitsAlwaysShown.hint'}
  id="traitsAlwaysShownNpc"
/>

<CheckboxSetting
  bind:value={$store.traitsMovedBelowResourceNpc}
  name={'T5EK.Settings.TraitsMovedBelowResource.name'}
  hint={'T5EK.Settings.TraitsMovedBelowResource.hint'}
  id="traitsMovedBelowResourceNpc"
/>

<CheckboxSetting
  bind:value={$store.skillsAlwaysShownNpc}
  name={'T5EK.Settings.SkillsAlwaysShown.name'}
  hint={'T5EK.Settings.SkillsAlwaysShown.hint'}
  id="skillsAlwaysShownNpc"
/>

<CheckboxSetting
  bind:value={$store.hideSpellbookTabNpc}
  name={'T5EK.Settings.HideSpellbookTabNpc.name'}
  hint={'T5EK.Settings.HideSpellbookTabNpc.hint'}
  id="hideSpellbookTabNpc"
/>

<NumberInputSetting
  bind:value={$store.npcSheetWidth}
  name={'T5EK.Settings.npcSheetWidth.name'}
  hint={'T5EK.Settings.npcSheetWidth.hint'}
  id="npcSheetWidth"
/>
