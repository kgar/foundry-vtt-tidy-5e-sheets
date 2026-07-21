import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class AssignedCrewMemberRowActionRuntimeImpl extends RowActionRuntimeBase<'vehicleAssignedCrew'> {
  domain = 'vehicleAssignedCrew' as const;
}

export const AssignedCrewMemberRowActionRuntime =
  new AssignedCrewMemberRowActionRuntimeImpl();
