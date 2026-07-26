import type { ItemSummaryCommand } from 'src/api/api.types';
import { CONSTANTS } from 'src/constants';
import type {
  ItemSummaryCommandContext,
  RegisteredItemSummaryCommand,
  RegisteredItemSummaryCommandEnabledParams,
  RegisteredItemSummaryCommandExecuteParams,
} from './types';
import type { Item5e } from 'src/types/item.types';

function isContainer(item: Item5e) {
  return item.type === CONSTANTS.ITEM_TYPE_CONTAINER;
}

/** Contents can only be toggled for expandable items like containers. */
function canToggleContainerContents(
  params: RegisteredItemSummaryCommandEnabledParams,
) {
  return (
    isContainer(params.item) && !!params.inlineToggleService && !!params.tabId
  );
}

function openItemSheet(params: RegisteredItemSummaryCommandExecuteParams) {
  params.item.parent.sheet.renderChild(params.item.sheet, {
    force: true,
    mode: CONSTANTS.SHEET_MODE_PLAY,
  });
}

function toggleContainerContents(
  params: RegisteredItemSummaryCommandExecuteParams,
) {
  if (!params.tabId) {
    return;
  }
  params.inlineToggleService?.toggle(
    params.tabId,
    params.item.id,
    !params.containerContentsExpanded,
  );
}

export class ItemSummaryRuntime {
  private static _itemSummaryCommands: RegisteredItemSummaryCommand[] = [
    {
      enabled: canToggleContainerContents,
      execute: toggleContainerContents,
      label: (params) =>
        params.containerContentsExpanded
          ? 'TIDY5E.Commands.HideContainerPanel'
          : 'TIDY5E.Commands.ShowContainerPanel',
      iconClass: (params) =>
        params.containerContentsExpanded
          ? 'fa-solid fa-angle-down'
          : 'fa-solid fa-angle-right',
    },
    {
      execute: (params) => params.item.displayCard(),
      tooltip: 'DND5E.DisplayCard',
      iconClass: 'fa-solid fa-message-arrow-up-right',
    },
    {
      execute: openItemSheet,
      tooltip: 'TIDY5E.ContextMenuActionView',
      iconClass: (params) =>
        isContainer(params.item) ? 'fa-solid fa-box-open' : 'fa-solid fa-eye',
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

  static getItemSummaryCommands(
    item: Item5e,
    context: ItemSummaryCommandContext = {},
  ): RegisteredItemSummaryCommand[] {
    const params = { item, ...context };

    return ItemSummaryRuntime._itemSummaryCommands.filter(
      (c) => !!item && (c.enabled?.(params) ?? true),
    );
  }
}
