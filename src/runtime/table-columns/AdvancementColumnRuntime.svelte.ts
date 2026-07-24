import { ColumnRuntimeBase } from './ColumnRuntimeBase';

class AdvancementColumnRuntimeImpl extends ColumnRuntimeBase<'itemAdvancement'> {
  domain = 'itemAdvancement' as const;
}

export const AdvancementColumnRuntime = new AdvancementColumnRuntimeImpl();
