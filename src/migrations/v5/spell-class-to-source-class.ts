import { TidyFlags } from 'src/api';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Item5e } from 'src/types/item.types';
import { error } from 'src/utils/logging';

const tidyFlagParentClass = 'parentClass';

type SpellClassToSourceClassMigrationParams = {
  item: Item5e;
  overwrite: boolean;
  clearFlagData: boolean;
};

export async function migrateSpellClassToSourceClass({
  item,
  clearFlagData,
  overwrite,
}: SpellClassToSourceClassMigrationParams) {
  if (!item) {
    return;
  }

  try {
    let updates: Record<string, string> = {};

    let sourceClass = (item.system.sourceClass ?? '').trim();
    if (sourceClass === '' || overwrite) {
      updates['system.sourceClass'] =
        TidyFlags.tryGetFlag(item, tidyFlagParentClass) ?? '';
    }

    if (Object.keys(updates).length > 0) {
      await item.update(updates);
    }

    if (clearFlagData) {
      await TidyFlags.unsetFlag(item, tidyFlagParentClass);
    }
  } catch (e) {
    error("An error occurred while migrating an item's parent class", false, {
      error: e,
      item,
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
