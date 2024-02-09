import type { ExhaustionConfig } from 'src/features/exhaustion/exhaustion.types';
import type { CurrentSettings } from 'src/settings/settings';
import type { Writable } from 'svelte/store';

export type WorldSettingsContext = {
  settings: {
    hideDeathSavesFromPlayers: CurrentSettings['hideDeathSavesFromPlayers'];
    useSpellSlotMarker: CurrentSettings['useSpellSlotMarker'];
    useCharacterEncumbranceBar: CurrentSettings['useCharacterEncumbranceBar'];
    useNpcEncumbranceBar: CurrentSettings['useNpcEncumbranceBar'];
    useVehicleEncumbranceBar: CurrentSettings['useVehicleEncumbranceBar'];
    showPlayerName: CurrentSettings['showPlayerName'];
    sortFavoriteItemsAlphabetically: CurrentSettings['sortFavoriteItemsAlphabetically'];
    showExpandedLimitedView: CurrentSettings['showExpandedLimitedView'];
    itemCardsFixKey: CurrentSettings['itemCardsFixKey'];
    useCircularPortraitStyle: CurrentSettings['useCircularPortraitStyle'];
    permanentlyUnlockCharacterSheetForGm: CurrentSettings['permanentlyUnlockCharacterSheetForGm'];
    permanentlyUnlockNpcSheetForGm: CurrentSettings['permanentlyUnlockNpcSheetForGm'];
    permanentlyUnlockVehicleSheetForGm: CurrentSettings['permanentlyUnlockVehicleSheetForGm'];
    limitEffectsManagementToGm: CurrentSettings['limitEffectsManagementToGm'];
    alwaysShowItemQuantity: CurrentSettings['alwaysShowItemQuantity'];
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
    lockConfigureSheet: CurrentSettings['lockConfigureSheet'];
    lockMoneyChanges: CurrentSettings['lockMoneyChanges'];
    lockLevelSelector: CurrentSettings['lockLevelSelector'];
    lockItemQuantity: CurrentSettings['lockItemQuantity'];
    initialNpcSheetTab: CurrentSettings['initialNpcSheetTab'];
    useNpcRest: CurrentSettings['useNpcRest'];
    showNpcRestInChat: CurrentSettings['showNpcRestInChat'];
    showNpcActorLinkMarker: CurrentSettings['showNpcActorLinkMarker'];
    initialCharacterSheetTab: CurrentSettings['initialCharacterSheetTab'];
    initialVehicleSheetTab: CurrentSettings['initialVehicleSheetTab'];
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
  save(context: WorldSettingsContext): Promise<void>;
  apply(context: WorldSettingsContext): Promise<boolean>;
  resetDefaultTabs(context: WorldSettingsContextStore, sheetType: string): void;
};

export type WorldSettingsContextStore = Writable<WorldSettingsContext>;
