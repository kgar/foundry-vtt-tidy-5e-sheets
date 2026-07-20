import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class ItemAdvancementMemberRowActionRuntimeImpl extends RowActionRuntimeBase<'itemAdvancement'> {
  domain = 'itemAdvancement' as const;

  override _getDefaultRowActionKeys() {
    return ['edit', 'delete', 'menu'];
  }
}

export const ItemAdvancementMemberRowActionRuntime =
  new ItemAdvancementMemberRowActionRuntimeImpl();
