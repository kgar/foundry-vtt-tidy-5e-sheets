<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import CheckboxSetting from 'src/applications/sheet-settings/parts/CheckboxSetting.svelte';
  import NumberInputSetting from 'src/applications/sheet-settings/parts/NumberInputSetting.svelte';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import { SettingsProvider } from 'src/settings/settings';
  import SelectSetting from 'src/applications/sheet-settings/parts/SelectSetting.svelte';
  import type {
    SettingsSheetContext,
    SettingsSheetFunctions,
  } from '../SheetSettings.types';
  import SelectionListbox from 'src/components/listbox/SelectionListbox.svelte';
  import { getAllRegisteredNpcSheetTabs } from 'src/runtime/npc-sheet-state';

  let context = getContext<Writable<SettingsSheetContext>>('context');
  let functions = getContext<SettingsSheetFunctions>('functions');

  const userIsGm = FoundryAdapter.userIsGm();
  const localize = FoundryAdapter.localize;

  function resetDefaultTabs(): any {
    $context.defaultCharacterTabs = functions.mapTabSelectionFields(
      getAllRegisteredNpcSheetTabs(),
      [...SettingsProvider.settings.defaultNpcSheetTabs.options.default],
    );
  }
</script>

<h2>{localize('T5EK.Settings.TabNPCs.header')}</h2>
{#if userIsGm}
  <SelectSetting
    options={SettingsProvider.settings.initialNpcSheetTab.options.choices()}
    bind:value={$context.settings.initialNpcSheetTab}
    name={SettingsProvider.settings.initialNpcSheetTab.options.name}
    hint={SettingsProvider.settings.initialNpcSheetTab.options.hint}
    id="initialNpcSheetTab"
  />

  <article class="setting group">
    <div class="description flex-1">
      <b
        >{localize(
          SettingsProvider.settings.defaultNpcSheetTabs.options.name,
        )}</b
      >
      <p>
        {localize(SettingsProvider.settings.defaultNpcSheetTabs.options.hint)}
      </p>
      <div class="flex-column small-gap">
        <SelectionListbox
          bind:leftItems={$context.defaultNpcTabs.available}
          bind:rightItems={$context.defaultNpcTabs.selected}
          labelProp="label"
          valueProp="id"
        >
          <b slot="left-header" class="minimal"
            >{localize('T5EK.Settings.DefaultSheetTabs.AvailableHeader')}</b
          >
          <b slot="right-header" class="minimal"
            >{localize('T5EK.Settings.DefaultSheetTabs.SelectedHeader')}</b
          >
        </SelectionListbox>
        <button type="button" on:click={() => resetDefaultTabs()}>
          <i class="fas fa-rotate-right" />
          {localize('T5EK.UseDefault')}
        </button>
      </div>
    </div>
  </article>
{/if}

<CheckboxSetting
  bind:value={$context.settings.useClassicControlsForNpc}
  name={SettingsProvider.settings.useClassicControlsForNpc.options.name}
  hint={SettingsProvider.settings.useClassicControlsForNpc.options.hint}
  id="useClassicControlsForNpc"
/>

<CheckboxSetting
  bind:value={$context.settings.useJournalTabForNpc}
  name={'T5EK.Settings.UseJournalTabForNPC.name'}
  hint={'T5EK.Settings.UseJournalTabForNPC.hint'}
  id="useJournalTabForNpc"
/>

{#if userIsGm}
  <CheckboxSetting
    bind:value={$context.settings.useNpcRest}
    name={'T5EK.Settings.UseNPCRest.name'}
    hint={'T5EK.Settings.UseNPCRest.hint'}
    id="useNpcRest"
  />

  <CheckboxSetting
    bind:value={$context.settings.showNpcRestInChat}
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
    bind:value={$context.settings.showNpcActorLinkMarker}
    name="T5EK.Settings.ShowNPCActorLinkMarker.name"
    hint="T5EK.Settings.ShowNPCActorLinkMarker.hint"
    id="showNpcActorLinkMarker"
  />
{/if}

<CheckboxSetting
  bind:value={$context.settings.useHpBarNpc}
  name={'T5EK.Settings.UseHpBar.name'}
  hint={'T5EK.Settings.UseHpBar.hint'}
  id="useHpBarNpc"
/>

<CheckboxSetting
  bind:value={$context.settings.useHpOverlayNpc}
  name={'T5EK.Settings.UseHpOverlay.name'}
  hint={'T5EK.Settings.UseHpOverlay.hint'}
  id="useHpOverlayNpc"
/>

<CheckboxSetting
  bind:value={$context.settings.alwaysShowNpcTraits}
  name={'T5EK.Settings.AlwaysShowTraits.name'}
  hint={'T5EK.Settings.AlwaysShowTraits.hint'}
  id="alwaysShowNpcTraits"
/>

<CheckboxSetting
  bind:value={$context.settings.moveTraitsBelowNpcResources}
  name={'T5EK.Settings.MoveTraitsBelowResources.name'}
  hint={'T5EK.Settings.MoveTraitsBelowResources.hint'}
  id="moveTraitsBelowNpcResources"
/>

<CheckboxSetting
  bind:value={$context.settings.alwaysShowNpcSkills}
  name={'T5EK.Settings.AlwaysShowSkills.name'}
  hint={'T5EK.Settings.AlwaysShowSkills.hint'}
  id="alwaysShowNpcSkills"
/>

<CheckboxSetting
  bind:value={$context.settings.showSpellbookTabNpc}
  name={'T5EK.Settings.ShowNPCSpellbookTab.name'}
  hint={'T5EK.Settings.ShowNPCSpellbookTab.hint'}
  id="showSpellbookTabNpc"
/>

<NumberInputSetting
  bind:value={$context.settings.npcSheetWidth}
  name={'T5EK.Settings.NPCSheetWidth.name'}
  hint={'T5EK.Settings.NPCSheetWidth.hint'}
  id="npcSheetWidth"
/>
