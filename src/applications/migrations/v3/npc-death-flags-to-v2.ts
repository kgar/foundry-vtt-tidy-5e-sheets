import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Actor5e } from 'src/types/types';

type TidyDeath = {
  success: boolean;
  failure: boolean;
};

type NpcDeathFlagToV2MigrationParams = {
  npc: Actor5e;
  overwrite: boolean;
  clearDeathFlagData: boolean;
};

export async function migrateNpcDeathFlagsToV2({
  npc,
  overwrite,
  clearDeathFlagData,
}: NpcDeathFlagToV2MigrationParams) {
  const tidyDeath = FoundryAdapter.tryGetFlag<TidyDeath | undefined>(
    npc,
    'death'
  );

  if (!tidyDeath) {
    return;
  }

  const systemDeath = npc.system.attributes?.death;

  if (!systemDeath) {
    return;
  }

  const update: Record<string, any> = {};

  if (systemDeath?.success === 0 || overwrite) {
    update['system.attributes.death.success'] = tidyDeath.success;
  }

  if (systemDeath?.failure === 0 || overwrite) {
    update['system.attributes.death.failure'] = tidyDeath.failure;
  }

  if (Object.keys(systemDeath).length) {
    await npc.update(update);
  }

  if (clearDeathFlagData) {
    FoundryAdapter.unsetFlag(npc, 'death');
  }
}
