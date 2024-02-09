<script lang="ts">
  import CheckboxSetting from 'src/applications/settings/parts/CheckboxSetting.svelte';
  import { getContext } from 'svelte';
  import { SettingsProvider } from 'src/settings/settings';
  import TextInputSetting from 'src/applications/settings/parts/TextInputSetting.svelte';
  import SelectSetting from 'src/applications/settings/parts/SelectSetting.svelte';
  import type { WorldSettingsContextStore } from '../WorldSettings.types';

  const context = getContext<WorldSettingsContextStore>('context');
</script>

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
  bind:value={$context.settings.showActiveEffectsMarker}
  name={'TIDY5E.Settings.ShowActiveEffectsMarker.name'}
  hint={'TIDY5E.Settings.ShowActiveEffectsMarker.hint'}
  id="showActiveEffectsMarker"
/>
