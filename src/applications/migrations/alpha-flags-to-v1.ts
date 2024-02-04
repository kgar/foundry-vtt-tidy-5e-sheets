import { CONSTANTS } from 'src/constants';

export async function migrateAlphaFlagsToV1() {
  // Search for all sheet types at the global level
  // Change the `tidy5e-kgar` namespace to `tidy5e`
  for (let actor of game.actors) {
    try {
      ui.notifications.info(
        `${actor.name}: Transferring Tidy data from ${CONSTANTS.ALPHA_MODULE_ID} to ${CONSTANTS.MODULE_ID}...`
      );

      await transferFlagData(actor);

      for (let item of actor.items) {
        await transferFlagData(item);
      }

      ui.notifications.info(`${actor.name}: Transfer complete!`);
    } catch (e) {
      ui.notifications.error(
        `${actor.name}: Transfer failed. See devtools console error for more details.`,
        { permanent: true }
      );
      console.error(e);
    }
  }

  for (let item of game.items) {
    try {
      ui.notifications.info(
        `${item.name}: Transferring Tidy data from ${CONSTANTS.ALPHA_MODULE_ID} to ${CONSTANTS.MODULE_ID}...`
      );

      await transferFlagData(item);

      ui.notifications.info(`${item.name}: Transfer complete!`);
    } catch (e) {
      ui.notifications.error(
        `${item.name}: Transfer failed. See devtools console error for more details.`,
        { permanent: true }
      );
      console.error(e);
    }
  }
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

/* 
SCRATCH:
const moduleId = 'tidy5e-sheet';
const alphaModuleId = 'tidy5e-sheet-kgar';
const document = game.actors.get('inJZfC6VehiU1Dfx');
await document.update({
    flags: {
        [moduleId]: structuredClone(document.flags[alphaModuleId])
    }
});
*/
