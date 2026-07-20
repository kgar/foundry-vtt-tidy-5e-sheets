import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class ActivityRowActionRuntimeImpl extends RowActionRuntimeBase<'activity'> {
  domain = 'activity' as const;

  override _getDefaultRowActionKeys() {
    return ['edit', 'delete', 'menu'];
  }
}

export const ActivityRowActionRuntime = new ActivityRowActionRuntimeImpl();
