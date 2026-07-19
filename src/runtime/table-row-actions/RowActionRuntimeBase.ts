import { foundryCoreSettings } from 'src/settings/settings.svelte';
import type { TableRowAction } from 'src/types/types';
import { checkCondition } from 'src/utils/iteration';

type ConditionArgs<T extends TableRowAction<any, any, any>> =
  T['condition'] extends ((args: infer A) => boolean) | undefined ? A : never;

export abstract class RowActionRuntimeBase<
  TRowAction extends TableRowAction<any, any, any>,
> {
  // TODO: Partition to Document Name, Document Type
  protected _rowActions: TRowAction[] = [];

  abstract readonly settingKey: string;

  initOnReady() {
    this._rowActions = this._getDefaultRowActions();
  }

  /**
   * Provides the default row actions for the implementation.
   */
  abstract _getDefaultRowActions(): TRowAction[];

  /**
   * Gets the row actions for a single row.
   */
  getRowActions(args: ConditionArgs<TRowAction>): TRowAction[] {
    /**  */
    return this._rowActions.filter((a) => checkCondition(a, args));
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
