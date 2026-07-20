import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class EncounterMemberRowActionRuntimeImpl extends RowActionRuntimeBase<'encounterMember'> {
  domain = 'encounterMember' as const;

  override _getDefaultRowActionKeys() {
    return ['remove', 'menu'];
  }
}

export const EncounterMemberRowActionRuntime =
  new EncounterMemberRowActionRuntimeImpl();
