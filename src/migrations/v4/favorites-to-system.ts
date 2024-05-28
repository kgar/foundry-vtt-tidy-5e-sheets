import { TidyFlags } from 'src/api';
import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Item5e } from 'src/types/item.types';
import type { Actor5e } from 'src/types/types';
import { error } from 'src/utils/logging';

const tidyFlagFavorite = 'favorite';

type FavoritesToSystemMigrationParams = {
  pc: Actor5e;
  clearFavoriteFlagData: boolean;
};

export async function migrateFavoritesToSystem({
  pc,
  clearFavoriteFlagData,
}: FavoritesToSystemMigrationParams) {
  if (!pc) {
    return;
  }

  try {
    // get all embedded items with favorites flag
    const tidyFavorites = Array.from<Item5e>(pc.items).filter(
      (i: Item5e) => !!i.flags[CONSTANTS.MODULE_ID]?.favorite
    );

    for (const favorite of tidyFavorites) {
      pc.system.addFavorite({ id: favorite.getRelativeUUID(pc), type: 'item' });

      if (clearFavoriteFlagData) {
        TidyFlags.unsetFlag(favorite, tidyFlagFavorite);
      }
    }
  } catch (e) {
    error("An error occurred while migrating an actor's favorites", false, {
      error: e,
      actor: pc,
    });
    error(
      FoundryAdapter.localize(
        'TIDY5E.Settings.Migrations.migrationErrorMessage'
      ),
      true
    );
  }
}
