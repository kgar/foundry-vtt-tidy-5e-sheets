import { ColumnRuntimeBase } from './ColumnRuntimeBase';

class GroupMemberColumnRuntimeImpl extends ColumnRuntimeBase<'groupMember'> {
  domain = 'groupMember' as const;
}

export const GroupMemberColumnRuntime = new GroupMemberColumnRuntimeImpl();
