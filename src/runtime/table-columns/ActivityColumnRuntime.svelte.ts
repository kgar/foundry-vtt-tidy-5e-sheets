import { ColumnRuntimeBase } from './ColumnRuntimeBase';

class ActivityColumnRuntimeImpl extends ColumnRuntimeBase<'activity'> {
  domain = 'activity' as const;
}

export const ActivityColumnRuntime = new ActivityColumnRuntimeImpl();
