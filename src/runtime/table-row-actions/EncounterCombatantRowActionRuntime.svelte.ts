import { RowActionRuntimeBase } from './RowActionRuntimeBase';

class EncounterCombatantMemberRowActionRuntimeImpl extends RowActionRuntimeBase<'encounterCombatant'> {
  domain = 'encounterCombatant' as const;

  override _getDefaultRowActionKeys() {
    return [
      'addAsPlaceholder',
      'toggleVisibility',
      'toggleInclusion',
      'delete',
      'menu',
    ];
  }
}

export const EncounterCombatantMemberRowActionRuntime =
  new EncounterCombatantMemberRowActionRuntimeImpl();
