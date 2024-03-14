import type { Item5e } from 'src/types/item.types';

export class ItemUtils {
  static hasUses(item: Item5e) {
    return item.system.uses?.value > 0 && item.system.uses?.max > 0;
  }
}
