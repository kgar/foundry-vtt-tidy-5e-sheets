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
    bind:value={$context.useSpellSlotMarker}
    name={'T5EK.Settings.UseSpellSlotMarker.name'}
    hint={'T5EK.Settings.UseSpellSlotMarker.hint'}
    id="useSpellSlotMarker"
  />

  <CheckboxSetting
    bind:value={$context.useCharacterEncumbranceBar}
    name={SettingsProvider.settings.useCharacterEncumbranceBar.options.name}
    hint={SettingsProvider.settings.useCharacterEncumbranceBar.options.hint}
    id="useCharacterEncumbranceBar"
  />

  <CheckboxSetting
    bind:value={$context.useNpcEncumbranceBar}
    name={SettingsProvider.settings.useNpcEncumbranceBar.options.name}
    hint={SettingsProvider.settings.useNpcEncumbranceBar.options.hint}
    id="useNpcEncumbranceBar"
  />

  <CheckboxSetting
    bind:value={$context.useVehicleEncumbranceBar}
    name={SettingsProvider.settings.useVehicleEncumbranceBar.options.name}
    hint={SettingsProvider.settings.useVehicleEncumbranceBar.options.hint}
    id="useVehicleEncumbranceBar"
  />

  <CheckboxSetting
    bind:value={$context.showPlayerName}
    name={'T5EK.Settings.ShowPlayerName.name'}
    hint={'T5EK.Settings.ShowPlayerName.hint'}
    id="showPlayerName"
  />

  <CheckboxSetting
    bind:value={$context.showExpandedLimitedView}
    name={'T5EK.Settings.ShowExpandedLimitedView.name'}
    hint={'T5EK.Settings.ShowExpandedLimitedView.hint'}
    id="showExpandedLimitedView"
  />

  <TextInputSetting
    bind:value={$context.itemCardsFixKey}
    name={'T5EK.Settings.ItemCardsFixKey.name'}
    hint={'T5EK.Settings.ItemCardsFixKey.hint'}
    id="itemCardsFixKey"
  />

  <SelectSetting
    options={SettingsProvider.settings.useCircularPortraitStyle.options.choices}
    bind:value={$context.useCircularPortraitStyle}
    name={'T5EK.Settings.UseCircularPortraitStyle.name'}
    hint={'T5EK.Settings.UseCircularPortraitStyle.hint'}
    id="useCircularPortraitStyle"
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
    bind:value={$context.useInspiration}
    name={'T5EK.Settings.UseInspiration.name'}
    hint={'T5EK.Settings.UseInspiration.hint'}
    id="useInspiration"
  />

  <CheckboxSetting
    bind:value={$context.useVehicleMotion}
    name={'T5EK.Settings.UseVehicleMotion.name'}
    hint={'T5EK.Settings.UseVehicleMotion.hint'}
    id="useVehicleMotion"
  />

  <CheckboxSetting
    bind:value={$context.useExhaustion}
    name={'T5EK.Settings.UseExhaustion.name'}
    hint={'T5EK.Settings.UseExhaustion.hint'}
    id="useExhaustion"
  />

  <CheckboxSetting
    bind:value={$context.showTraitLabels}
    name={'T5EK.Settings.ShowTraitLabels.name'}
    hint={'T5EK.Settings.ShowTraitLabels.hint'}
    id="showTraitLabels"
  />

  <CheckboxSetting
    bind:value={$context.allowCantripsToBePrepared}
    name={'T5EK.Settings.AllowCantripsToBePrepared.name'}
    hint={'T5EK.Settings.AllowCantripsToBePrepared.hint'}
    id="allowCantripsToBePrepared"
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
