import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class InventoryRowActionRuntimeImpl extends RowActionRuntimeBase<'inventory'> {
  domain = 'inventory' as const;

  override _getDefaultRowActionKeys() {
    return ['edit', 'delete', 'attune', 'equip', 'toggleSheetTab', 'menu'];
  }
}

export const InventoryRowActionRuntime = new InventoryRowActionRuntimeImpl();
