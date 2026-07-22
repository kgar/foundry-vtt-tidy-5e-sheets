import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class SpellRowActionRuntimeImpl extends RowActionRuntimeBase<'spell'> {
  domain = 'spell' as const;
}

export const SpellRowActionRuntime = new SpellRowActionRuntimeImpl();
