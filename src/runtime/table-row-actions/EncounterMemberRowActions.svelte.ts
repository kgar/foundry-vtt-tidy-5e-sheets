import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class EncounterMemberRowActionRuntimeImpl extends RowActionRuntimeBase<'encounterMember'> {
  domain = 'encounterMember' as const;
}

export const EncounterMemberRowActionRuntime =
  new EncounterMemberRowActionRuntimeImpl();
