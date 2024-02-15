import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { error } from 'src/utils/logging';

export async function migrateAlphaFlagsToV1() {
  for (let actor of game.actors) {
    try {
      await transferFlagData(actor);

      for (let item of actor.items) {
        await transferFlagData(item);
      }
    } catch (e) {
      const message = `${actor.name}: Transfer failed. See devtools console error for more details.`;
      ui.notifications.error(
        FoundryAdapter.localize(
          'TIDY5E.Settings.Migrations.migrationErrorMessage'
        ),
        { permanent: true }
      );
      error(message, false, e);
    }
  }

  for (let item of game.items) {
    try {
      await transferFlagData(item);
    } catch (e) {
      const message = `${item.name}: Transfer failed. See devtools console error for more details.`;
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

async function transferFlagData(document: any) {
  if (!document.flags[CONSTANTS.ALPHA_MODULE_ID]) {
    return;
  }

  await document.update({
    flags: {
      [CONSTANTS.MODULE_ID]: structuredClone(
        document.flags[CONSTANTS.ALPHA_MODULE_ID]
      ),
    },
  });
}
