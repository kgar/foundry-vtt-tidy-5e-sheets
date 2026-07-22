import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class InventoryRowActionRuntimeImpl extends RowActionRuntimeBase<'inventory'> {
  domain = 'inventory' as const;
}

export const InventoryRowActionRuntime = new InventoryRowActionRuntimeImpl();
