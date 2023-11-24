<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { SettingsProvider } from 'src/settings/settings';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import CheckboxSetting from 'src/applications/sheet-settings/parts/CheckboxSetting.svelte';
  import NumberInputSetting from 'src/applications/sheet-settings/parts/NumberInputSetting.svelte';
  import TextInputSetting from 'src/applications/sheet-settings/parts/TextInputSetting.svelte';
  import SelectSetting from '../parts/SelectSetting.svelte';
  import SelectionListbox from 'src/components/listbox/SelectionListbox.svelte';
  import type { SettingsSheetContext } from '../SheetSettingsFormApplication';

  let context = getContext<Writable<SettingsSheetContext>>('context');

  const userIsGm = FoundryAdapter.userIsGm();
  const localize = FoundryAdapter.localize;

  // TODO: Put on application class and generalize if able
  function resetDefaultTabs(): any {
    const defaultCharacterTabs = [
      ...SettingsProvider.settings.defaultCharacterSheetTabs.options.default,
    ] as string[];
    const available = $context.availableCharacterTabs
      .filter((t) => !defaultCharacterTabs.includes(t.id))
      .concat(
        $context.selectedCharacterTabs.filter(
          (t) => !defaultCharacterTabs.includes(t.id),
        ),
      );
    const selected = $context.availableCharacterTabs
      .filter((t) => defaultCharacterTabs.includes(t.id))
      .concat(
        $context.selectedCharacterTabs.filter((t) =>
          defaultCharacterTabs.includes(t.id),
        ),
      )
      .sort(
        (a, b) =>
          defaultCharacterTabs.indexOf(a.id) -
          defaultCharacterTabs.indexOf(b.id),
      );
    $context.availableCharacterTabs = available;
    $context.selectedCharacterTabs = selected;
  }
</script>

