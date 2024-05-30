import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { error } from 'src/utils/logging';

export async function migrateOgFlagsToV1() {
  const flagDifferences = [
    {
      v1: 'skillsExpanded',
      og: 'npcSkillsExpanded',
    },
  ];

  for (let actor of game.actors) {
    try {
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
            [CONSTANTS.MODULE_ID]: update,
          },
        });
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

  ui.notifications.info(
    FoundryAdapter.localize(
      'TIDY5E.Settings.Migrations.migrationCompleteMessage'
    )
  );
}
