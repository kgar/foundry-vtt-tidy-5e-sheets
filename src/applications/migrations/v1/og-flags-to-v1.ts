import { CONSTANTS } from 'src/constants';
import { error } from 'src/utils/logging';

export async function migrateOgFlagsToV1() {
  // Flags to update
  const flagDifferences = [
    {
      v1: 'skillsExpanded',
      og: 'npcSkillsExpanded',
    },
  ];

  for (let actor of game.actors) {
    try {
      ui.notifications.info(
        `${actor.name}: Transferring Tidy data from ${CONSTANTS.ALPHA_MODULE_ID} to ${CONSTANTS.MODULE_ID}...`
      );

      let update: Record<string, any> = {};
      
      for (let diff of flagDifferences) {
        const flagValue = actor.flags[CONSTANTS.MODULE_ID]?.[diff.og];
        if (flagValue !== null) {
          update[diff.v1] = flagValue;
        }
      }

      if (Object.keys(update).length) {
        await actor.update({
          flags: {
            [CONSTANTS.MODULE_ID]: structuredClone(update),
          },
        });
      }

      ui.notifications.info(`${actor.name}: Transfer complete!`);
    } catch (e) {
      const message = `${actor.name}: Transfer failed. See devtools console error for more details.`;
      ui.notifications.error(
        message,
        { permanent: true }
      );
      error(message, false, e);
    }
  }
  // Go through each NPC sheet that is editable

  // Get flag value

  // Create diff update that removes the old flag and adds the new one.
}
