import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class AssignedCrewMemberRowActionRuntimeImpl extends RowActionRuntimeBase<'assignedCrew'> {
  domain = 'assignedCrew' as const;

  override _getDefaultRowActionKeys() {
    return ['unassign', 'menu'];
  }
}

export const AssignedCrewMemberRowActionRuntime =
  new AssignedCrewMemberRowActionRuntimeImpl();
