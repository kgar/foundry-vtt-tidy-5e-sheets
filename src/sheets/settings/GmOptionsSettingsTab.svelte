<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import CheckboxSetting from './parts/CheckboxSetting.svelte';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import type { CurrentSettings } from 'src/settings/settings';
  import TextInputSetting from './parts/TextInputSetting.svelte';

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

  <article class="setting group">
    <section>
      <div class="description">
        <label for="portraitStyle-{appId}"
          >{localize('T5EK.Settings.PortraitStyle.name')}</label
        >
        <p class="notes">{localize('T5EK.Settings.PortraitStyle.hint')}</p>
      </div>
      <div class="settings-group">
        <select
          id="portraitStyle-{appId}"
          bind:value={$store.portraitStyle}
        >
          <option value="default"
            >{localize('T5EK.Settings.PortraitStyle.default')}</option
          >
          <option value="pc"
            >{localize('T5EK.Settings.PortraitStyle.pc')}</option
          >
          <option value="npc"
            >{localize('T5EK.Settings.PortraitStyle.npc')}</option
          >
          <option value="all"
            >{localize('T5EK.Settings.PortraitStyle.all')}</option
          >
        </select>
      </div>
    </section>
  </article>

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

  <article class="setting group">
    <section>
      <div class="description">
        <label for="exhaustionEffectsEnabled-{appId}"
          >{localize('T5EK.Settings.ExhaustionEffects.name')}</label
        >
        <p class="notes">{localize('T5EK.Settings.ExhaustionEffects.hint')}</p>
      </div>
      <div class="settings-group">
        <select
          id="exhaustionEffectsEnabled-{appId}"
          bind:value={$store.exhaustionEffectsEnabled}
        >
          <option value="default"
            >{localize('T5EK.Settings.ExhaustionEffects.default')}</option
          >
          <option value="tidy5e"
            >{localize('T5EK.Settings.ExhaustionEffects.tidy5e')}</option
          >
          <option value="dfredce"
            >{localize('T5EK.Settings.ExhaustionEffects.dfredce')}</option
          >
          <option value="cub"
            >{localize('T5EK.Settings.ExhaustionEffects.cub')}</option
          >
        </select>
      </div>
    </section>
  </article>

  <TextInputSetting
    bind:value={$store.exhaustionEffectIcon}
    name={'T5EK.Settings.CustomExhaustionIcon.name'}
    hint={'T5EK.Settings.CustomExhaustionIcon.hint'}
    id="exhaustionEffectIcon"
  />

  <article class="setting group">
    <section>
      <div class="description">
        <label for="exhaustionEffectCustom-{appId}"
          >{localize('T5EK.Settings.CustomExhaustionEffect.name')}</label
        >
        <p class="notes">
          {localize('T5EK.Settings.CustomExhaustionEffect.hint')}
        </p>
      </div>
      <div class="settings-group">
        <article>
          <input
            type="text"
            data-dtype="string"
            id="exhaustionEffectCustom-{appId}"
            value={$store.exhaustionEffectCustom}
          />
        </article>
        <article>
          <p class="notes">
            {localize('T5EK.Settings.CustomExhaustionEffect.tiers')}
          </p>
          <input
            type="text"
            data-dtype="string"
            name="exhaustionEffectCustomTiers"
            id="exhaustionEffectCustomTiers"
            value={$store.exhaustionEffectCustomTiers}
          />
        </article>
      </div>
    </section>
  </article>

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
