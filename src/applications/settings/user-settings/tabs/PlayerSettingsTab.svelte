<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { SettingsProvider } from 'src/settings/settings.svelte';
  import { getContext } from 'svelte';
  import CheckboxSetting from 'src/applications/settings/parts/CheckboxSetting.svelte';
  import type { UserSettingsContext } from '../UserSettings.types';
  import { CONSTANTS } from 'src/constants';

  let context = getContext<UserSettingsContext>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;
</script>

<h2>{localize('TIDY5E.UserSettings.TabPlayers.header')}</h2>

<CheckboxSetting
  bind:value={context.settings.useClassicControlsForCharacter}
  name={SettingsProvider.settings.useClassicControlsForCharacter.options.name}
  hint={SettingsProvider.settings.useClassicControlsForCharacter.options.hint}
  id="useClassicControlsForCharacter"
/>

<CheckboxSetting
  bind:value={context.settings.showClassList}
  name={SettingsProvider.settings.showClassList.options.name}
  hint={SettingsProvider.settings.showClassList.options.hint}
  id="showClassList"
/>

<CheckboxSetting
  bind:value={context.settings.animateInspiration}
  name={SettingsProvider.settings.animateInspiration.options.name}
  hint={SettingsProvider.settings.animateInspiration.options.hint}
  id="animateInspiration"
/>

<CheckboxSetting
  bind:value={context.settings.hideIfZero}
  name={SettingsProvider.settings.hideIfZero.options.name}
  hint={SettingsProvider.settings.hideIfZero.options.hint}
  id="hideIfZero"
/>

<CheckboxSetting
  bind:value={context.settings.showInspirationOnHover}
  name={SettingsProvider.settings.showInspirationOnHover.options.name}
  hint={SettingsProvider.settings.showInspirationOnHover.options.hint}
  id="showInspirationOnHover"
/>

<CheckboxSetting
  bind:value={context.settings.showExhaustionOnHover}
  name={SettingsProvider.settings.showExhaustionOnHover.options.name}
  hint={SettingsProvider.settings.showExhaustionOnHover.options.hint}
  id="showExhaustionOnHover"
/>

<CheckboxSetting
  bind:value={context.settings.useHpBar}
  name={SettingsProvider.settings.useHpBar.options.name}
  hint={SettingsProvider.settings.useHpBar.options.hint}
  id="useHpBar"
/>

<CheckboxSetting
  bind:value={context.settings.useHpOverlay}
  name={SettingsProvider.settings.useHpOverlay.options.name}
  hint={SettingsProvider.settings.useHpOverlay.options.hint}
  id="useHpOverlay"
/>

<CheckboxSetting
  bind:value={context.settings.toggleEmptyCharacterSkills}
  name={SettingsProvider.settings.toggleEmptyCharacterSkills.options.name}
  hint={SettingsProvider.settings.toggleEmptyCharacterSkills.options.hint}
  id="toggleEmptyCharacterSkills"
/>

<CheckboxSetting
  bind:value={context.settings.toggleEmptyCharacterTraits}
  name={SettingsProvider.settings.toggleEmptyCharacterTraits.options.name}
  hint={SettingsProvider.settings.toggleEmptyCharacterTraits.options.hint}
  id="toggleEmptyCharacterTraits"
/>

<CheckboxSetting
  bind:value={context.settings.moveTraitsBelowCharacterResources}
  name={SettingsProvider.settings.moveTraitsBelowCharacterResources.options
    .name}
  hint={SettingsProvider.settings.moveTraitsBelowCharacterResources.options
    .hint}
  id="moveTraitsBelowCharacterResources"
/>

<CheckboxSetting
  bind:value={context.settings.showEquippedAmmoOnly}
  name={SettingsProvider.settings.showEquippedAmmoOnly.options.name}
  hint={SettingsProvider.settings.showEquippedAmmoOnly.options.hint}
  id="showEquippedAmmoOnly"
/>

<CheckboxSetting
  bind:value={context.settings.useContextMenu}
  name={SettingsProvider.settings.useContextMenu.options.name}
  hint={SettingsProvider.settings.useContextMenu.options.hint}
  id="useContextMenu"
/>

<h3>{localize('TIDY5E.Settings.MulticlassSpellbookFilterLabel')}</h3>

<CheckboxSetting
  bind:value={context.settings.useMulticlassSpellbookFilter}
  name={SettingsProvider.settings.useMulticlassSpellbookFilter.options.name}
  hint={SettingsProvider.settings.useMulticlassSpellbookFilter.options.hint}
  id="useMulticlassSpellbookFilter"
/>

<CheckboxSetting
  bind:value={context.settings.useSpellClassFilterIcons}
  name={SettingsProvider.settings.useSpellClassFilterIcons.options.name}
  hint={SettingsProvider.settings.useSpellClassFilterIcons.options.hint}
  id="useSpellClassFilterIcons"
/>
