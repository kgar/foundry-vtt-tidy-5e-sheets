<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { SettingsProvider } from 'src/settings/settings';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import CheckboxSetting from 'src/applications/settings/parts/CheckboxSetting.svelte';
  import NumberInputSetting from 'src/applications/settings/parts/NumberInputSetting.svelte';
  import TextInputSetting from 'src/applications/settings/parts/TextInputSetting.svelte';
  import type {
    SettingsSheetContext,
  } from '../ClientSettings.types';

  let context = getContext<Writable<SettingsSheetContext>>('context');

  const localize = FoundryAdapter.localize;
</script>

<h2>{localize('TIDY5E.Settings.TabPlayers.header')}</h2>

<CheckboxSetting
  bind:value={$context.settings.useClassicControlsForCharacter}
  name={SettingsProvider.settings.useClassicControlsForCharacter.options.name}
  hint={SettingsProvider.settings.useClassicControlsForCharacter.options.hint}
  id="useClassicControlsForCharacter"
/>

<CheckboxSetting
  bind:value={$context.settings.showClassList}
  name={'TIDY5E.Settings.ShowClassList.name'}
  hint={'TIDY5E.Settings.ShowClassList.hint'}
  id="showClassList"
/>

<CheckboxSetting
  bind:value={$context.settings.animateInspiration}
  name={'TIDY5E.Settings.InspirationAnimation.name'}
  hint={'TIDY5E.Settings.InspirationAnimation.hint'}
  id="animateInspiration"
/>

<CheckboxSetting
  bind:value={$context.settings.hideIfZero}
  name={'TIDY5E.Settings.HideIfZero.name'}
  hint={'TIDY5E.Settings.HideIfZero.hint'}
  id="hideIfZero"
/>

<CheckboxSetting
  bind:value={$context.settings.showInspirationOnHover}
  name={'TIDY5E.Settings.ShowInspirationOnHover.name'}
  hint={'TIDY5E.Settings.ShowInspirationOnHover.hint'}
  id="showInspirationOnHover"
/>

<CheckboxSetting
  bind:value={$context.settings.showExhaustionOnHover}
  name={'TIDY5E.Settings.ShowExhaustionOnHover.name'}
  hint={'TIDY5E.Settings.ShowExhaustionOnHover.hint'}
  id="showExhaustionOnHover"
/>

<CheckboxSetting
  bind:value={$context.settings.useHpBar}
  name={'TIDY5E.Settings.UseHpBar.name'}
  hint={'TIDY5E.Settings.UseHpBar.hint'}
  id="useHpBar"
/>

<CheckboxSetting
  bind:value={$context.settings.useHpOverlay}
  name={'TIDY5E.Settings.UseHpOverlay.name'}
  hint={'TIDY5E.Settings.UseHpOverlay.hint'}
  id="useHpOverlay"
/>

<CheckboxSetting
  bind:value={$context.settings.toggleEmptyCharacterSkills}
  name={'TIDY5E.Settings.ToggleEmptyCharacterSkills.name'}
  hint={'TIDY5E.Settings.ToggleEmptyCharacterSkills.hint'}
  id="toggleEmptyCharacterSkills"
/>

<CheckboxSetting
  bind:value={$context.settings.toggleEmptyCharacterTraits}
  name={'TIDY5E.Settings.ToggleEmptyCharacterTraits.name'}
  hint={'TIDY5E.Settings.ToggleEmptyCharacterTraits.hint'}
  id="toggleEmptyCharacterTraits"
/>

<CheckboxSetting
  bind:value={$context.settings.moveTraitsBelowCharacterResources}
  name={'TIDY5E.Settings.MoveTraitsBelowResources.name'}
  hint={'TIDY5E.Settings.MoveTraitsBelowResources.hint'}
  id="moveTraitsBelowCharacterResources"
/>

<CheckboxSetting
  bind:value={$context.settings.showEquippedAmmoOnly}
  name={'TIDY5E.Settings.ShowEquippedAmmoOnly.name'}
  hint={'TIDY5E.Settings.ShowEquippedAmmoOnly.hint'}
  id="showEquippedAmmoOnly"
/>

<NumberInputSetting
  bind:value={$context.settings.playerSheetWidth}
  name={'TIDY5E.Settings.PlayerSheetWidth.name'}
  hint={'TIDY5E.Settings.PlayerSheetWidth.hint'}
  id="playerSheetWidth"
/>

<CheckboxSetting
  bind:value={$context.settings.useContextMenu}
  name={'TIDY5E.Settings.UseContextMenu.name'}
  hint={'TIDY5E.Settings.UseContextMenu.hint'}
  id="useContextMenu"
/>

<CheckboxSetting
  bind:value={$context.settings.showIconsNextToTheItemName}
  name={'TIDY5E.Settings.ShowIconsNextToTheItemName.name'}
  hint={'TIDY5E.Settings.ShowIconsNextToTheItemName.hint'}
  id="showIconsNextToTheItemName"
/>

<h3>{localize('TIDY5E.Settings.MulticlassSpellbookFilterLabel')}</h3>

<CheckboxSetting
  bind:value={$context.settings.useMulticlassSpellbookFilter}
  name={'TIDY5E.Settings.UseMulticlassSpellbookFilter.name'}
  hint={'TIDY5E.Settings.UseMulticlassSpellbookFilter.hint'}
  id="useMulticlassSpellbookFilter"
/>

<CheckboxSetting
  bind:value={$context.settings.useSpellClassFilterIcons}
  name={'TIDY5E.Settings.UseSpellClassIcons.name'}
  hint={'TIDY5E.Settings.UseSpellClassIcons.hint'}
  id="useSpellClassFilterIcons"
/>

<!-- TODO: Make a little crud-based admin interface for adding / removing these additional classes -->
<TextInputSetting
  bind:value={$context.settings.spellClassFilterAdditionalClasses}
  name={'TIDY5E.Settings.SpellClassFilterAdditionalClasses.name'}
  hint={'TIDY5E.Settings.SpellClassFilterAdditionalClasses.hint'}
  id="spellClassFilterAdditionalClasses"
/>
