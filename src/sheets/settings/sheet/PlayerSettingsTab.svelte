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
  bind:value={$context.showClassList}
  name={'T5EK.Settings.ShowClassList.name'}
  hint={'T5EK.Settings.ShowClassList.hint'}
  id="showClassList"
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
  bind:value={$context.showInspirationOnHover}
  name={'T5EK.Settings.ShowInspirationOnHover.name'}
  hint={'T5EK.Settings.ShowInspirationOnHover.hint'}
  id="showInspirationOnHover"
/>

<CheckboxSetting
  bind:value={$context.showExhaustionOnHover}
  name={'T5EK.Settings.ShowExhaustionOnHover.name'}
  hint={'T5EK.Settings.ShowExhaustionOnHover.hint'}
  id="showExhaustionOnHover"
/>

<CheckboxSetting
  bind:value={$context.useHpBar}
  name={'T5EK.Settings.UseHpBar.name'}
  hint={'T5EK.Settings.UseHpBar.hint'}
  id="useHpBar"
/>

<CheckboxSetting
  bind:value={$context.useHpOverlay}
  name={'T5EK.Settings.UseHpOverlay.name'}
  hint={'T5EK.Settings.UseHpOverlay.hint'}
  id="useHpOverlay"
/>

<CheckboxSetting
  bind:value={$context.toggleEmptyCharacterTraits}
  name={'T5EK.Settings.ToggleEmptyCharacterTraits.name'}
  hint={'T5EK.Settings.ToggleEmptyCharacterTraits.hint'}
  id="toggleEmptyCharacterTraits"
/>

<CheckboxSetting
  bind:value={$context.moveTraitsBelowCharacterResources}
  name={'T5EK.Settings.MoveTraitsBelowResources.name'}
  hint={'T5EK.Settings.MoveTraitsBelowResources.hint'}
  id="moveTraitsBelowCharacterResources"
/>

<CheckboxSetting
  bind:value={$context.showEquippedAmmoOnly}
  name={'T5EK.Settings.ShowEquippedAmmoOnly.name'}
  hint={'T5EK.Settings.ShowEquippedAmmoOnly.hint'}
  id="showEquippedAmmoOnly"
/>

<NumberInputSetting
  bind:value={$context.playerSheetWidth}
  name={'T5EK.Settings.PlayerSheetWidth.name'}
  hint={'T5EK.Settings.PlayerSheetWidth.hint'}
  id="playerSheetWidth"
/>

<CheckboxSetting
  bind:value={$context.useContextMenu}
  name={'T5EK.Settings.UseContextMenu.name'}
  hint={'T5EK.Settings.UseContextMenu.hint'}
  id="useContextMenu"
/>

<CheckboxSetting
  bind:value={$context.showIconsNextToTheItemName}
  name={'T5EK.Settings.ShowIconsNextToTheItemName.name'}
  hint={'T5EK.Settings.ShowIconsNextToTheItemName.hint'}
  id="showIconsNextToTheItemName"
/>

<CheckboxSetting
  bind:value={$context.sortFavoriteItemsAlphabetically}
  name={'T5EK.Settings.SortFavoriteItemsAlphabetically.name'}
  hint={'T5EK.Settings.SortFavoriteItemsAlphabetically.hint'}
  id="sortFavoriteItemsAlphabetically"
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
