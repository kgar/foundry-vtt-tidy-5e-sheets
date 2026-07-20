import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class GroupMemberRowActionRuntimeImpl extends RowActionRuntimeBase<'groupMember'> {
  domain = 'groupMember' as const;

  override _getDefaultRowActionKeys() {
    return ['remove', 'menu'];
  }
}

export const GroupMemberRowActionRuntime =
  new GroupMemberRowActionRuntimeImpl();
