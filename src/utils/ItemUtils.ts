import type { Item5e } from 'src/types/item.types';
import { isNil } from './data';
import { warn } from './logging';
import { ItemSortRuntime } from 'src/runtime/item/ItemSortRuntime.svelte';

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

  static sortItems(items: Item5e[], sortMode: string) {
    this.#sortImpl(items.sort.bind(items), items, sortMode);
  }

  static getSortedItems(items: Item5e[], sortMode: string) {
    return this.#sortImpl(items.toSorted.bind(items), items, sortMode);
  }

  static #sortImpl(
    sortMethod: SortImplementation,
    items: Item5e[],
    sortMode: string
  ): ReturnType<SortImplementation> {
    const comparator =
      ItemSortRuntime._registeredItemSorts[sortMode]?.comparator;

    if (comparator) {
      return sortMethod(comparator);
    }

    warn(`Sort method with key ${sortMode} not found. Returning items as is.`);
    return items;
  }
}
type SortImplementation =
  | typeof Array.prototype.sort
  | typeof Array.prototype.toSorted;
