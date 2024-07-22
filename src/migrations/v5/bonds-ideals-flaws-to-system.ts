import { TidyFlags } from 'src/api';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Actor5e } from 'src/types/types';
import { error } from 'src/utils/logging';

const tidyFlagIdeal = 'ideal';
const tidyFlagBond = 'bond';
const tidyFlagFlaw = 'flaw';

type BondsIdealsFlawsToSystemMigrationParams = {
  npc: Actor5e;
  overwrite: boolean;
  clearFlagData: boolean;
};

export async function migrateBondsIdealsFlawsToSystem({
  npc,
  clearFlagData,
  overwrite,
}: BondsIdealsFlawsToSystemMigrationParams) {
  if (!npc) {
    return;
  }

  try {
    let updates: Record<string, string> = {};

    let systemBond = (npc.system.detail.bond ?? '').trim();
    if (systemBond === '' || overwrite) {
      updates['system.detail.bond'] =
        TidyFlags.tryGetFlag(npc, tidyFlagBond) ?? '';
    }

    let systemIdeal = (npc.system.detail.ideal ?? '').trim();
    if (systemIdeal === '' || overwrite) {
      updates['system.detail.ideal'] =
        TidyFlags.tryGetFlag(npc, tidyFlagIdeal) ?? '';
    }

    let systemFlaw = (npc.system.detail.flaw ?? '').trim();
    if (systemFlaw === '' || overwrite) {
      updates['system.detail.flaw'] =
        TidyFlags.tryGetFlag(npc, tidyFlagFlaw) ?? '';
    }

    if (Object.keys(updates).length > 0) {
      await npc.update(updates);
    }

    if (clearFlagData) {
      await TidyFlags.unsetFlag(npc, tidyFlagIdeal);
      await TidyFlags.unsetFlag(npc, tidyFlagBond);
      await TidyFlags.unsetFlag(npc, tidyFlagFlaw);
    }
  } catch (e) {
    error("An error occurred while migrating an actor's favorites", false, {
      error: e,
      actor: npc,
      clearFlagData,
      overwrite,
    });
    error(
      FoundryAdapter.localize(
        'TIDY5E.Settings.Migrations.migrationErrorMessage'
      ),
      true
    );
  }
}
