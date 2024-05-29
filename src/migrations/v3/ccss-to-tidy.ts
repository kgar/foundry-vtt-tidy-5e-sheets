import { TidyFlags } from 'src/api';
import type { Item5e } from 'src/types/item.types';
import { isNil } from 'src/utils/data';
import { debug, error } from 'src/utils/logging';

type CcssToTidyItemMigrationParams = {
  item: Item5e;
  overwrite: boolean;
  clearCcssFlagData: boolean;
};

export const ccssFlagPropPath =
  'flags.custom-character-sheet-sections.sectionName' as const;

export async function migrateCcssToTidyForItem({
  item,
  overwrite,
  clearCcssFlagData,
}: CcssToTidyItemMigrationParams) {
  try {
    const sectionName = getCcssSectionName(item);

    if (isNil(sectionName, '')) {
      return;
    }

    const tidySection = TidyFlags.section.get(item);

    const shouldUpdateTidy = isNil(tidySection, '') || overwrite;

    if (shouldUpdateTidy) {
      TidyFlags.section.set(item, sectionName);
    }

    if (clearCcssFlagData) {
      item.update({
        'flags.custom-character-sheet-sections.-=sectionName': null,
      });
    }
  } catch (e) {
    error('An error occurred while migrating CCSS data from item.', false, e);
    debug('CCSS Item Migration troubleshooting info', {
      item: item?.toObject?.(),
      overwrite,
      clearCcssFlagData,
    });
  }
}

export function getCcssSectionName(item: Item5e) {
  return foundry.utils.getProperty(item, ccssFlagPropPath)?.trim();
}
