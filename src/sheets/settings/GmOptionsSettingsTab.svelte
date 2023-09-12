<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import CheckboxSetting from './parts/CheckboxSetting.svelte';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import type { CurrentSettings } from 'src/settings/settings';
  import TextInputSetting from './parts/TextInputSetting.svelte';
  import SelectSetting from './parts/SelectSetting.svelte';

  let store = getContext<Writable<CurrentSettings>>('store');
  const appId = getContext<string>('appId');

  const userIsGm = FoundryAdapter.userIsGm();
  const localize = FoundryAdapter.localize;
</script>

{#if userIsGm}
  <h2>{localize('T5EK.Settings.TabGM.header')}</h2>

  <CheckboxSetting
    bind:value={$store.hiddenDeathSavesEnabled}
    name={'T5EK.Settings.HiddenDeathSaves.name'}
    hint={'T5EK.Settings.HiddenDeathSaves.hint'}
    id="hiddenDeathSavesEnabled"
  />

  <CheckboxSetting
    bind:value={$store.hideSpellSlotMarker}
    name={'T5EK.Settings.HideSpellSlotMarker.name'}
    hint={'T5EK.Settings.HideSpellSlotMarker.hint'}
    id="hideSpellSlotMarker"
  />

  <CheckboxSetting
    bind:value={$store.enableSpellLevelButtons}
    name={'T5EK.Settings.EnableSpellLevelButtons.name'}
    hint={'T5EK.Settings.EnableSpellLevelButtons.hint'}
    id="enableSpellLevelButtons"
  />

  <CheckboxSetting
    bind:value={$store.hideStandardEncumbranceBar}
    name={'T5EK.Settings.HideStandardEncumbranceBar.name'}
    hint={'T5EK.Settings.HideStandardEncumbranceBar.hint'}
    id="hideStandardEncumbranceBar"
  />

  <CheckboxSetting
    bind:value={$store.playerNameEnabled}
    name={'T5EK.Settings.PlayerName.name'}
    hint={'T5EK.Settings.PlayerName.hint'}
    id="playerNameEnabled"
  />

  <CheckboxSetting
    bind:value={$store.expandedSheetEnabled}
    name={'T5EK.Settings.ExpandedSheet.name'}
    hint={'T5EK.Settings.ExpandedSheet.hint'}
    id="expandedSheetEnabled"
  />

  <TextInputSetting
    bind:value={$store.itemCardsFixKey}
    name={'T5EK.Settings.ItemCardsFixKey.name'}
    hint={'T5EK.Settings.ItemCardsFixKey.hint'}
    id="itemCardsFixKey"
  />

  <SelectSetting
    options={{
      default: 'T5EK.Settings.PortraitStyle.default',
      pc: 'T5EK.Settings.PortraitStyle.pc',
      npc: 'T5EK.Settings.PortraitStyle.npc',
      all: 'T5EK.Settings.PortraitStyle.all',
    }}
    bind:value={$store.portraitStyle}
    name={'T5EK.Settings.PortraitStyle.name'}
    hint={'T5EK.Settings.PortraitStyle.hint'}
    id="portraitStyle"
  />

  <CheckboxSetting
    bind:value={$store.editGmAlwaysEnabled}
    name={'T5EK.Settings.EditGmAlways.name'}
    hint={'T5EK.Settings.EditGmAlways.hint'}
    id="editGmAlwaysEnabled"
  />

  <CheckboxSetting
    bind:value={$store.editEffectsGmOnlyEnabled}
    name={'T5EK.Settings.EditEffectsGmOnly.name'}
    hint={'T5EK.Settings.EditEffectsGmOnly.hint'}
    id="editEffectsGmOnlyEnabled"
  />

  <CheckboxSetting
    bind:value={$store.quantityAlwaysShownEnabled}
    name={'T5EK.Settings.QuantityAlwaysShown.name'}
    hint={'T5EK.Settings.QuantityAlwaysShown.hint'}
    id="quantityAlwaysShownEnabled"
  />

  <CheckboxSetting
    bind:value={$store.inspirationDisabled}
    name={'T5EK.Settings.InspirationDisabled.name'}
    hint={'T5EK.Settings.InspirationDisabled.hint'}
    id="inspirationDisabled"
  />

  <CheckboxSetting
    bind:value={$store.vehicleMotionDisabled}
    name={'T5EK.Settings.VehicleMotionDisabled.name'}
    hint={'T5EK.Settings.VehicleMotionDisabled.hint'}
    id="vehicleMotionDisabled"
  />

  <SelectSetting
    options={{
      default: 'T5EK.Settings.ExhaustionEffects.default',
      tidy5e: 'T5EK.Settings.ExhaustionEffects.tidy5e',
      dfredce: 'T5EK.Settings.ExhaustionEffects.dfredce',
      cub: 'T5EK.Settings.ExhaustionEffects.cub',
    }}
    bind:value={$store.exhaustionEffectsEnabled}
    name={'T5EK.Settings.ExhaustionEffects.name'}
    hint={'T5EK.Settings.ExhaustionEffects.hint'}
    id="exhaustionEffectsEnabled"
  />

  <TextInputSetting
    bind:value={$store.exhaustionEffectIcon}
    name={'T5EK.Settings.CustomExhaustionIcon.name'}
    hint={'T5EK.Settings.CustomExhaustionIcon.hint'}
    id="exhaustionEffectIcon"
  />

  <TextInputSetting
    bind:value={$store.exhaustionEffectCustom}
    name={'T5EK.Settings.CustomExhaustionEffect.name'}
    hint={'T5EK.Settings.CustomExhaustionEffect.hint'}
    id="exhaustionEffectCustom"
  >
    <svelte:fragment slot="additional-inputs">
      <article>
        <p class="tidy5e-notes">
          {localize('T5EK.Settings.CustomExhaustionEffect.tiers')}
        </p>
        <input
          type="text"
          data-dtype="string"
          name="exhaustionEffectCustomTiers"
          id="exhaustionEffectCustomTiers-{appId}"
          bind:value={$store.exhaustionEffectCustomTiers}
        />
      </article>
    </svelte:fragment>
  </TextInputSetting>

  <CheckboxSetting
    bind:value={$store.exhaustionDisabled}
    name={'T5EK.Settings.ExhaustionDisabled.name'}
    hint={'T5EK.Settings.ExhaustionDisabled.hint'}
    id="exhaustionDisabled"
  />

  <CheckboxSetting
    bind:value={$store.traitLabelsEnabled}
    name={'T5EK.Settings.TraitLabels.name'}
    hint={'T5EK.Settings.TraitLabels.hint'}
    id="traitLabelsEnabled"
  />

  <CheckboxSetting
    bind:value={$store.allowCantripToBePreparedOnContext}
    name={'T5EK.Settings.AllowCantripToBePreparedOnContext.name'}
    hint={'T5EK.Settings.AllowCantripToBePreparedOnContext.hint'}
    id="allowCantripToBePreparedOnContext"
  />

  <CheckboxSetting
    bind:value={$store.allowHpMaxOverride}
    name={'T5EK.Settings.AllowHpMaxOverride.name'}
    hint={'T5EK.Settings.AllowHpMaxOverride.hint'}
    id="allowHpMaxOverride"
  />

  <CheckboxSetting
    bind:value={$store.allowHpConfigOverride}
    name={'T5EK.Settings.AllowHpConfigOverride.name'}
    hint={'T5EK.Settings.AllowHpConfigOverride.hint'}
    id="allowHpConfigOverride"
  />

  <CheckboxSetting
    bind:value={$store.betterAttackDialog}
    name={'T5EK.Settings.BetterAttackDialog.name'}
    hint={'T5EK.Settings.BetterAttackDialog.hint'}
    id="betterAttackDialog"
  />

  <CheckboxSetting
    bind:value={$store.enablePermanentUnlockOnNPCIfYouAreGM}
    name={'T5EK.Settings.EnablePermanentUnlockOnNPCIfYouAreGM.name'}
    hint={'T5EK.Settings.EnablePermanentUnlockOnNPCIfYouAreGM.hint'}
    id="enablePermanentUnlockOnNPCIfYouAreGM"
  />

  <CheckboxSetting
    bind:value={$store.enablePermanentUnlockOnVehicleIfYouAreGM}
    name={'T5EK.Settings.EnablePermanentUnlockOnVehicleIfYouAreGM.name'}
    hint={'T5EK.Settings.EnablePermanentUnlockOnVehicleIfYouAreGM.hint'}
    id="enablePermanentUnlockOnVehicleIfYouAreGM"
  />
{/if}