<h2>{localize('T5EK.Settings.TabPlayers.header')}</h2>
{#if userIsGm}
  <SelectSetting
    options={SettingsProvider.settings.initialCharacterSheetTab.options.choices()}
    bind:value={$context.settings.initialCharacterSheetTab}
    name={SettingsProvider.settings.initialCharacterSheetTab.options.name}
    hint={SettingsProvider.settings.initialCharacterSheetTab.options.hint}
    id="initialCharacterSheetTab"
  />

  <article class="setting group">
    <div class="description flex-1">
      <b
        >{localize(
          SettingsProvider.settings.defaultCharacterSheetTabs.options.name,
        )}</b
      >
      <p>
        {localize(
          SettingsProvider.settings.defaultCharacterSheetTabs.options.hint,
        )}
      </p>
      <div class="flex-column small-gap">
        <SelectionListbox
          bind:leftItems={$context.availableCharacterTabs}
          bind:rightItems={$context.selectedCharacterTabs}
          labelProp="label"
          valueProp="id"
        >
          <b slot="left-header" class="minimal"
            >{localize('T5EK.Settings.DefaultSheetTabs.AvailableHeader')}</b
          >
          <b slot="right-header" class="minimal"
            >{localize('T5EK.Settings.DefaultSheetTabs.SelectedHeader')}</b
          >
        </SelectionListbox>
        <button type="button" on:click={() => resetDefaultTabs()}>
          <i class="fas fa-rotate-right" />
          {localize('T5EK.UseDefault')}
        </button>
      </div>
    </div>
  </article>
{/if}

<CheckboxSetting
  bind:value={$context.settings.useClassicControlsForCharacter}
  name={SettingsProvider.settings.useClassicControlsForCharacter.options.name}
  hint={SettingsProvider.settings.useClassicControlsForCharacter.options.hint}
  id="useClassicControlsForCharacter"
/>

<CheckboxSetting
  bind:value={$context.settings.useJournalTabForCharacter}
  name={'T5EK.Settings.UseJournalTabForCharacter.name'}
  hint={'T5EK.Settings.UseJournalTabForCharacter.hint'}
  id="useJournalTabForCharacter"
/>

<CheckboxSetting
  bind:value={$context.settings.showClassList}
  name={'T5EK.Settings.ShowClassList.name'}
  hint={'T5EK.Settings.ShowClassList.hint'}
  id="showClassList"
/>

<CheckboxSetting
  bind:value={$context.settings.animateInspiration}
  name={'T5EK.Settings.InspirationAnimation.name'}
  hint={'T5EK.Settings.InspirationAnimation.hint'}
  id="animateInspiration"
/>

<CheckboxSetting
  bind:value={$context.settings.hideIfZero}
  name={'T5EK.Settings.HideIfZero.name'}
  hint={'T5EK.Settings.HideIfZero.hint'}
  id="hideIfZero"
/>

<CheckboxSetting
  bind:value={$context.settings.showInspirationOnHover}
  name={'T5EK.Settings.ShowInspirationOnHover.name'}
  hint={'T5EK.Settings.ShowInspirationOnHover.hint'}
  id="showInspirationOnHover"
/>

<CheckboxSetting
  bind:value={$context.settings.showExhaustionOnHover}
  name={'T5EK.Settings.ShowExhaustionOnHover.name'}
  hint={'T5EK.Settings.ShowExhaustionOnHover.hint'}
  id="showExhaustionOnHover"
/>

<CheckboxSetting
  bind:value={$context.settings.useHpBar}
  name={'T5EK.Settings.UseHpBar.name'}
  hint={'T5EK.Settings.UseHpBar.hint'}
  id="useHpBar"
/>

<CheckboxSetting
  bind:value={$context.settings.useHpOverlay}
  name={'T5EK.Settings.UseHpOverlay.name'}
  hint={'T5EK.Settings.UseHpOverlay.hint'}
  id="useHpOverlay"
/>

<CheckboxSetting
  bind:value={$context.settings.toggleEmptyCharacterTraits}
  name={'T5EK.Settings.ToggleEmptyCharacterTraits.name'}
  hint={'T5EK.Settings.ToggleEmptyCharacterTraits.hint'}
  id="toggleEmptyCharacterTraits"
/>

<CheckboxSetting
  bind:value={$context.settings.moveTraitsBelowCharacterResources}
  name={'T5EK.Settings.MoveTraitsBelowResources.name'}
  hint={'T5EK.Settings.MoveTraitsBelowResources.hint'}
  id="moveTraitsBelowCharacterResources"
/>

<CheckboxSetting
  bind:value={$context.settings.showEquippedAmmoOnly}
  name={'T5EK.Settings.ShowEquippedAmmoOnly.name'}
  hint={'T5EK.Settings.ShowEquippedAmmoOnly.hint'}
  id="showEquippedAmmoOnly"
/>

<NumberInputSetting
  bind:value={$context.settings.playerSheetWidth}
  name={'T5EK.Settings.PlayerSheetWidth.name'}
  hint={'T5EK.Settings.PlayerSheetWidth.hint'}
  id="playerSheetWidth"
/>

<CheckboxSetting
  bind:value={$context.settings.useContextMenu}
  name={'T5EK.Settings.UseContextMenu.name'}
  hint={'T5EK.Settings.UseContextMenu.hint'}
  id="useContextMenu"
/>

<CheckboxSetting
  bind:value={$context.settings.showIconsNextToTheItemName}
  name={'T5EK.Settings.ShowIconsNextToTheItemName.name'}
  hint={'T5EK.Settings.ShowIconsNextToTheItemName.hint'}
  id="showIconsNextToTheItemName"
/>

<CheckboxSetting
  bind:value={$context.settings.sortFavoriteItemsAlphabetically}
  name={'T5EK.Settings.SortFavoriteItemsAlphabetically.name'}
  hint={'T5EK.Settings.SortFavoriteItemsAlphabetically.hint'}
  id="sortFavoriteItemsAlphabetically"
/>

<h3>{localize('T5EK.Settings.MulticlassSpellbookFilterLabel')}</h3>

<CheckboxSetting
  bind:value={$context.settings.useMulticlassSpellbookFilter}
  name={'T5EK.Settings.UseMulticlassSpellbookFilter.name'}
  hint={'T5EK.Settings.UseMulticlassSpellbookFilter.hint'}
  id="useMulticlassSpellbookFilter"
/>

<CheckboxSetting
  bind:value={$context.settings.useSpellClassFilterIcons}
  name={'T5EK.Settings.UseSpellClassIcons.name'}
  hint={'T5EK.Settings.UseSpellClassIcons.hint'}
  id="useSpellClassFilterIcons"
/>

<!-- TODO: Make a little crud-based admin interface for adding / removing these additional classes -->
<TextInputSetting
  bind:value={$context.settings.spellClassFilterAdditionalClasses}
  name={'T5EK.Settings.SpellClassFilterAdditionalClasses.name'}
  hint={'T5EK.Settings.SpellClassFilterAdditionalClasses.hint'}
  id="spellClassFilterAdditionalClasses"
/>
