import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class AssignedCrewMemberRowActionRuntimeImpl extends RowActionRuntimeBase<'assignedCrew'> {
  domain = 'assignedCrew' as const;
}

export const AssignedCrewMemberRowActionRuntime =
  new AssignedCrewMemberRowActionRuntimeImpl();
