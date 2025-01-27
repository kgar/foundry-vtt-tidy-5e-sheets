import type { CurrentSettings } from 'src/settings/settings.svelte';

export type UserSettingsContext = {
  settings: {
    actionListIncludeConsumables: CurrentSettings['actionListIncludeConsumables'];
    actionListIncludeMinuteLongSpellsAsActions: CurrentSettings['actionListIncludeMinuteLongSpellsAsActions'];
    actionListIncludeSpellsWithActiveEffects: CurrentSettings['actionListIncludeSpellsWithActiveEffects'];
    actionListLimitActionsToCantrips: CurrentSettings['actionListLimitActionsToCantrips'];
    alwaysShowNpcSkills: CurrentSettings['alwaysShowNpcSkills'];
    animateInspiration: CurrentSettings['animateInspiration'];
    hideIfZero: CurrentSettings['hideIfZero'];
    inlineActivitiesPosition: CurrentSettings['inlineActivitiesPosition'];
    moveCharacterTraitsToRightOfSkills: CurrentSettings['moveCharacterTraitsToRightOfSkills'];
    moveNpcTraitsToRightOfSkills: CurrentSettings['moveNpcTraitsToRightOfSkills'];
    showClassList: CurrentSettings['showClassList'];
    showEquippedAmmoOnly: CurrentSettings['showEquippedAmmoOnly'];
    showExhaustionOnHover: CurrentSettings['showExhaustionOnHover'];
    showInspirationOnHover: CurrentSettings['showInspirationOnHover'];
    showSpellbookTabNpc: CurrentSettings['showSpellbookTabNpc'];
    toggleEmptyCharacterSkills: CurrentSettings['toggleEmptyCharacterSkills'];
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
