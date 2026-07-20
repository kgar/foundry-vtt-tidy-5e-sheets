import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class UnassignedCrewMemberRowActionRuntimeImpl extends RowActionRuntimeBase<'unassignedCrew'> {
  domain = 'unassignedCrew' as const;

  override _getDefaultRowActionKeys() {
    return ['remove', 'menu'];
  }
}

export const UnassignedCrewMemberRowActionRuntime =
  new UnassignedCrewMemberRowActionRuntimeImpl();
