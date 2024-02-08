<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import CheckboxSetting from 'src/applications/settings/parts/CheckboxSetting.svelte';
  import { getContext } from 'svelte';
  import { SettingsProvider } from 'src/settings/settings';
  import TextInputSetting from 'src/applications/settings/parts/TextInputSetting.svelte';
  import SelectSetting from 'src/applications/settings/parts/SelectSetting.svelte';
  import type {
    WorldSettingsContextStore,
    WorldSettingsFunctions,
  } from '../WorldSettings.types';
  import ExhaustionSetting from '../../parts/ExhaustionSetting.svelte';
  import {
    getOneDnDExhaustionConfig,
    getStandardExhaustionConfig,
    getStandardVehicleExhaustionConfig,
  } from 'src/features/exhaustion/exhaustion';
  import ListboxSetting from '../../parts/ListboxSetting.svelte';
  import { CONSTANTS } from 'src/constants';

  const context = getContext<WorldSettingsContextStore>('context');
  let functions = getContext<WorldSettingsFunctions>('functions');

  const userIsGm = FoundryAdapter.userIsGm();
  const localize = FoundryAdapter.localize;
</script>

<h2>{localize('TIDY5E.Settings.TabGM.header')}</h2>

<CheckboxSetting
  bind:value={$context.hideDeathSavesFromPlayers}
  name={'TIDY5E.Settings.HideDeathSavesFromPlayers.name'}
  hint={'TIDY5E.Settings.HideDeathSavesFromPlayers.hint'}
  id="hideDeathSavesFromPlayers"
/>

<CheckboxSetting
  bind:value={$context.useSpellSlotMarker}
  name={'TIDY5E.Settings.UseSpellSlotMarker.name'}
  hint={'TIDY5E.Settings.UseSpellSlotMarker.hint'}
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
  name={'TIDY5E.Settings.ShowPlayerName.name'}
  hint={'TIDY5E.Settings.ShowPlayerName.hint'}
  id="showPlayerName"
/>

<CheckboxSetting
  bind:value={$context.sortFavoriteItemsAlphabetically}
  name={'TIDY5E.Settings.SortFavoriteItemsAlphabetically.name'}
  hint={'TIDY5E.Settings.SortFavoriteItemsAlphabetically.hint'}
  id="sortFavoriteItemsAlphabetically"
/>

<CheckboxSetting
  bind:value={$context.showExpandedLimitedView}
  name={'TIDY5E.Settings.ShowExpandedLimitedView.name'}
  hint={'TIDY5E.Settings.ShowExpandedLimitedView.hint'}
  id="showExpandedLimitedView"
/>

<TextInputSetting
  bind:value={$context.itemCardsFixKey}
  name={'TIDY5E.Settings.ItemCardsFixKey.name'}
  hint={'TIDY5E.Settings.ItemCardsFixKey.hint'}
  id="itemCardsFixKey"
/>

<SelectSetting
  options={SettingsProvider.settings.useCircularPortraitStyle.options.choices}
  bind:value={$context.useCircularPortraitStyle}
  name={'TIDY5E.Settings.UseCircularPortraitStyle.name'}
  hint={'TIDY5E.Settings.UseCircularPortraitStyle.hint'}
  id="useCircularPortraitStyle"
/>

<CheckboxSetting
  bind:value={$context.permanentlyUnlockCharacterSheetForGm}
  name={'TIDY5E.Settings.PermanentlyUnlockCharacterSheetForGM.name'}
  hint={'TIDY5E.Settings.PermanentlyUnlockCharacterSheetForGM.hint'}
  id="permanentlyUnlockCharacterSheetForGm"
/>

<CheckboxSetting
  bind:value={$context.permanentlyUnlockNpcSheetForGm}
  name={'TIDY5E.Settings.PermanentlyUnlockNPCSheetForGM.name'}
  hint={'TIDY5E.Settings.PermanentlyUnlockNPCSheetForGM.hint'}
  id="permanentlyUnlockNpcSheetForGm"
/>

<CheckboxSetting
  bind:value={$context.permanentlyUnlockVehicleSheetForGm}
  name={'TIDY5E.Settings.PermanentlyUnlockVehicleSheetForGM.name'}
  hint={'TIDY5E.Settings.PermanentlyUnlockVehicleSheetForGM.hint'}
  id="permanentlyUnlockVehicleSheetForGm"
/>

<CheckboxSetting
  bind:value={$context.limitEffectsManagementToGm}
  name={'TIDY5E.Settings.LimitEffectsManagementToGM.name'}
  hint={'TIDY5E.Settings.LimitEffectsManagementToGM.hint'}
  id="limitEffectsManagementToGm"
/>

