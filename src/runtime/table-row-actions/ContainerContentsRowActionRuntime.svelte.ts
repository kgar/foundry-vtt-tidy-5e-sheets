import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class ContainerContentsRowActionRuntimeImpl extends RowActionRuntimeBase<'containerContents'> {
  domain = 'containerContents' as const;
}

export const ContainerContentsRowActionRuntime =
  new ContainerContentsRowActionRuntimeImpl();
