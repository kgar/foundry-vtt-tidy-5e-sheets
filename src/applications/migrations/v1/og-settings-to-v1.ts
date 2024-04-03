import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { error } from 'src/utils/logging';

type SettingMap = {
  v1Key: string;
  ogKey: string;
  convert?(setting: any): unknown;
};

/**
 * All settings whose names differ and optionally contain a conversion function to map to the correct value
 */
const settingsMap: SettingMap[] = [
  {
    v1Key: 'showTraitLabels',
    ogKey: 'traitLabelsEnabled',
  },
  {
    v1Key: 'showPlayerName',
    ogKey: 'playerNameEnabled',
  },
  {
    v1Key: 'showExpandedLimitedView',
    ogKey: 'expandedSheetEnabled',
  },
  {
    v1Key: 'useCircularPortraitStyle',
    ogKey: 'portraitStyle',
  },
  {
    v1Key: 'useTotalSheetLock',
    ogKey: 'editTotalLockEnabled',
  },
  {
    v1Key: 'permanentlyUnlockCharacterSheetForGm',
    ogKey: 'editGmAlwaysEnabled',
  },
  {
    v1Key: 'limitEffectsManagementToGm',
    ogKey: 'editEffectsGmOnlyEnabled',
  },
  {
    v1Key: 'hideDeathSavesFromPlayers',
    ogKey: 'hiddenDeathSavesEnabled',
  },
  {
    v1Key: 'useExhaustion',
    ogKey: 'exhaustionDisabled',
    convert: (setting: any) => !setting,
  },
  {
    v1Key: 'useCharacterInspiration',
    ogKey: 'inspirationDisabled',
    convert: (setting: any) => !setting,
  },
  {
    v1Key: 'useNpcRest',
    ogKey: 'restingForNpcsEnabled',
  },
  {
    v1Key: 'showNpcRestInChat',
    ogKey: 'restingForNpcsChatDisabled',
    convert: (setting: any) => !setting,
  },
  {
    v1Key: 'showNpcActorLinkMarker',
    ogKey: 'linkMarkerNpc',
  },
  {
    v1Key: 'showActiveEffectsMarker',
    ogKey: 'activeEffectsMarker',
  },
  {
    v1Key: 'permanentlyUnlockNpcSheetForGm',
    ogKey: 'enablePermanentUnlockOnNPCIfYouAreGM',
  },
  {
    v1Key: 'permanentlyUnlockVehicleSheetForGm',
    ogKey: 'enablePermanentUnlockOnVehicleIfYouAreGM',
  },
  {
    v1Key: 'allowCantripsToBePrepared',
    ogKey: 'allowCantripToBePreparedOnContext',
  },
];

export async function migrateOgSettingsToV1() {
  const tidyGmSettings = game.settings.storage
    .get('world')
    .filter((s: any) => s.key.startsWith(CONSTANTS.MODULE_ID));

  for (let setting of tidyGmSettings) {
    try {
      const originalKey = setting.key.replace(`${CONSTANTS.MODULE_ID}.`, '');

      const mappedSetting = settingsMap.find((s) => s.ogKey === originalKey);

      if (!mappedSetting) {
        continue;
      }

      const value = mappedSetting.convert
        ? mappedSetting.convert(setting.value)
        : setting.value;

      if (
        game.settings.settings.has(
          `${CONSTANTS.MODULE_ID}.${mappedSetting.v1Key}`
        )
      ) {
        await game.settings.set(
          CONSTANTS.MODULE_ID,
          mappedSetting.v1Key,
          value
        );
      }
    } catch (e) {
      const message = `An error occurred while remapping setting "${setting.key}"`;
      ui.notifications.error(
        FoundryAdapter.localize(
          'TIDY5E.Settings.Migrations.migrationErrorMessage'
        ),
        { permanent: true }
      );
      error(message, false, e);
    }
  }

  ui.notifications.info(
    FoundryAdapter.localize(
      'TIDY5E.Settings.Migrations.migrationCompleteMessage'
    )
  );
}
