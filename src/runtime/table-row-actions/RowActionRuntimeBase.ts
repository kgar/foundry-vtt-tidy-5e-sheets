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
}
