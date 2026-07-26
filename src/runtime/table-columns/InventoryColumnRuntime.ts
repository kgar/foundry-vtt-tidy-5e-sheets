import { ColumnRuntimeBase } from './ColumnRuntimeBase';

class InventoryColumnRuntimeImpl extends ColumnRuntimeBase<'inventory'> {
  domain = 'inventory' as const;
}

export const InventoryColumnRuntime = new InventoryColumnRuntimeImpl();
