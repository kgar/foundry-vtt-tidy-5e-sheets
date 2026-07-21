import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class GroupMemberRowActionRuntimeImpl extends RowActionRuntimeBase<'groupMember'> {
  domain = 'groupMember' as const;
}

export const GroupMemberRowActionRuntime =
  new GroupMemberRowActionRuntimeImpl();
