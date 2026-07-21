import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class UnassignedCrewMemberRowActionRuntimeImpl extends RowActionRuntimeBase<'vehicleUnassignedCrew'> {
  domain = 'vehicleUnassignedCrew' as const;
}

export const UnassignedCrewMemberRowActionRuntime =
  new UnassignedCrewMemberRowActionRuntimeImpl();
