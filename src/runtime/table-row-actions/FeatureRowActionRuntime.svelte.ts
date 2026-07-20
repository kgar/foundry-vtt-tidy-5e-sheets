import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class FeatureRowActionRuntimeImpl extends RowActionRuntimeBase<'feature'> {
  domain = 'feature' as const;

  override _getDefaultRowActionKeys() {
    return ['edit', 'delete', 'toggleSheetTab', 'menu'];
  }
}

export const FeatureRowActionRuntime = new FeatureRowActionRuntimeImpl();
