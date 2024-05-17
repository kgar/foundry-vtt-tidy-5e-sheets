import type { Item5e } from 'src/types/item.types';
import type { SortMode } from 'src/types/types';

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

  static sortItems(items: Item5e[], sortMode: SortMode) {
    if (sortMode === 'a') {
      items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortMode === 'm') {
      items.sort((a, b) => (a.sort || 0) - (b.sort || 0));
    }
  }
}
