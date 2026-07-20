import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class ContainerContentsRowActionRuntimeImpl extends RowActionRuntimeBase<'containerContents'> {
  domain = 'containerContents' as const;

  override _getDefaultRowActionKeys() {
    return ['edit', 'delete', 'toggleSheetTab', 'menu'];
  }
}

export const ContainerContentsRowActionRuntime =
  new ContainerContentsRowActionRuntimeImpl();
