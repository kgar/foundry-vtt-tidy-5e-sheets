import type { ExhaustionConfig } from 'src/features/exhaustion/exhaustion.types';
import type { CurrentSettings } from 'src/settings/settings.svelte';

export type WorldSettingsContext = {
  settings: {
    hideDeathSavesFromPlayers: CurrentSettings['hideDeathSavesFromPlayers'];
    defaultDeathSaveRoll: CurrentSettings['defaultDeathSaveRoll'];
    useCharacterEncumbranceBar: CurrentSettings['useCharacterEncumbranceBar'];
    useNpcEncumbranceBar: CurrentSettings['useNpcEncumbranceBar'];
    useVehicleEncumbranceBar: CurrentSettings['useVehicleEncumbranceBar'];
    showPlayerName: CurrentSettings['showPlayerName'];
    showExpandedLimitedView: CurrentSettings['showExpandedLimitedView'];
    itemCardsFixKey: CurrentSettings['itemCardsFixKey'];
    useCircularPortraitStyle: CurrentSettings['useCircularPortraitStyle'];
    limitEffectsManagementToGm: CurrentSettings['limitEffectsManagementToGm'];
    useCharacterInspiration: CurrentSettings['useCharacterInspiration'];
    useVehicleMotion: CurrentSettings['useVehicleMotion'];
    useExhaustion: CurrentSettings['useExhaustion'];
    showTraitLabels: CurrentSettings['showTraitLabels'];
    allowCantripsToBePrepared: CurrentSettings['allowCantripsToBePrepared'];
    allowHpMaxOverride: CurrentSettings['allowHpMaxOverride'];
    showActiveEffectsMarker: CurrentSettings['showActiveEffectsMarker'];
    useTotalSheetLock: CurrentSettings['useTotalSheetLock'];
    lockExpChanges: CurrentSettings['lockExpChanges'];
    lockHpMaxChanges: CurrentSettings['lockHpMaxChanges'];
    lockMoneyChanges: CurrentSettings['lockMoneyChanges'];
    lockLevelSelector: CurrentSettings['lockLevelSelector'];
    lockItemQuantity: CurrentSettings['lockItemQuantity'];
    initialNpcSheetTab: CurrentSettings['initialNpcSheetTab'];
    showNpcRestInChat: CurrentSettings['showNpcRestInChat'];
    showNpcActorLinkMarker: CurrentSettings['showNpcActorLinkMarker'];
    initialCharacterSheetTab: CurrentSettings['initialCharacterSheetTab'];
    initialVehicleSheetTab: CurrentSettings['initialVehicleSheetTab'];
    includeTidySectionFieldsInDefaultSheets: CurrentSettings['includeTidySectionFieldsInDefaultSheets'];
    itemIdentificationPermission: CurrentSettings['itemIdentificationPermission'];
    includeFlagsInSpellScrollCreation: CurrentSettings['includeFlagsInSpellScrollCreation'];
    useTidySpellSchoolIcons: CurrentSettings['useTidySpellSchoolIcons'];
    globalCustomSections: CurrentSettings['globalCustomSections'];
  };
  defaultNpcTabs: DefaultTabSelectionFields;
  defaultCharacterTabs: DefaultTabSelectionFields;
  defaultVehicleTabs: DefaultTabSelectionFields;
  exhaustionConfig: ExhaustionConfig;
  vehicleExhaustionConfig: ExhaustionConfig;
};

export type DefaultTabSelectionItem = {
  id: string;
  label: string;
};

export type DefaultTabSelectionFields = {
  available: DefaultTabSelectionItem[];
  selected: DefaultTabSelectionItem[];
};

export type WorldSettingsFunctions = {
  save(): Promise<void>;
  apply(): Promise<boolean>;
  resetDefaultTabs(sheetType: string): void;
};
