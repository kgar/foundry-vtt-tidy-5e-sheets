import { ColumnRuntimeBase } from './ColumnRuntimeBase';

class EffectColumnRuntimeImpl extends ColumnRuntimeBase<'effect'> {
  domain = 'effect' as const;
}

export const EffectColumnRuntime = new EffectColumnRuntimeImpl();
