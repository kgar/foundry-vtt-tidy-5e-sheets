import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class FeatureRowActionRuntimeImpl extends RowActionRuntimeBase<'feature'> {
  domain = 'feature' as const;
}

export const FeatureRowActionRuntime = new FeatureRowActionRuntimeImpl();
