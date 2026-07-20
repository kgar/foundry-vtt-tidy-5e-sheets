import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class EffectRowActionRuntimeImpl extends RowActionRuntimeBase<'effect'> {
  domain = 'effect' as const;

  override _getDefaultRowActionKeys() {
    return ['toggle', 'edit', 'delete', 'menu'];
  }
}

export const EffectRowActionRuntime = new EffectRowActionRuntimeImpl();
