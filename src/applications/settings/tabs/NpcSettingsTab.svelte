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
  } from '../SheetSettings.types';
  import ListboxSetting from '../parts/ListboxSetting.svelte';
  import { CONSTANTS } from 'src/constants';

  let context = getContext<Writable<SettingsSheetContext>>('context');
  let functions = getContext<SettingsSheetFunctions>('functions');

  const userIsGm = FoundryAdapter.userIsGm();
  const localize = FoundryAdapter.localize;
</script>

<h2>{localize('TIDY5E.Settings.TabNPCs.header')}</h2>
{#if userIsGm}
  <SelectSetting
    options={SettingsProvider.settings.initialNpcSheetTab.options.choices()}
    bind:value={$context.settings.initialNpcSheetTab}
    name={SettingsProvider.settings.initialNpcSheetTab.options.name}
    hint={SettingsProvider.settings.initialNpcSheetTab.options.hint}
    id="initialNpcSheetTab"
  />

  <ListboxSetting
    name={SettingsProvider.settings.defaultNpcSheetTabs.options.name}
    hint={SettingsProvider.settings.defaultNpcSheetTabs.options.hint}
    leftHeader="TIDY5E.Settings.DefaultSheetTabs.AvailableHeader"
    bind:leftItems={$context.defaultNpcTabs.available}
    rightHeader="TIDY5E.Settings.DefaultSheetTabs.SelectedHeader"
    bind:rightItems={$context.defaultNpcTabs.selected}
    labelProp="label"
    valueProp="id"
  >
    <div slot="below-listbox">
      <button
        type="button"
        on:click={() =>
          functions.resetDefaultTabs(context, CONSTANTS.SHEET_TYPE_NPC)}
      >
        <i class="fas fa-rotate-right" />
        {localize('TIDY5E.Reset')}
      </button>
    </div>
  </ListboxSetting>
{/if}

<CheckboxSetting
  bind:value={$context.settings.useClassicControlsForNpc}
  name={SettingsProvider.settings.useClassicControlsForNpc.options.name}
  hint={SettingsProvider.settings.useClassicControlsForNpc.options.hint}
  id="useClassicControlsForNpc"
/>

{#if userIsGm}
  <CheckboxSetting
    bind:value={$context.settings.useNpcRest}
    name={'TIDY5E.Settings.UseNPCRest.name'}
    hint={'TIDY5E.Settings.UseNPCRest.hint'}
    id="useNpcRest"
  />

  <CheckboxSetting
    bind:value={$context.settings.showNpcRestInChat}
    name={'TIDY5E.Settings.ShowNPCRestInChat.name'}
    hint={'TIDY5E.Settings.ShowNPCRestInChat.hint'}
    id="showNpcRestInChat"
  />

  <SelectSetting
    options={{
      default: 'TIDY5E.Settings.ShowNPCActorLinkMarker.default',
      unlinked: 'TIDY5E.Settings.ShowNPCActorLinkMarker.unlinked',
      both: 'TIDY5E.Settings.ShowNPCActorLinkMarker.both',
    }}
    bind:value={$context.settings.showNpcActorLinkMarker}
    name="TIDY5E.Settings.ShowNPCActorLinkMarker.name"
    hint="TIDY5E.Settings.ShowNPCActorLinkMarker.hint"
    id="showNpcActorLinkMarker"
  />
{/if}

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
