import { TidyFlags } from 'src/foundry/TidyFlags';
import type { Actor5e } from 'src/types/types';

type NpcExhaustionToSystemMigrationParams = {
  npc: Actor5e;
  clearFlagData: boolean;
};

const exhaustionFlag = 'exhaustion';

export async function migrateNpcExhaustionToSystem({
  npc,
  clearFlagData,
}: NpcExhaustionToSystemMigrationParams) {
  const tidyExhaustion = TidyFlags.tryGetFlag<number | undefined>(
    npc,
    exhaustionFlag
  );

  if (tidyExhaustion === null || tidyExhaustion === undefined) {
    return;
  }

  await npc.update({
    'system.attributes.exhaustion': tidyExhaustion,
  });

  if (clearFlagData) {
    TidyFlags.unsetFlag(npc, exhaustionFlag);
  }
}
