import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class ActivityRowActionRuntimeImpl extends RowActionRuntimeBase<'activity'> {
  domain = 'activity' as const;
}

export const ActivityRowActionRuntime = new ActivityRowActionRuntimeImpl();
