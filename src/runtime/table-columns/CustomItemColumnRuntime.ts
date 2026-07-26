import { ColumnRuntimeBase } from './ColumnRuntimeBase';

class CustomItemColumnRuntimeImpl extends ColumnRuntimeBase<'customItem'> {
  domain = 'customItem' as const;
}

export const CustomItemColumnRuntime = new CustomItemColumnRuntimeImpl();
