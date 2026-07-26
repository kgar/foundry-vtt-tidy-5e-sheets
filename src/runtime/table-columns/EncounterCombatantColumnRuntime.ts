import { ColumnRuntimeBase } from './ColumnRuntimeBase';

class EncounterCombatantColumnRuntimeImpl extends ColumnRuntimeBase<'encounterCombatant'> {
  domain = 'encounterCombatant' as const;
}

export const EncounterCombatantColumnRuntime = new EncounterCombatantColumnRuntimeImpl();
