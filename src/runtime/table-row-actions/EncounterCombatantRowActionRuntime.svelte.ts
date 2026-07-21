import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class EncounterCombatantMemberRowActionRuntimeImpl extends RowActionRuntimeBase<'encounterCombatant'> {
  domain = 'encounterCombatant' as const;
}

export const EncounterCombatantMemberRowActionRuntime =
  new EncounterCombatantMemberRowActionRuntimeImpl();
