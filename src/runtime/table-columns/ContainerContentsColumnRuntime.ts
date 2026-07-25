import { ColumnRuntimeBase } from './ColumnRuntimeBase';

class ContainerContentsColumnRuntimeImpl extends ColumnRuntimeBase<'containerContents'> {
  domain = 'containerContents' as const;
}

export const ContainerContentsColumnRuntime = new ContainerContentsColumnRuntimeImpl();