<CheckboxSetting
  bind:value={$context.alwaysShowItemQuantity}
  name={'TIDY5E.Settings.AlwaysShowItemQuantity.name'}
  hint={'TIDY5E.Settings.AlwaysShowItemQuantity.hint'}
  id="alwaysShowItemQuantity"
/>

<CheckboxSetting
  bind:value={$context.useCharacterInspiration}
  name={'TIDY5E.Settings.UseInspiration.name'}
  hint={'TIDY5E.Settings.UseInspiration.hint'}
  id="useCharacterInspiration"
/>

<CheckboxSetting
  bind:value={$context.useVehicleMotion}
  name={'TIDY5E.Settings.UseVehicleMotion.name'}
  hint={'TIDY5E.Settings.UseVehicleMotion.hint'}
  id="useVehicleMotion"
/>

<CheckboxSetting
  bind:value={$context.useExhaustion}
  name={'TIDY5E.Settings.UseExhaustion.name'}
  hint={'TIDY5E.Settings.UseExhaustion.hint'}
  id="useExhaustion"
/>

<CheckboxSetting
  bind:value={$context.showTraitLabels}
  name={'TIDY5E.Settings.ShowTraitLabels.name'}
  hint={'TIDY5E.Settings.ShowTraitLabels.hint'}
  id="showTraitLabels"
/>

<CheckboxSetting
  bind:value={$context.allowCantripsToBePrepared}
  name={'TIDY5E.Settings.AllowCantripsToBePrepared.name'}
  hint={'TIDY5E.Settings.AllowCantripsToBePrepared.hint'}
  id="allowCantripsToBePrepared"
/>

<CheckboxSetting
  bind:value={$context.allowHpMaxOverride}
  name={'TIDY5E.Settings.AllowHpMaxOverride.name'}
  hint={'TIDY5E.Settings.AllowHpMaxOverride.hint'}
  id="allowHpMaxOverride"
/>

<CheckboxSetting
  bind:value={$context.showActiveEffectsMarker}
  name={'TIDY5E.Settings.ShowActiveEffectsMarker.name'}
  hint={'TIDY5E.Settings.ShowActiveEffectsMarker.hint'}
  id="showActiveEffectsMarker"
/>

<h2>{localize('TIDY5E.Settings.Exhaustion.Header')}</h2>

<article class="setting buttons">
  <button
    type="button"
    on:click={() => ($context.exhaustionConfig = getStandardExhaustionConfig())}
  >
    {localize('TIDY5E.Settings.Exhaustion.useStandardExhaustion')}
  </button>
  <button
    type="button"
    on:click={() => ($context.exhaustionConfig = getOneDnDExhaustionConfig())}
  >
    {localize('TIDY5E.Settings.Exhaustion.useOneDnDExhaustion')}
  </button>
</article>

<ExhaustionSetting
  name="TIDY5E.Settings.Exhaustion.name"
  hint="TIDY5E.Settings.Exhaustion.hint"
  bind:config={$context.exhaustionConfig}
/>

<h2>{localize('TIDY5E.Settings.VehicleExhaustion.Header')}</h2>

<article class="setting buttons">
  <button
    type="button"
    on:click={() =>
      ($context.vehicleExhaustionConfig = getStandardVehicleExhaustionConfig())}
  >
    {localize('TIDY5E.Settings.Exhaustion.useStandardExhaustion')}
  </button>
</article>

<ExhaustionSetting
  name="TIDY5E.Settings.VehicleExhaustion.name"
  hint="TIDY5E.Settings.VehicleExhaustion.hint"
  bind:config={$context.vehicleExhaustionConfig}
/>

<h2>{localize('TIDY5E.Settings.TabLocks.header')}</h2>
<p class="tab-notes">{localize('TIDY5E.Settings.TabLocks.hint')}</p>
<p class="tab-notes">{localize('TIDY5E.Settings.TabLocks.hint2')}</p>

<CheckboxSetting
  bind:value={$context.useTotalSheetLock}
  name={'TIDY5E.Settings.UseTotalSheetLock.name'}
  hint={'TIDY5E.Settings.UseTotalSheetLock.hint'}
  id="useTotalSheetLock"
/>

<h3>{localize('TIDY5E.Settings.TabLocks.labelGeneralLocks')}</h3>

<CheckboxSetting
  bind:value={$context.lockExpChanges}
  name={'TIDY5E.Settings.LockExpChanges.name'}
  hint={'TIDY5E.Settings.LockExpChanges.hint'}
  id="lockExpChanges"
/>

<CheckboxSetting
  bind:value={$context.lockHpMaxChanges}
  name={'TIDY5E.Settings.LockHpMaxChanges.name'}
  hint={'TIDY5E.Settings.LockHpMaxChanges.hint'}
  id="lockHpMaxChanges"
