<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import {
    SettingsProvider,
    type CurrentSettings,
  } from 'src/settings/settings';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import CheckboxSetting from 'src/sheets/settings/parts/CheckboxSetting.svelte';
  import NumberInputSetting from 'src/sheets/settings/parts/NumberInputSetting.svelte';
  import TextInputSetting from 'src/sheets/settings/parts/TextInputSetting.svelte';
  import SelectSetting from '../parts/SelectSetting.svelte';

  let store = getContext<Writable<CurrentSettings>>('store');

  const userIsGm = FoundryAdapter.userIsGm();
  const localize = FoundryAdapter.localize;
</script>

<h2>{localize('T5EK.Settings.TabPlayers.header')}</h2>
{#if userIsGm}
  <SelectSetting
    options={SettingsProvider.settings.defaultCharacterSheetTab.options.choices()}
    bind:value={$store.defaultCharacterSheetTab}
    name={SettingsProvider.settings.defaultCharacterSheetTab.options.name}
    hint={SettingsProvider.settings.defaultCharacterSheetTab.options.hint}
    id="defaultCharacterSheetTab"
  />
{/if}

<CheckboxSetting
  bind:value={$store.enableClassicControlsForCharacter}
  name={SettingsProvider.settings.enableClassicControlsForCharacter.options.name}
  hint={SettingsProvider.settings.enableClassicControlsForCharacter.options.hint}
  id="enableClassicControlsForCharacter"
/>

<CheckboxSetting
  bind:value={$store.journalTabDisabled}
  name={'T5EK.Settings.JournalTab.name'}
  hint={'T5EK.Settings.JournalTab.hint'}
  id="journalTabDisabled"
/>

<CheckboxSetting
  bind:value={$store.classListDisabled}
  name={'T5EK.Settings.ClassList.name'}
  hint={'T5EK.Settings.ClassList.hint'}
  id="classListDisabled"
/>

<CheckboxSetting
  bind:value={$store.inspirationAnimationDisabled}
  name={'T5EK.Settings.InspirationAnimation.name'}
  hint={'T5EK.Settings.InspirationAnimation.hint'}
  id="inspirationAnimationDisabled"
/>

<CheckboxSetting
  bind:value={$store.hideIfZero}
  name={'T5EK.Settings.HideIfZero.name'}
  hint={'T5EK.Settings.HideIfZero.hint'}
  id="hideIfZero"
/>

<CheckboxSetting
  bind:value={$store.inspirationOnHover}
  name={'T5EK.Settings.InspirationOnHover.name'}
  hint={'T5EK.Settings.InspirationOnHover.hint'}
  id="inspirationOnHover"
/>

<CheckboxSetting
  bind:value={$store.exhaustionOnHover}
  name={'T5EK.Settings.ExhaustionOnHover.name'}
  hint={'T5EK.Settings.ExhaustionOnHover.hint'}
  id="exhaustionOnHover"
/>

<CheckboxSetting
  bind:value={$store.hpBarDisabled}
  name={'T5EK.Settings.HpBar.name'}
  hint={'T5EK.Settings.HpBar.hint'}
  id="hpBarDisabled"
/>

<CheckboxSetting
  bind:value={$store.hpOverlayDisabled}
  name={'T5EK.Settings.HpOverlay.name'}
  hint={'T5EK.Settings.HpOverlay.hint'}
  id="hpOverlayDisabled"
/>

<CheckboxSetting
  bind:value={$store.traitsTogglePc}
  name={'T5EK.Settings.TraitsTogglePc.name'}
  hint={'T5EK.Settings.TraitsTogglePc.hint'}
  id="traitsTogglePc"
/>

<CheckboxSetting
  bind:value={$store.traitsMovedBelowResource}
  name={'T5EK.Settings.TraitsMovedBelowResource.name'}
  hint={'T5EK.Settings.TraitsMovedBelowResource.hint'}
  id="traitsMovedBelowResource"
/>

<CheckboxSetting
  bind:value={$store.ammoEquippedOnly}
  name={'T5EK.Settings.AmmoEquippedOnly.name'}
  hint={'T5EK.Settings.AmmoEquippedOnly.hint'}
  id="ammoEquippedOnly"
/>

<NumberInputSetting
  bind:value={$store.playerSheetWidth}
  name={'T5EK.Settings.playerSheetWidth.name'}
  hint={'T5EK.Settings.playerSheetWidth.hint'}
  id="playerSheetWidth"
/>

<CheckboxSetting
  bind:value={$store.rightClickDisabled}
  name={'T5EK.Settings.RightClickDisabled.name'}
  hint={'T5EK.Settings.RightClickDisabled.hint'}
  id="rightClickDisabled"
/>

<CheckboxSetting
  bind:value={$store.hideIconsNextToTheItemName}
  name={'T5EK.Settings.HideIconsNextToTheItemName.name'}
  hint={'T5EK.Settings.HideIconsNextToTheItemName.hint'}
  id="hideIconsNextToTheItemName"
/>

<CheckboxSetting
  bind:value={$store.enableSortFavoritesItemsAlphabetically}
  name={'T5EK.Settings.EnableSortFavoritesItemsAlphabetically.name'}
  hint={'T5EK.Settings.EnableSortFavoritesItemsAlphabetically.hint'}
  id="enableSortFavoritesItemsAlphabetically"
/>

<h3>{localize('T5EK.Settings.MulticlassSpellbookFilterLabel')}</h3>

<CheckboxSetting
  bind:value={$store.spellClassFilterSelect}
  name={'T5EK.Settings.SpellClassFilterSelect.name'}
  hint={'T5EK.Settings.SpellClassFilterSelect.hint'}
  id="spellClassFilterSelect"
/>

<CheckboxSetting
  bind:value={$store.spellClassFilterIconReplace}
  name={'T5EK.Settings.SpellClassFilterIconReplace.name'}
  hint={'T5EK.Settings.SpellClassFilterIconReplace.hint'}
  id="spellClassFilterIconReplace"
/>

<!-- TODO: Make a little crud-based admin interface for adding / removing these additional classes -->
<TextInputSetting
  bind:value={$store.spellClassFilterAdditionalClasses}
  name={'T5EK.Settings.SpellClassFilterAdditionalClasses.name'}
  hint={'T5EK.Settings.SpellClassFilterAdditionalClasses.hint'}
  id="spellClassFilterAdditionalClasses"
/>
