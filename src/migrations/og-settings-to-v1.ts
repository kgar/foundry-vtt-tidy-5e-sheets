type SettingMap = {
  v1: string;
  og: string;
  convert?(setting: any): unknown;
};

/**
 * All settings whose names differ and optionally contain a conversion function to map to the correct value
 */
const settingsMap = [
  {
    v1: 'showTraitLabels',
    og: 'traitLabelsEnabled',
  },
  {
    v1: 'showPlayerName',
    og: 'playerNameEnabled',
  },
  {
    v1: 'showExpandedLimitedView',
    og: 'expandedSheetEnabled',
  },
  {
    v1: 'useCircularPortraitStyle',
    og: 'portraitStyle',
  },
  {
    v1: 'useTotalSheetLock',
    og: 'editTotalLockEnabled',
  },
  {
    v1: 'permanentlyUnlockCharacterSheetForGm',
    og: 'editGmAlwaysEnabled',
  },
  {
    v1: 'limitEffectsManagementToGm',
    og: 'editEffectsGmOnlyEnabled',
  },
  {
    v1: 'hideDeathSavesFromPlayers',
    og: 'hiddenDeathSavesEnabled',
  },
  {
    v1: 'useSpellSlotMarker',
    og: 'hideSpellSlotMarker',
    convert: (setting: any) => !setting,
  },
  {
    v1: 'alwaysShowItemQuantity',
    og: 'quantityAlwaysShownEnabled',
  },
  {
    v1: 'useExhaustion',
    og: 'exhaustionDisabled',
    convert: (setting: any) => !setting,
  },
  {
    v1: 'useCharacterInspiration',
    og: 'inspirationDisabled',
    convert: (setting: any) => !setting,
  },
  {
    v1: 'useNpcRest',
    og: 'restingForNpcsEnabled',
  },
  {
    v1: 'showNpcRestInChat',
    og: 'restingForNpcsChatDisabled',
    convert: (setting: any) => !setting,
  },
  {
    v1: 'showNpcActorLinkMarker',
    og: 'linkMarkerNpc',
  },
  {
    v1: 'showActiveEffectsMarker',
    og: 'activeEffectsMarker',
  },
  {
    v1: 'permanentlyUnlockNpcSheetForGm',
    og: 'enablePermanentUnlockOnNPCIfYouAreGM',
  },
  {
    v1: 'permanentlyUnlockVehicleSheetForGm',
    og: 'enablePermanentUnlockOnVehicleIfYouAreGM',
  },
  {
    v1: 'sortFavoriteItemsAlphabetically',
    og: 'enableSortFavoritesItemsAlphabetically',
  },
  {
    v1: 'allowCantripsToBePrepared',
    og: 'allowCantripToBePreparedOnContext',
  }
];

export function migrateOgSettingsToV1() {
  // grab all of the existing Tidy 5e settings
  // walk through OG settings, checking the map for mappings and optional conversions
  // convert each value using the map entry's conversion callback
  // save change
  // log success or error for each change
}
