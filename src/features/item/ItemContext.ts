import { CONSTANTS } from 'src/constants';
import type { Item5e } from 'src/types/item.types';
import type { ItemSaveContext } from 'src/types/types';

export class ItemContext {
  static isSuppressedByAntimagic(item: Item5e): boolean {
    if (!item.actor?.statuses.has(CONSTANTS.STATUS_ANTIMAGIC)) {
      return false;
    }

    return (
      item.type === CONSTANTS.ITEM_TYPE_SPELL ||
      (item.type === CONSTANTS.ITEM_TYPE_CONSUMABLE &&
        item.system.type?.value === 'scroll') ||
      !!item.system.properties?.has('mgc') ||
      !!item.system.activities?.some(
        (activity: any) => activity.visibility?.requireMagic,
      )
    );
  }

  static getItemSaveContext(item: Item5e): ItemSaveContext | undefined {
    let activitySave = {
      ...item.system.activities?.getByType(CONSTANTS.ACTIVITY_TYPE_SAVE)[0]
        ?.save,
    };

    if (activitySave) {
      const ability = activitySave.ability?.size
        ? activitySave.ability.size === 1
          ? CONFIG.DND5E.abilities[activitySave.ability.first()]?.abbreviation
          : game.i18n.localize('DND5E.AbbreviationDC')
        : null;

      const abilityTitle = CONFIG.DND5E.abilities[ability]?.label;

      return {
        ability,
        abilityTitle,
        multipleAbilities: activitySave.ability?.size > 1,
        dc: activitySave.dc,
      };
    }
  }

  static getToHit(item: Item5e): number | null {
    const toHit = parseInt(item.labels.modifier);
    return item.hasAttack && !isNaN(toHit) ? toHit : null;
  }
}
