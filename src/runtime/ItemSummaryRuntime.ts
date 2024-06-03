import type { ItemSummaryCommand } from 'src/api/api.types';
import type { RegisteredItemSummaryCommand } from './types';
import type { Item5e } from 'src/types/item.types';

export class ItemSummaryRuntime {
  private static _itemSummaryCommands: RegisteredItemSummaryCommand[] = [];

  static registerItemSummaryCommands(commands: ItemSummaryCommand[]) {
    ItemSummaryRuntime._itemSummaryCommands.push(...commands);
  }

  static getItemSummaryCommands(item: Item5e): RegisteredItemSummaryCommand[] {
    return [...ItemSummaryRuntime._itemSummaryCommands].filter(
      (c) => item && (c.enabled?.({ item }) ?? true)
    );
  }
}
