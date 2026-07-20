import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class SpellRowActionRuntimeImpl extends RowActionRuntimeBase<'spell'> {
  domain = 'spell' as const;

  override _getDefaultRowActionKeys() {
    return [
      'spell',
      'edit',
      'delete',
      'openActivity',
      'toggleSheetTab',
      'menu',
    ];
  }
}

export const SpellRowActionRuntime = new SpellRowActionRuntimeImpl();
