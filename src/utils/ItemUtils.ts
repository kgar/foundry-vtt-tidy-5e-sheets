import type { Item5e } from 'src/types/item.types';
import type { SortMethodKeyClassic } from 'src/types/types';
import { isNil } from './data';

export class ItemUtils {
  static canUse(item: any): boolean {
    return (
      ItemUtils.hasActivationType(item) &&
      (ItemUtils.hasUnlimitedUses(item) ||
        ItemUtils.hasSufficientLimitedUses(item)) &&
      (!ItemUtils.hasConsumptionRequirements(item) ||
        ItemUtils.hasSufficientConsumptionAmount(item)) &&
      (!item.hasRecharge || !item.isOnCooldown) &&
      ItemUtils.atLeastOneExists(item)
    );
  }
  static atLeastOneExists(item: any): boolean {
    return (item.system.quantity ?? 1) >= 1;
  }
  static hasActivationType(item: any): boolean {
    return !!item.system.activities?.size;
  }
  static hasSpecificActivationType(item: Item5e, type: string) {
    return !!item.system.activities?.some(
      (a: any) => a.activation.type === type
    );
  }
  static hasUnlimitedUses(item: any): boolean {
    return !item.system.hasLimitedUses;
  }
  static hasSufficientLimitedUses(item: any): any {
    return ItemUtils.hasConfiguredUses(item) && item.system.uses?.value > 0;
  }
  static hasConfiguredUses(item: any) {
    return item.system.hasLimitedUses && item.system.uses.recovery.length;
  }
  static hasConsumptionRequirements(item: any): boolean {
    return !isNil(item.system.consume?.type, '');
  }
  static hasSufficientConsumptionAmount(item: any): boolean {
    const consumeTarget = item.parent?.items?.get(item.system.consume.target);
    return (
      // If there's no consume target, then we'll be permissive and allow the system to deal with whether it's usable
      // Note: this is intentionally ignoring non-item / non-item-use consumption scenarios like consuming attributes
      isNil(item.system.consume?.target, '') ||
      (consumeTarget?.system.quantity ??
        consumeTarget?.system.uses?.value ??
        0) >= item.system.consume?.amount
    );
  }
  static getMaxUses(item: Item5e) {
    return item.system.uses?.max;
  }

  static sortItems(items: Item5e[], sortMode: SortMethodKeyClassic) {
    if (sortMode === 'a') {
      items.sort((a, b) => a.name.localeCompare(b.name, game.i18n.lang));
    } else if (sortMode === 'm') {
      items.sort((a, b) => (a.sort || 0) - (b.sort || 0));
    }
  }

  static getSortedItems(items: Item5e[], sortMode: SortMethodKeyClassic) {
    if (sortMode === 'a') {
      return items.toSorted((a, b) =>
        a.name.localeCompare(b.name, game.i18n.lang)
      );
    } else if (sortMode === 'm') {
      return items.toSorted((a, b) => (a.sort || 0) - (b.sort || 0));
    }
    return items;
  }
}
