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

  let context = getContext<Writable<CurrentSettings>>('context');

  const userIsGm = FoundryAdapter.userIsGm();
  const localize = FoundryAdapter.localize;
</script>

<h2>{localize('T5EK.Settings.TabPlayers.header')}</h2>
{#if userIsGm}
  <SelectSetting
    options={SettingsProvider.settings.defaultCharacterSheetTab.options.choices()}
    bind:value={$context.defaultCharacterSheetTab}
    name={SettingsProvider.settings.defaultCharacterSheetTab.options.name}
    hint={SettingsProvider.settings.defaultCharacterSheetTab.options.hint}
    id="defaultCharacterSheetTab"
  />
{/if}

<CheckboxSetting
  bind:value={$context.useClassicControlsForCharacter}
  name={SettingsProvider.settings.useClassicControlsForCharacter.options.name}
  hint={SettingsProvider.settings.useClassicControlsForCharacter.options.hint}
  id="useClassicControlsForCharacter"
/>

<CheckboxSetting
  bind:value={$context.useJournalTabForCharacter}
  name={'T5EK.Settings.UseJournalTabForCharacter.name'}
  hint={'T5EK.Settings.UseJournalTabForCharacter.hint'}
  id="useJournalTabForCharacter"
/>

<CheckboxSetting
  bind:value={$context.classListDisabled}
  name={'T5EK.Settings.ClassList.name'}
  hint={'T5EK.Settings.ClassList.hint'}
  id="classListDisabled"
/>

<CheckboxSetting
  bind:value={$context.animateInspiration}
  name={'T5EK.Settings.InspirationAnimation.name'}
  hint={'T5EK.Settings.InspirationAnimation.hint'}
  id="animateInspiration"
/>

<CheckboxSetting
  bind:value={$context.hideIfZero}
  name={'T5EK.Settings.HideIfZero.name'}
  hint={'T5EK.Settings.HideIfZero.hint'}
  id="hideIfZero"
/>

<CheckboxSetting
  bind:value={$context.inspirationOnHover}
  name={'T5EK.Settings.InspirationOnHover.name'}
  hint={'T5EK.Settings.InspirationOnHover.hint'}
  id="inspirationOnHover"
/>

<CheckboxSetting
  bind:value={$context.exhaustionOnHover}
  name={'T5EK.Settings.ExhaustionOnHover.name'}
  hint={'T5EK.Settings.ExhaustionOnHover.hint'}
  id="exhaustionOnHover"
/>

<CheckboxSetting
  bind:value={$context.useHpBar}
  name={'T5EK.Settings.HpBar.name'}
  hint={'T5EK.Settings.HpBar.hint'}
  id="useHpBar"
/>

<CheckboxSetting
  bind:value={$context.useHpOverlay}
  name={'T5EK.Settings.HpOverlay.name'}
  hint={'T5EK.Settings.HpOverlay.hint'}
  id="useHpOverlay"
/>

<CheckboxSetting
  bind:value={$context.traitsTogglePc}
  name={'T5EK.Settings.TraitsTogglePc.name'}
  hint={'T5EK.Settings.TraitsTogglePc.hint'}
  id="traitsTogglePc"
/>

<CheckboxSetting
  bind:value={$context.traitsMovedBelowResource}
  name={'T5EK.Settings.TraitsMovedBelowResource.name'}
  hint={'T5EK.Settings.TraitsMovedBelowResource.hint'}
  id="traitsMovedBelowResource"
/>

<CheckboxSetting
  bind:value={$context.ammoEquippedOnly}
  name={'T5EK.Settings.AmmoEquippedOnly.name'}
  hint={'T5EK.Settings.AmmoEquippedOnly.hint'}
  id="ammoEquippedOnly"
/>

<NumberInputSetting
  bind:value={$context.playerSheetWidth}
  name={'T5EK.Settings.playerSheetWidth.name'}
  hint={'T5EK.Settings.playerSheetWidth.hint'}
  id="playerSheetWidth"
/>

<CheckboxSetting
  bind:value={$context.useContextMenu}
  name={'T5EK.Settings.UseContextMenu.name'}
  hint={'T5EK.Settings.UseContextMenu.hint'}
  id="useContextMenu"
/>

<CheckboxSetting
  bind:value={$context.hideIconsNextToTheItemName}
  name={'T5EK.Settings.HideIconsNextToTheItemName.name'}
  hint={'T5EK.Settings.HideIconsNextToTheItemName.hint'}
  id="hideIconsNextToTheItemName"
/>

<CheckboxSetting
  bind:value={$context.enableSortFavoritesItemsAlphabetically}
  name={'T5EK.Settings.EnableSortFavoritesItemsAlphabetically.name'}
  hint={'T5EK.Settings.EnableSortFavoritesItemsAlphabetically.hint'}
  id="enableSortFavoritesItemsAlphabetically"
/>

<h3>{localize('T5EK.Settings.MulticlassSpellbookFilterLabel')}</h3>

<CheckboxSetting
  bind:value={$context.useMulticlassSpellbookFilter}
  name={'T5EK.Settings.UseMulticlassSpellbookFilter.name'}
  hint={'T5EK.Settings.UseMulticlassSpellbookFilter.hint'}
  id="useMulticlassSpellbookFilter"
/>

<CheckboxSetting
  bind:value={$context.useSpellClassFilterIcons}
  name={'T5EK.Settings.UseSpellClassIcons.name'}
  hint={'T5EK.Settings.UseSpellClassIcons.hint'}
  id="useSpellClassFilterIcons"
/>

<!-- TODO: Make a little crud-based admin interface for adding / removing these additional classes -->
<TextInputSetting
  bind:value={$context.spellClassFilterAdditionalClasses}
  name={'T5EK.Settings.SpellClassFilterAdditionalClasses.name'}
  hint={'T5EK.Settings.SpellClassFilterAdditionalClasses.hint'}
  id="spellClassFilterAdditionalClasses"
/>
