import { TidyFlags } from 'src/api';
import type { Item5e } from 'src/types/item.types';
import type { Actor5e } from 'src/types/types';
import { isNil } from 'src/utils/data';
import { debug, error } from 'src/utils/logging';

type CcssToTidyItemMigrationParams = {
  item: Item5e;
  overwrite: boolean;
  clearCcssFlagData: boolean;
};

type CcssToTidyActorMigrationParams = {
  actor: Actor5e;
  overwrite: boolean;
  clearCcssFlagData: boolean;
};

export async function migrateCcssToTidyForItem({
  item,
  overwrite,
  clearCcssFlagData,
}: CcssToTidyItemMigrationParams) {
  try {
    const sectionName = foundry.utils
      .getProperty(item, 'flags.custom-character-sheet-sections.sectionName')
      ?.trim();

    if (isNil(sectionName, '')) {
      return;
    }

    const tidySection = TidyFlags.section.get(item);

    const shouldUpdateTidy = isNil(tidySection, '') || overwrite;

    if (shouldUpdateTidy) {
      TidyFlags.section.set(item, sectionName);
    }

    if (clearCcssFlagData) {
      item.unsetFlag('custom-character-sheet-sections', 'sectionName');
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

export async function migrateCcssToTidyForActor({
  actor,
  overwrite,
  clearCcssFlagData,
}: CcssToTidyActorMigrationParams) {
  actor.items?.forEach((item: Item5e) =>
    migrateCcssToTidyForItem({ item, overwrite, clearCcssFlagData })
  );
}
