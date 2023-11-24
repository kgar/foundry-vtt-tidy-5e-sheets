<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import CheckboxSetting from 'src/applications/sheet-settings/parts/CheckboxSetting.svelte';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import { SettingsProvider } from 'src/settings/settings';
  import TextInputSetting from 'src/applications/sheet-settings/parts/TextInputSetting.svelte';
  import SelectSetting from 'src/applications/sheet-settings/parts/SelectSetting.svelte';
  import type { SettingsSheetContext } from '../SheetSettings.types';

  let context = getContext<Writable<SettingsSheetContext>>('context');

  const userIsGm = FoundryAdapter.userIsGm();
  const localize = FoundryAdapter.localize;
</script>

{#if userIsGm}
  <h2>{localize('T5EK.Settings.TabGM.header')}</h2>

  <CheckboxSetting
    bind:value={$context.settings.hideDeathSavesFromPlayers}
    name={'T5EK.Settings.HideDeathSavesFromPlayers.name'}
    hint={'T5EK.Settings.HideDeathSavesFromPlayers.hint'}
    id="hideDeathSavesFromPlayers"
  />

  <CheckboxSetting
    bind:value={$context.settings.useSpellSlotMarker}
    name={'T5EK.Settings.UseSpellSlotMarker.name'}
    hint={'T5EK.Settings.UseSpellSlotMarker.hint'}
    id="useSpellSlotMarker"
  />

  <CheckboxSetting
    bind:value={$context.settings.useCharacterEncumbranceBar}
    name={SettingsProvider.settings.useCharacterEncumbranceBar.options.name}
    hint={SettingsProvider.settings.useCharacterEncumbranceBar.options.hint}
    id="useCharacterEncumbranceBar"
  />

  <CheckboxSetting
    bind:value={$context.settings.useNpcEncumbranceBar}
    name={SettingsProvider.settings.useNpcEncumbranceBar.options.name}
    hint={SettingsProvider.settings.useNpcEncumbranceBar.options.hint}
    id="useNpcEncumbranceBar"
  />

  <CheckboxSetting
    bind:value={$context.settings.useVehicleEncumbranceBar}
    name={SettingsProvider.settings.useVehicleEncumbranceBar.options.name}
    hint={SettingsProvider.settings.useVehicleEncumbranceBar.options.hint}
    id="useVehicleEncumbranceBar"
  />

  <CheckboxSetting
    bind:value={$context.settings.showPlayerName}
    name={'T5EK.Settings.ShowPlayerName.name'}
    hint={'T5EK.Settings.ShowPlayerName.hint'}
    id="showPlayerName"
  />

  <CheckboxSetting
    bind:value={$context.settings.showExpandedLimitedView}
    name={'T5EK.Settings.ShowExpandedLimitedView.name'}
    hint={'T5EK.Settings.ShowExpandedLimitedView.hint'}
    id="showExpandedLimitedView"
  />

  <TextInputSetting
    bind:value={$context.settings.itemCardsFixKey}
    name={'T5EK.Settings.ItemCardsFixKey.name'}
    hint={'T5EK.Settings.ItemCardsFixKey.hint'}
    id="itemCardsFixKey"
  />

  <SelectSetting
    options={SettingsProvider.settings.useCircularPortraitStyle.options.choices}
    bind:value={$context.settings.useCircularPortraitStyle}
    name={'T5EK.Settings.UseCircularPortraitStyle.name'}
    hint={'T5EK.Settings.UseCircularPortraitStyle.hint'}
    id="useCircularPortraitStyle"
  />

  <CheckboxSetting
    bind:value={$context.settings.permanentlyUnlockCharacterSheetForGm}
    name={'T5EK.Settings.PermanentlyUnlockCharacterSheetForGM.name'}
    hint={'T5EK.Settings.PermanentlyUnlockCharacterSheetForGM.hint'}
    id="permanentlyUnlockCharacterSheetForGm"
  />

  <CheckboxSetting
    bind:value={$context.settings.permanentlyUnlockNpcSheetForGm}
    name={'T5EK.Settings.PermanentlyUnlockNPCSheetForGM.name'}
    hint={'T5EK.Settings.PermanentlyUnlockNPCSheetForGM.hint'}
    id="permanentlyUnlockNpcSheetForGm"
  />

  <CheckboxSetting
    bind:value={$context.settings.permanentlyUnlockVehicleSheetForGm}
    name={'T5EK.Settings.PermanentlyUnlockVehicleSheetForGM.name'}
    hint={'T5EK.Settings.PermanentlyUnlockVehicleSheetForGM.hint'}
    id="permanentlyUnlockVehicleSheetForGm"
  />

  <CheckboxSetting
    bind:value={$context.settings.limitEffectsManagementToGm}
    name={'T5EK.Settings.LimitEffectsManagementToGM.name'}
    hint={'T5EK.Settings.LimitEffectsManagementToGM.hint'}
    id="limitEffectsManagementToGm"
  />

  <CheckboxSetting
    bind:value={$context.settings.alwaysShowItemQuantity}
    name={'T5EK.Settings.AlwaysShowItemQuantity.name'}
    hint={'T5EK.Settings.AlwaysShowItemQuantity.hint'}
    id="alwaysShowItemQuantity"
  />

  <CheckboxSetting
    bind:value={$context.settings.useCharacterInspiration}
    name={'T5EK.Settings.UseInspiration.name'}
    hint={'T5EK.Settings.UseInspiration.hint'}
    id="useCharacterInspiration"
  />

  <CheckboxSetting
    bind:value={$context.settings.useVehicleMotion}
    name={'T5EK.Settings.UseVehicleMotion.name'}
    hint={'T5EK.Settings.UseVehicleMotion.hint'}
    id="useVehicleMotion"
  />

  <CheckboxSetting
    bind:value={$context.settings.useExhaustion}
    name={'T5EK.Settings.UseExhaustion.name'}
    hint={'T5EK.Settings.UseExhaustion.hint'}
    id="useExhaustion"
  />

  <CheckboxSetting
    bind:value={$context.settings.showTraitLabels}
    name={'T5EK.Settings.ShowTraitLabels.name'}
    hint={'T5EK.Settings.ShowTraitLabels.hint'}
    id="showTraitLabels"
  />

  <CheckboxSetting
    bind:value={$context.settings.allowCantripsToBePrepared}
    name={'T5EK.Settings.AllowCantripsToBePrepared.name'}
    hint={'T5EK.Settings.AllowCantripsToBePrepared.hint'}
    id="allowCantripsToBePrepared"
  />

  <CheckboxSetting
    bind:value={$context.settings.allowHpMaxOverride}
    name={'T5EK.Settings.AllowHpMaxOverride.name'}
    hint={'T5EK.Settings.AllowHpMaxOverride.hint'}
    id="allowHpMaxOverride"
  />

  <CheckboxSetting
    bind:value={$context.settings.showActiveEffectsMarker}
    name={'T5EK.Settings.ShowActiveEffectsMarker.name'}
    hint={'T5EK.Settings.ShowActiveEffectsMarker.hint'}
    id="showActiveEffectsMarker"
  />
{/if}
