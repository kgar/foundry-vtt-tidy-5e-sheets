import { ColumnRuntimeBase } from './ColumnRuntimeBase';

class FeatureColumnRuntimeImpl extends ColumnRuntimeBase<'feature'> {
  domain = 'feature' as const;
}

export const FeatureColumnRuntime = new FeatureColumnRuntimeImpl();
