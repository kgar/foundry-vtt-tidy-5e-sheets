import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class EffectRowActionRuntimeImpl extends RowActionRuntimeBase<'effect'> {
  domain = 'effect' as const;
}

export const EffectRowActionRuntime = new EffectRowActionRuntimeImpl();
