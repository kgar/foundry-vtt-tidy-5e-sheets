<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import CheckboxSetting from 'src/applications/settings/parts/CheckboxSetting.svelte';
  import { getContext } from 'svelte';
  import { SettingsProvider } from 'src/settings/settings';
  import SelectSetting from 'src/applications/settings/parts/SelectSetting.svelte';
  import type {
    WorldSettingsContextStore,
    WorldSettingsFunctions,
  } from '../WorldSettings.types';
  import ListboxSetting from '../../parts/ListboxSetting.svelte';
  import { CONSTANTS } from 'src/constants';

  const context = getContext<WorldSettingsContextStore>(CONSTANTS.SVELTE_CONTEXT.CONTEXT);
  let functions = getContext<WorldSettingsFunctions>(CONSTANTS.SVELTE_CONTEXT.FUNCTIONS);

  const localize = FoundryAdapter.localize;
</script>

<div class="settings-form">
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

  <CheckboxSetting
    bind:value={$context.settings.useNpcEncumbranceBar}
    name={SettingsProvider.settings.useNpcEncumbranceBar.options.name}
    hint={SettingsProvider.settings.useNpcEncumbranceBar.options.hint}
    id="useNpcEncumbranceBar"
  />
</div>

<style lang="scss">
</style>