/>

<CheckboxSetting
  bind:value={$context.lockConfigureSheet}
  name={'TIDY5E.Settings.LockConfigureSheet.name'}
  hint={'TIDY5E.Settings.LockConfigureSheet.hint'}
  id="lockConfigureSheet"
/>

<h3>{localize('TIDY5E.Settings.TabLocks.labelInventoryLocks')}</h3>

<CheckboxSetting
  bind:value={$context.lockMoneyChanges}
  name={'TIDY5E.Settings.LockMoneyChanges.name'}
  hint={'TIDY5E.Settings.LockMoneyChanges.hint'}
  id="lockMoneyChanges"
/>

<h3>{localize('TIDY5E.Settings.TabLocks.labelFeaturesLocks')}</h3>

<CheckboxSetting
  bind:value={$context.lockLevelSelector}
  name={'TIDY5E.Settings.LockLevelSelector.name'}
  hint={'TIDY5E.Settings.LockLevelSelector.hint'}
  id="lockLevelSelector"
/>

<CheckboxSetting
  bind:value={$context.lockItemQuantity}
  name={'TIDY5E.Settings.LockItemQuantity.name'}
  hint={'TIDY5E.Settings.LockItemQuantity.hint'}
  id="lockItemQuantity"
/>

<!-- NPC -->
<SelectSetting
  options={SettingsProvider.settings.initialNpcSheetTab.options.choices()}
  bind:value={$context.initialNpcSheetTab}
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
  bind:value={$context.useNpcRest}
  name={'TIDY5E.Settings.UseNPCRest.name'}
  hint={'TIDY5E.Settings.UseNPCRest.hint'}
  id="useNpcRest"
/>

<CheckboxSetting
  bind:value={$context.showNpcRestInChat}
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
  bind:value={$context.showNpcActorLinkMarker}
  name="TIDY5E.Settings.ShowNPCActorLinkMarker.name"
  hint="TIDY5E.Settings.ShowNPCActorLinkMarker.hint"
  id="showNpcActorLinkMarker"
/>

<!-- Character -->

<SelectSetting
  options={SettingsProvider.settings.initialCharacterSheetTab.options.choices()}
  bind:value={$context.initialCharacterSheetTab}
  name={SettingsProvider.settings.initialCharacterSheetTab.options.name}
  hint={SettingsProvider.settings.initialCharacterSheetTab.options.hint}
  id="initialCharacterSheetTab"
/>

<ListboxSetting
  name={SettingsProvider.settings.defaultCharacterSheetTabs.options.name}
  hint={SettingsProvider.settings.defaultCharacterSheetTabs.options.hint}
  leftHeader="TIDY5E.Settings.DefaultSheetTabs.AvailableHeader"
  bind:leftItems={$context.defaultCharacterTabs.available}
  rightHeader="TIDY5E.Settings.DefaultSheetTabs.SelectedHeader"
  bind:rightItems={$context.defaultCharacterTabs.selected}
  labelProp="label"
  valueProp="id"
>
  <div slot="below-listbox">
    <button
      type="button"
      on:click={() =>
        functions.resetDefaultTabs(context, CONSTANTS.SHEET_TYPE_CHARACTER)}
    >
      <i class="fas fa-rotate-right" />
      {localize('TIDY5E.Reset')}
    </button>
  </div>
</ListboxSetting>

<!-- Vehicles -->
<SelectSetting
  options={SettingsProvider.settings.initialVehicleSheetTab.options.choices()}
  bind:value={$context.initialVehicleSheetTab}
  name={SettingsProvider.settings.initialVehicleSheetTab.options.name}
  hint={SettingsProvider.settings.initialVehicleSheetTab.options.hint}
  id="initialVehicleSheetTab"
/>

<ListboxSetting
  name={SettingsProvider.settings.defaultVehicleSheetTabs.options.name}
  hint={SettingsProvider.settings.defaultVehicleSheetTabs.options.hint}
  leftHeader="TIDY5E.Settings.DefaultSheetTabs.AvailableHeader"
  bind:leftItems={$context.defaultVehicleTabs.available}
  rightHeader="TIDY5E.Settings.DefaultSheetTabs.SelectedHeader"
  bind:rightItems={$context.defaultVehicleTabs.selected}
  labelProp="label"
  valueProp="id"
>
  <div slot="below-listbox">
    <button
      type="button"
      on:click={() =>
        functions.resetDefaultTabs(context, CONSTANTS.SHEET_TYPE_VEHICLE)}
    >
      <i class="fas fa-rotate-right" />
      {localize('TIDY5E.Reset')}
    </button>
  </div>
</ListboxSetting>
