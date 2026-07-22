import type { ItemSummaryCommand } from 'src/api/api.types';
import { CONSTANTS } from 'src/constants';
import type { RegisteredItemSummaryCommand } from './types';
import type { Item5e } from 'src/types/item.types';

export class ItemSummaryRuntime {
  private static _itemSummaryCommands: RegisteredItemSummaryCommand[] = [
    {
      execute: (params) => params.item.displayCard(),
      label: 'DND5E.DisplayCard',
      iconClass: 'fa-solid fa-message-arrow-up-right',
    },
    {
      execute: (params) =>
        params.item.parent.sheet.renderChild(params.item.sheet, {
          force: true,
          mode: CONSTANTS.SHEET_MODE_PLAY,
        }),
      label: 'TIDY5E.ContextMenuActionView',
      iconClass: 'fa-solid fa-eye',
    },
    // TODO: kgar help, there's no way to collapse an item right now
    // {
    //   id: 'collapse',
    //   execute: (params) => params.toggleSummary?.(false),
    //   iconClass: 'fa-solid fa-chevron-up',
    // },
  ];

  static registerItemSummaryCommands(commands: ItemSummaryCommand[]) {
    ItemSummaryRuntime._itemSummaryCommands.push(...commands);
  }

  static getItemSummaryCommands(item: Item5e): RegisteredItemSummaryCommand[] {
    return [...ItemSummaryRuntime._itemSummaryCommands].filter(
      (c) => item && (c.enabled?.({ item }) ?? true)
    );
  }
}
