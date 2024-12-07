import type { CurrentSettings } from 'src/settings/settings.svelte';
import type { Writable } from 'svelte/store';

export type UserSettingsContext = {
  settings: {
    actionListIncludeConsumables: CurrentSettings['actionListIncludeConsumables'];
    actionListIncludeMinuteLongSpellsAsActions: CurrentSettings['actionListIncludeMinuteLongSpellsAsActions'];
    actionListIncludeSpellsWithActiveEffects: CurrentSettings['actionListIncludeSpellsWithActiveEffects'];
    actionListLimitActionsToCantrips: CurrentSettings['actionListLimitActionsToCantrips'];
    alwaysShowNpcSkills: CurrentSettings['alwaysShowNpcSkills'];
    alwaysShowNpcTraits: CurrentSettings['alwaysShowNpcTraits'];
    animateInspiration: CurrentSettings['animateInspiration'];
    hideIfZero: CurrentSettings['hideIfZero'];
    moveTraitsBelowCharacterResources: CurrentSettings['moveTraitsBelowCharacterResources'];
    moveTraitsBelowNpcResources: CurrentSettings['moveTraitsBelowNpcResources'];
    showClassList: CurrentSettings['showClassList'];
    showEquippedAmmoOnly: CurrentSettings['showEquippedAmmoOnly'];
    showExhaustionOnHover: CurrentSettings['showExhaustionOnHover'];
    showIconsNextToTheItemName: CurrentSettings['showIconsNextToTheItemName'];
    showInspirationOnHover: CurrentSettings['showInspirationOnHover'];
    showSpellbookTabNpc: CurrentSettings['showSpellbookTabNpc'];
    toggleEmptyCharacterSkills: CurrentSettings['toggleEmptyCharacterSkills'];
    toggleEmptyCharacterTraits: CurrentSettings['toggleEmptyCharacterTraits'];
    useClassicControlsForCharacter: CurrentSettings['useClassicControlsForCharacter'];
    useClassicControlsForNpc: CurrentSettings['useClassicControlsForNpc'];
    useClassicControlsForVehicle: CurrentSettings['useClassicControlsForVehicle'];
    useContextMenu: CurrentSettings['useContextMenu'];
    useHpBar: CurrentSettings['useHpBar'];
    useHpBarNpc: CurrentSettings['useHpBarNpc'];
    useHpBarVehicle: CurrentSettings['useHpBarVehicle'];
    useHpOverlay: CurrentSettings['useHpOverlay'];
    useHpOverlayNpc: CurrentSettings['useHpOverlayNpc'];
    useHpOverlayVehicle: CurrentSettings['useHpOverlayVehicle'];
    useMulticlassSpellbookFilter: CurrentSettings['useMulticlassSpellbookFilter'];
    useSpellClassFilterIcons: CurrentSettings['useSpellClassFilterIcons'];
  };
};

export type UserSettingsFunctions = {
  save(settings: UserSettingsContext): Promise<unknown>;
  apply(settings: UserSettingsContext): Promise<unknown>;
  validate(context: UserSettingsContext): boolean;
};

export type UserSettingsStore = Writable<UserSettingsContext>;
