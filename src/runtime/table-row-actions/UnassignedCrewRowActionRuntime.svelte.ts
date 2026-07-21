import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class UnassignedCrewMemberRowActionRuntimeImpl extends RowActionRuntimeBase<'unassignedCrew'> {
  domain = 'unassignedCrew' as const;
}

export const UnassignedCrewMemberRowActionRuntime =
  new UnassignedCrewMemberRowActionRuntimeImpl();
