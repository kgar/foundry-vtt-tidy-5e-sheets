import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Actor5e } from 'src/types/types';

type TidyDeath = {
  success: boolean;
  failure: boolean;
};

type NpcDeathFlagToV2MigrationParams = {
  document: Actor5e;
  overwrite: boolean;
  clearDeathFlagData: boolean;
};

export async function migrateNpcDeathFlagsToV2({
  document,
  overwrite,
  clearDeathFlagData,
}: NpcDeathFlagToV2MigrationParams) {
  const tidyDeath = FoundryAdapter.tryGetFlag<TidyDeath | undefined>(
    document,
    'death'
  );

  if (!tidyDeath) {
    return;
  }

  const systemDeath = document.system.attributes.death;

  const update: Record<string, any> = {};

  if (systemDeath?.success === 0 || overwrite) {
    update['system.attributes.death.success'] = tidyDeath.success;
  }

  if (systemDeath?.failure === 0 || overwrite) {
    update['system.attributes.death.failure'] = tidyDeath.failure;
  }

  if (Object.keys(systemDeath).length) {
    await document.update(update);
  }

  if (clearDeathFlagData) {
    FoundryAdapter.unsetFlag(document, 'death');
  }
}
