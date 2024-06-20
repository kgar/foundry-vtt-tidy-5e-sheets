import type { Item5e } from 'src/types/item.types';
import type { SortMode } from 'src/types/types';
import { isNil } from './data';

export class ItemUtils {
  static canUse(item: any): boolean {
    return (
      ItemUtils.hasActivationType(item) &&
      (ItemUtils.hasUnlimitedUses(item) ||
        ItemUtils.hasSufficientLimitedUses(item)) &&
      (!ItemUtils.hasConsumptionRequirements(item) ||
        ItemUtils.hasSufficientConsumptionAmount(item)) &&
      (!ItemUtils.hasRecharge(item) || ItemUtils.isCharged(item)) &&
      ItemUtils.atLeastOneExists(item)
    );
  }
  static atLeastOneExists(item: any): boolean {
    return (item.system.quantity ?? 1) >= 1;
  }
  static hasActivationType(item: any): boolean {
    return !isNil(item.system.activation?.type, '');
  }
  static hasUnlimitedUses(item: any): boolean {
    return isNil(item.system.uses?.per, '');
  }
  static hasSufficientLimitedUses(item: any): any {
    return ItemUtils.hasConfiguredUses(item) && item.system.uses?.value > 0;
  }
  static hasConfiguredUses(item: any) {
    return item.system.uses?.per !== null;
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
  static hasRecharge(item: any): boolean {
    return (item.system.recharge?.value ?? 0) > 0;
  }
  static isCharged(item: any): boolean {
    return item.system.recharge?.charged === true;
  }

  static getMaxUses(item: Item5e) {
    return item.system.uses?.max;
  }

  static sortItems(items: Item5e[], sortMode: SortMode) {
    if (sortMode === 'a') {
      items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortMode === 'm') {
      items.sort((a, b) => (a.sort || 0) - (b.sort || 0));
    }
  }
}
