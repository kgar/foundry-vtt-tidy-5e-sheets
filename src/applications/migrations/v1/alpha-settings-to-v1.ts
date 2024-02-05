import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { error } from 'src/utils/logging';

export async function migrateAlphaSettingsToV1() {
  const alphaGmSettings = game.settings.storage
    .get('world')
    .filter((s: any) => s.key.startsWith(CONSTANTS.ALPHA_MODULE_ID));

  for (let setting of alphaGmSettings) {
    try {
      const key = setting.key.replace(`${CONSTANTS.ALPHA_MODULE_ID}.`, '');
      if (game.settings.settings.has(`${CONSTANTS.MODULE_ID}.${key}`)) {
        await game.settings.set(CONSTANTS.MODULE_ID, key, setting.value);
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
