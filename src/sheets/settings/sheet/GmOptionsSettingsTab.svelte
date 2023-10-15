<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import CheckboxSetting from 'src/sheets/settings/parts/CheckboxSetting.svelte';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import {
    SettingsProvider,
    type CurrentSettings,
  } from 'src/settings/settings';
  import TextInputSetting from 'src/sheets/settings/parts/TextInputSetting.svelte';
  import SelectSetting from 'src/sheets/settings/parts/SelectSetting.svelte';

  let context = getContext<Writable<CurrentSettings>>('context');

  const userIsGm = FoundryAdapter.userIsGm();
  const localize = FoundryAdapter.localize;
</script>

{#if userIsGm}
  <h2>{localize('T5EK.Settings.TabGM.header')}</h2>

  <CheckboxSetting
    bind:value={$context.hiddenDeathSavesEnabled}
    name={'T5EK.Settings.HiddenDeathSaves.name'}
    hint={'T5EK.Settings.HiddenDeathSaves.hint'}
    id="hiddenDeathSavesEnabled"
  />

  <CheckboxSetting
    bind:value={$context.hideSpellSlotMarker}
    name={'T5EK.Settings.HideSpellSlotMarker.name'}
    hint={'T5EK.Settings.HideSpellSlotMarker.hint'}
    id="hideSpellSlotMarker"
  />

  <CheckboxSetting
    bind:value={$context.hideStandardEncumbranceBar}
    name={'T5EK.Settings.HideStandardEncumbranceBar.name'}
    hint={'T5EK.Settings.HideStandardEncumbranceBar.hint'}
    id="hideStandardEncumbranceBar"
  />

  <CheckboxSetting
    bind:value={$context.enableNpcEncumbranceBar}
    name={SettingsProvider.settings.enableNpcEncumbranceBar.options.name}
    hint={SettingsProvider.settings.enableNpcEncumbranceBar.options.hint}
    id="enableNpcEncumbranceBar"
  />

  <CheckboxSetting
    bind:value={$context.playerNameEnabled}
    name={'T5EK.Settings.PlayerName.name'}
    hint={'T5EK.Settings.PlayerName.hint'}
    id="playerNameEnabled"
  />

  <CheckboxSetting
    bind:value={$context.expandedSheetEnabled}
    name={'T5EK.Settings.ExpandedSheet.name'}
    hint={'T5EK.Settings.ExpandedSheet.hint'}
    id="expandedSheetEnabled"
  />

  <TextInputSetting
    bind:value={$context.itemCardsFixKey}
    name={'T5EK.Settings.ItemCardsFixKey.name'}
    hint={'T5EK.Settings.ItemCardsFixKey.hint'}
    id="itemCardsFixKey"
  />

  <SelectSetting
    options={SettingsProvider.settings.portraitStyle.options.choices}
    bind:value={$context.portraitStyle}
    name={'T5EK.Settings.PortraitStyle.name'}
    hint={'T5EK.Settings.PortraitStyle.hint'}
    id="portraitStyle"
  />

  <CheckboxSetting
    bind:value={$context.enablePermanentUnlockOnCharacterIfYouAreGM}
    name={'T5EK.Settings.EnablePermanentUnlockOnCharacterIfYouAreGM.name'}
    hint={'T5EK.Settings.EnablePermanentUnlockOnCharacterIfYouAreGM.hint'}
    id="enablePermanentUnlockOnCharacterIfYouAreGM"
  />

  <CheckboxSetting
    bind:value={$context.enablePermanentUnlockOnNPCIfYouAreGM}
    name={'T5EK.Settings.EnablePermanentUnlockOnNPCIfYouAreGM.name'}
    hint={'T5EK.Settings.EnablePermanentUnlockOnNPCIfYouAreGM.hint'}
    id="enablePermanentUnlockOnNPCIfYouAreGM"
  />

  <CheckboxSetting
    bind:value={$context.enablePermanentUnlockOnVehicleIfYouAreGM}
    name={'T5EK.Settings.EnablePermanentUnlockOnVehicleIfYouAreGM.name'}
    hint={'T5EK.Settings.EnablePermanentUnlockOnVehicleIfYouAreGM.hint'}
    id="enablePermanentUnlockOnVehicleIfYouAreGM"
  />

  <CheckboxSetting
    bind:value={$context.editEffectsGmOnlyEnabled}
    name={'T5EK.Settings.EditEffectsGmOnly.name'}
    hint={'T5EK.Settings.EditEffectsGmOnly.hint'}
    id="editEffectsGmOnlyEnabled"
  />

  <CheckboxSetting
    bind:value={$context.quantityAlwaysShownEnabled}
    name={'T5EK.Settings.QuantityAlwaysShown.name'}
    hint={'T5EK.Settings.QuantityAlwaysShown.hint'}
    id="quantityAlwaysShownEnabled"
  />

  <CheckboxSetting
    bind:value={$context.inspirationDisabled}
    name={'T5EK.Settings.InspirationDisabled.name'}
    hint={'T5EK.Settings.InspirationDisabled.hint'}
    id="inspirationDisabled"
  />

  <CheckboxSetting
    bind:value={$context.vehicleMotionDisabled}
    name={'T5EK.Settings.VehicleMotionDisabled.name'}
    hint={'T5EK.Settings.VehicleMotionDisabled.hint'}
    id="vehicleMotionDisabled"
  />

  <CheckboxSetting
    bind:value={$context.exhaustionDisabled}
    name={'T5EK.Settings.ExhaustionDisabled.name'}
    hint={'T5EK.Settings.ExhaustionDisabled.hint'}
    id="exhaustionDisabled"
  />

  <CheckboxSetting
    bind:value={$context.traitLabelsEnabled}
    name={'T5EK.Settings.TraitLabels.name'}
    hint={'T5EK.Settings.TraitLabels.hint'}
    id="traitLabelsEnabled"
  />

  <CheckboxSetting
    bind:value={$context.allowCantripToBePreparedOnContext}
    name={'T5EK.Settings.AllowCantripToBePreparedOnContext.name'}
    hint={'T5EK.Settings.AllowCantripToBePreparedOnContext.hint'}
    id="allowCantripToBePreparedOnContext"
  />

  <CheckboxSetting
    bind:value={$context.allowHpMaxOverride}
    name={'T5EK.Settings.AllowHpMaxOverride.name'}
    hint={'T5EK.Settings.AllowHpMaxOverride.hint'}
    id="allowHpMaxOverride"
  />

  <CheckboxSetting
    bind:value={$context.activeEffectsMarker}
    name={'T5EK.Settings.ActiveEffectsMarker.name'}
    hint={'T5EK.Settings.ActiveEffectsMarker.hint'}
    id="activeEffectsMarker"
  />
{/if}
