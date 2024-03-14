import type { Item5e } from 'src/types/item.types';

export class ItemUtils {
  static hasAvailableUses(item: Item5e) {
    return ItemUtils.hasConfiguredUses(item) && item.system.uses?.value > 0;
  }

  static hasConfiguredUses(item: any) {
    return item.system.uses?.per !== null;
  }

  static getMaxUses(item: Item5e) {
    return item.system.uses?.max;
  }
}
