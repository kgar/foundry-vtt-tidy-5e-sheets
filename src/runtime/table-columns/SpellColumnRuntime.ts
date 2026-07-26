import { ColumnRuntimeBase } from './ColumnRuntimeBase';

class SpellColumnRuntimeImpl extends ColumnRuntimeBase<'spell'> {
  domain = 'spell' as const;
}

export const SpellColumnRuntime = new SpellColumnRuntimeImpl();
