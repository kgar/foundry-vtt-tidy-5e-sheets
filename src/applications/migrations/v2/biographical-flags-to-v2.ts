import { isNil } from 'src/utils/data';

type TidyFlagToSystemMigrationMapping = {
  system: string;
  tidy: string;
  tidyDelete: string;
};

type BiographicalFlagsToV2MigrationParams = {
  document: any;
  overwrite: boolean;
  clearBiographicalFlagData: boolean;
};

const mappings: TidyFlagToSystemMigrationMapping[] = [
  {
    system: 'system.details.gender',
    tidy: 'flags.tidy5e-sheet.gender',
    tidyDelete: 'flags.tidy5e-sheet.-=gender',
  },
  {
    system: 'system.details.eyes',
    tidy: 'flags.tidy5e-sheet.eyes',
    tidyDelete: 'flags.tidy5e-sheet.-=eyes',
  },
  {
    system: 'system.details.height',
    tidy: 'flags.tidy5e-sheet.height',
    tidyDelete: 'flags.tidy5e-sheet.-=height',
  },
  {
    system: 'system.details.hair',
    tidy: 'flags.tidy5e-sheet.hair',
    tidyDelete: 'flags.tidy5e-sheet.-=hair',
  },
  {
    system: 'system.details.skin',
    tidy: 'flags.tidy5e-sheet.skin',
    tidyDelete: 'flags.tidy5e-sheet.-=skin',
  },
  {
    system: 'system.details.age',
    tidy: 'flags.tidy5e-sheet.age',
    tidyDelete: 'flags.tidy5e-sheet.-=age',
  },
  {
    system: 'system.details.weight',
    tidy: 'flags.tidy5e-sheet.weight',
    tidyDelete: 'flags.tidy5e-sheet.-=weight',
  },
];

export async function migrateBiographicalFlagsToV2Data(
  params: BiographicalFlagsToV2MigrationParams
) {
  const { document, overwrite, clearBiographicalFlagData } = params;
  let diff: Record<string, any> = {};
  for (let { system, tidy, tidyDelete } of mappings) {
    const systemValue = getProperty(document, system) ?? '';
    const tidyValue = getProperty(document, tidy) ?? '';
    if (isNil(systemValue, '') || overwrite) {
      diff[system] = tidyValue;
    }

    if (clearBiographicalFlagData) {
      diff[tidyDelete] = null;
    }
  }

  if (Object.keys(diff).length) {
    await document.update(diff);
  }
}
