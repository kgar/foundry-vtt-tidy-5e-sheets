import type { TidyPartitionRegistry } from 'src/types/registry.types';

export function getRowActionPartitions(): TidyPartitionRegistry['rowActions'] {
  return {
    activity: ['edit', 'delete', 'menu'],
    containerContents: ['edit', 'delete', 'toggleSheetTab', 'menu'],
    effect: ['toggle', 'edit', 'delete', 'menu'],
    encounterCombatant: [
      'addAsPlaceholder',
      'toggleVisibility',
      'toggleInclusion',
      'delete',
      'menu',
    ],
    encounterMember: ['remove', 'menu'],
    feature: ['edit', 'delete', 'toggleSheetTab', 'menu'],
    groupMember: ['remove', 'menu'],
    inventory: ['edit', 'delete', 'attune', 'equip', 'toggleSheetTab', 'menu'],
    itemAdvancement: ['edit', 'delete', 'menu'],
    spell: [
      'spell',
      'edit',
      'delete',
      'openActivity',
      'toggleSheetTab',
      'menu',
    ],
    vehicleAssignedCrew: ['unassign', 'menu'],
    vehicleDraftAnimal: ['remove', 'menu'],
    vehiclePassenger: ['remove', 'menu'],
    vehicleUnassignedCrew: ['remove', 'menu'],
  };
}
