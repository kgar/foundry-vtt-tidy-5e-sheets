import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { isNil } from 'src/utils/data';

type TidyFlagToSystemMigrationMapping = { system: string; tidy: string };

type BiographicalFlagsToV2MigrationParams = {
  document: any;
  overwrite: boolean;
  clearBiographicalFlagData: boolean;
};

const mappings: TidyFlagToSystemMigrationMapping[] = [
  { system: 'system.details.gender', tidy: 'flags.tidy5e-sheet.gender' },
  { system: 'system.details.eyes', tidy: 'flags.tidy5e-sheet.eyes' },
  { system: 'system.details.height', tidy: 'flags.tidy5e-sheet.height' },
  { system: 'system.details.hair', tidy: 'flags.tidy5e-sheet.hair' },
  { system: 'system.details.skin', tidy: 'flags.tidy5e-sheet.skin' },
  { system: 'system.details.age', tidy: 'flags.tidy5e-sheet.age' },
  { system: 'system.details.weight', tidy: 'flags.tidy5e-sheet.weight' },
];

export async function migrateBiographicalFlagsToV2Data(
  params: BiographicalFlagsToV2MigrationParams
) {
  const { document, overwrite, clearBiographicalFlagData } = params;
  let diff: Record<string, any> = {};
  for (let { system, tidy } of mappings) {
    const systemValue = getProperty(system);
    const tidyValue = getProperty(tidy);
    if (isNil(systemValue, '') || overwrite) {
      diff[system] = tidyValue;
    }

    if (clearBiographicalFlagData) {
      diff[`-=${tidy}`] = null;
    }
  }

  if (Object.keys(diff).length) {
    await document.update(diff);
  }
}
