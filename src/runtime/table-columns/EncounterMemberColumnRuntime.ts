import { ColumnRuntimeBase } from './ColumnRuntimeBase';

class EncounterMemberColumnRuntimeImpl extends ColumnRuntimeBase<'encounterMember'> {
  domain = 'encounterMember' as const;
}

export const EncounterMemberColumnRuntime = new EncounterMemberColumnRuntimeImpl();
