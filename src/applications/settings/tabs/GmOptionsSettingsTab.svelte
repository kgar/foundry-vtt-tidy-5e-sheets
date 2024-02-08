<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import CheckboxSetting from 'src/applications/settings/parts/CheckboxSetting.svelte';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import { SettingsProvider } from 'src/settings/settings';
  import TextInputSetting from 'src/applications/settings/parts/TextInputSetting.svelte';
  import SelectSetting from 'src/applications/settings/parts/SelectSetting.svelte';
  import type { SettingsSheetContext } from '../SheetSettings.types';

  let context = getContext<Writable<SettingsSheetContext>>('context');

  const userIsGm = FoundryAdapter.userIsGm();
  const localize = FoundryAdapter.localize;
</script>

{#if userIsGm}
  <h2>{localize('TIDY5E.Settings.TabGM.header')}</h2>

  <CheckboxSetting
    bind:value={$context.settings.hideDeathSavesFromPlayers}
    name={'TIDY5E.Settings.HideDeathSavesFromPlayers.name'}
    hint={'TIDY5E.Settings.HideDeathSavesFromPlayers.hint'}
    id="hideDeathSavesFromPlayers"
  />

  <CheckboxSetting
    bind:value={$context.settings.useSpellSlotMarker}
    name={'TIDY5E.Settings.UseSpellSlotMarker.name'}
    hint={'TIDY5E.Settings.UseSpellSlotMarker.hint'}
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
    name={'TIDY5E.Settings.ShowPlayerName.name'}
    hint={'TIDY5E.Settings.ShowPlayerName.hint'}
    id="showPlayerName"
  />

  <CheckboxSetting
    bind:value={$context.settings.sortFavoriteItemsAlphabetically}
    name={'TIDY5E.Settings.SortFavoriteItemsAlphabetically.name'}
    hint={'TIDY5E.Settings.SortFavoriteItemsAlphabetically.hint'}
    id="sortFavoriteItemsAlphabetically"
  />

  <CheckboxSetting
    bind:value={$context.settings.showExpandedLimitedView}
    name={'TIDY5E.Settings.ShowExpandedLimitedView.name'}
    hint={'TIDY5E.Settings.ShowExpandedLimitedView.hint'}
    id="showExpandedLimitedView"
  />

  <TextInputSetting
    bind:value={$context.settings.itemCardsFixKey}
    name={'TIDY5E.Settings.ItemCardsFixKey.name'}
    hint={'TIDY5E.Settings.ItemCardsFixKey.hint'}
    id="itemCardsFixKey"
  />

  <SelectSetting
    options={SettingsProvider.settings.useCircularPortraitStyle.options.choices}
    bind:value={$context.settings.useCircularPortraitStyle}
    name={'TIDY5E.Settings.UseCircularPortraitStyle.name'}
    hint={'TIDY5E.Settings.UseCircularPortraitStyle.hint'}
    id="useCircularPortraitStyle"
  />

  <CheckboxSetting
    bind:value={$context.settings.permanentlyUnlockCharacterSheetForGm}
    name={'TIDY5E.Settings.PermanentlyUnlockCharacterSheetForGM.name'}
    hint={'TIDY5E.Settings.PermanentlyUnlockCharacterSheetForGM.hint'}
    id="permanentlyUnlockCharacterSheetForGm"
  />

  <CheckboxSetting
    bind:value={$context.settings.permanentlyUnlockNpcSheetForGm}
    name={'TIDY5E.Settings.PermanentlyUnlockNPCSheetForGM.name'}
    hint={'TIDY5E.Settings.PermanentlyUnlockNPCSheetForGM.hint'}
    id="permanentlyUnlockNpcSheetForGm"
  />

  <CheckboxSetting
    bind:value={$context.settings.permanentlyUnlockVehicleSheetForGm}
    name={'TIDY5E.Settings.PermanentlyUnlockVehicleSheetForGM.name'}
    hint={'TIDY5E.Settings.PermanentlyUnlockVehicleSheetForGM.hint'}
    id="permanentlyUnlockVehicleSheetForGm"
  />

  <CheckboxSetting
    bind:value={$context.settings.limitEffectsManagementToGm}
    name={'TIDY5E.Settings.LimitEffectsManagementToGM.name'}
    hint={'TIDY5E.Settings.LimitEffectsManagementToGM.hint'}
    id="limitEffectsManagementToGm"
  />

  <CheckboxSetting
    bind:value={$context.settings.alwaysShowItemQuantity}
    name={'TIDY5E.Settings.AlwaysShowItemQuantity.name'}
    hint={'TIDY5E.Settings.AlwaysShowItemQuantity.hint'}
    id="alwaysShowItemQuantity"
  />

  <CheckboxSetting
    bind:value={$context.settings.useCharacterInspiration}
    name={'TIDY5E.Settings.UseInspiration.name'}
    hint={'TIDY5E.Settings.UseInspiration.hint'}
    id="useCharacterInspiration"
  />

  <CheckboxSetting
    bind:value={$context.settings.useVehicleMotion}
    name={'TIDY5E.Settings.UseVehicleMotion.name'}
    hint={'TIDY5E.Settings.UseVehicleMotion.hint'}
    id="useVehicleMotion"
  />

  <CheckboxSetting
    bind:value={$context.settings.useExhaustion}
    name={'TIDY5E.Settings.UseExhaustion.name'}
    hint={'TIDY5E.Settings.UseExhaustion.hint'}
    id="useExhaustion"
  />

  <CheckboxSetting
    bind:value={$context.settings.showTraitLabels}
    name={'TIDY5E.Settings.ShowTraitLabels.name'}
    hint={'TIDY5E.Settings.ShowTraitLabels.hint'}
    id="showTraitLabels"
  />

  <CheckboxSetting
    bind:value={$context.settings.allowCantripsToBePrepared}
    name={'TIDY5E.Settings.AllowCantripsToBePrepared.name'}
    hint={'TIDY5E.Settings.AllowCantripsToBePrepared.hint'}
    id="allowCantripsToBePrepared"
  />

  <CheckboxSetting
    bind:value={$context.settings.allowHpMaxOverride}
    name={'TIDY5E.Settings.AllowHpMaxOverride.name'}
    hint={'TIDY5E.Settings.AllowHpMaxOverride.hint'}
    id="allowHpMaxOverride"
  />

  <CheckboxSetting
    bind:value={$context.settings.showActiveEffectsMarker}
    name={'TIDY5E.Settings.ShowActiveEffectsMarker.name'}
    hint={'TIDY5E.Settings.ShowActiveEffectsMarker.hint'}
    id="showActiveEffectsMarker"
  />
{/if}
