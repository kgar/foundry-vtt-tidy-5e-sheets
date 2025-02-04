import { CONSTANTS } from 'src/constants';
import type { Item5e } from 'src/types/item.types';
import type { ItemSaveContext } from 'src/types/types';

export class ItemContext {
  static getItemSaveContext(item: Item5e): ItemSaveContext | undefined {
    let activitySave = {
      ...item.system.activities?.getByType(CONSTANTS.ACTIVITY_TYPE_SAVE)[0]
        ?.save,
    };

    if (activitySave) {
      return {
        ability: activitySave.ability?.size
          ? activitySave.ability.size === 1
            ? CONFIG.DND5E.abilities[activitySave.ability.first()]?.abbreviation
            : game.i18n.localize('DND5E.AbbreviationDC')
          : null,
        dc: activitySave.dc,
      };
    }
  }
}
