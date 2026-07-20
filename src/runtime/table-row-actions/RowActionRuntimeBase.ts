import { foundryCoreSettings } from 'src/settings/settings.svelte';
import type { RowActionOf, RowActionRegistryDomain } from 'src/types/registry';
import type { TableRowAction } from 'src/types/types';
import { checkCondition } from 'src/utils/iteration';
import { debug } from 'src/utils/logging';

type ConditionArgs<T extends TableRowAction<any, any, any>> =
  T['condition'] extends ((args: infer A) => boolean) | undefined ? A : never;

export abstract class RowActionRuntimeBase<
  TDomain extends RowActionRegistryDomain,
  TRowAction extends TableRowAction<any, any, any> = RowActionOf<TDomain>,
> {
  abstract readonly domain: TDomain;

  // TODO: Partition to Document Name, Document Type; but where? In the registry?
  protected _rowActions: string[] = [];

  initOnReady() {
    this._rowActions = this._getDefaultRowActionKeys();
  }

  /**
   * Provides the default row actions for the implementation.
   * TODO: potentially move the default row actions to the registry as the default partition
   */
  abstract _getDefaultRowActionKeys(): string[];

  /**
   * Gets the row actions for a single row.
   */
  getRowActions(args: ConditionArgs<TRowAction>): TRowAction[] {
    const result = [];

    for (const key of this._rowActions) {
      const action = CONFIG.TIDY5E.rowActions[this.domain][key] as
        | TRowAction
        | undefined;

      if (action && checkCondition(action, args)) {
        result.push(action);
      } else if (!action) {
        debug('Action not found', { key, domain: this.domain, action, args });
      }
    }

    return result;
  }

  // TODO: Determine how to make managing row action styles less hardcoded and more configured.
  static calculateRowActionWidthRems(rowActionCount: number) {
    let paddingX = 0.1875;
    let buttonWidth = 1.5;
    return buttonWidth * rowActionCount + paddingX;
  }

  static getRowActionWidthInfo<TEntry>(
    entries: TEntry[],
    rowActionFn: (entry: TEntry) => any[] | undefined,
  ) {
    let maxRowActionsCount = 1;

    for (const entry of entries) {
      maxRowActionsCount = Math.max(
        maxRowActionsCount,
        (rowActionFn(entry) ?? []).length,
      );
    }

    const widthRems = this.calculateRowActionWidthRems(maxRowActionsCount);
    const widthPx = widthRems * foundryCoreSettings.value.fontSizePx;

    return {
      maxRowActionsCount,
      widthRems,
      widthPx,
    };
  }
}
