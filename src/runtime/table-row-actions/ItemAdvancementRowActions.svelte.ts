import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class ItemAdvancementMemberRowActionRuntimeImpl extends RowActionRuntimeBase<'itemAdvancement'> {
  domain = 'itemAdvancement' as const;
}

export const ItemAdvancementMemberRowActionRuntime =
  new ItemAdvancementMemberRowActionRuntimeImpl();
