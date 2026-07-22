import type {
  ActivityRowAction,
  EffectRowAction,
  EncounterCombatantMemberRowAction,
  EncounterMemberRowAction,
  GroupMemberRowAction,
  ItemAdvancementRowAction,
  ItemRowAction,
  VehicleCrewRowAction,
  VehicleDraftAnimalRowAction,
  VehiclePassengerRowAction,
} from 'src/types/row-actions.types';
import AttuneButton from 'src/components/table-quadrone/table-buttons/AttuneButton.svelte';
import CharacterSheetTabToggleButton from 'src/components/table-quadrone/table-buttons/CharacterSheetTabToggleButton.svelte';
import DeleteButton from 'src/components/table-quadrone/table-buttons/DeleteButton.svelte';
import DeleteEncounterEntityButton from 'src/components/table-quadrone/table-buttons/DeleteEncounterEntityButton.svelte';
import EditButton from 'src/components/table-quadrone/table-buttons/EditButton.svelte';
import EffectToggleButton from 'src/components/table-quadrone/table-buttons/EffectToggleButton.svelte';
import EncounterAddAsCombatPlaceholder from 'src/components/table-quadrone/table-buttons/EncounterAddAsCombatPlaceholder.svelte';
import EncounterCombatInclusionToggle from 'src/components/table-quadrone/table-buttons/EncounterCombatInclusionToggle.svelte';
import EncounterCombatVisibilityToggle from 'src/components/table-quadrone/table-buttons/EncounterCombatVisibilityToggle.svelte';
import EquipButton from 'src/components/table-quadrone/table-buttons/EquipButton.svelte';
import GenericActionButton from 'src/components/table-quadrone/table-buttons/GenericActionButton.svelte';
import MenuButton from 'src/components/table-quadrone/table-buttons/MenuButton.svelte';
import OpenActivityButton from 'src/components/table-quadrone/table-buttons/OpenActivityButton.svelte';
import SpellButton from 'src/components/table-quadrone/table-buttons/SpellButton.svelte';
import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { TidyRowActionRegistry } from 'src/types/registry.types';

export function getRowActionsRegistry(): TidyRowActionRegistry {
  return {
    activity: {
      edit: {
        component: EditButton,
        condition: (args) => args.data.unlocked,
        props: (args) => ({ doc: args.activity }),
      } satisfies ActivityRowAction<typeof EditButton>,
      delete: {
        component: DeleteButton,
        condition: (args) => args.data.unlocked,
        props: (args) => ({
          doc: args.activity,
        }),
      } satisfies ActivityRowAction<typeof DeleteButton>,
      menu: {
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies ActivityRowAction<typeof MenuButton>,
    },
    containerContents: {
      edit: {
        component: EditButton,
        condition: (args) => args.data.unlocked,
        props: (args) => ({ doc: args.item }),
      } satisfies ItemRowAction<typeof EditButton>,
      delete: {
        component: DeleteButton,
        condition: (args) => args.data.unlocked,
        props: (args) => ({
          doc: args.item,
        }),
      } satisfies ItemRowAction<typeof DeleteButton>,
      toggleSheetTab: {
        component: CharacterSheetTabToggleButton,
        condition: (args) =>
          // TODO: remove doc type logic after partitioning
          args.sheetDocument.system.isCharacter &&
          args.data.editable &&
          !args.data.unlocked,
        props: (args) => ({
          doc: args.item,
          ctx: args.ctx,
        }),
      } satisfies ItemRowAction<typeof CharacterSheetTabToggleButton>,
      menu: {
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies ItemRowAction<typeof MenuButton>,
    },
    effect: {
      toggle: {
        component: EffectToggleButton,
        props: (args) => ({
          effect: args.effect,
        }),
        condition: (args) =>
          args.sheetDocument.documentName === CONSTANTS.DOCUMENT_NAME_ACTOR ||
          args.rowDocument.type !== CONSTANTS.EFFECT_TYPE_ENCHANTMENT,
      } satisfies EffectRowAction<typeof EffectToggleButton>,
      edit: {
        component: EditButton,
        condition: (args) => args.data.unlocked,
        props: (args) => ({ doc: args.effect }),
      } satisfies EffectRowAction<typeof EditButton>,
      delete: {
        component: DeleteButton,
        condition: (args) => args.data.unlocked,
        props: (args) => ({
          doc: args.effect,
        }),
      } satisfies EffectRowAction<typeof DeleteButton>,
      menu: {
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies EffectRowAction<typeof MenuButton>,
    },
    encounterCombatant: {
      addAsPlaceholder: {
        component: EncounterAddAsCombatPlaceholder,
        condition: (args) => args.data.editable,
        props: () => ({}),
      } satisfies EncounterCombatantMemberRowAction<
        typeof EncounterAddAsCombatPlaceholder
      >,
      toggleVisibility: {
        component: EncounterCombatVisibilityToggle,
        condition: (args) => args.data.editable,
        props: (args) => ({
          rowContext: args,
        }),
      } satisfies EncounterCombatantMemberRowAction<
        typeof EncounterCombatVisibilityToggle
      >,
      toggleInclusion: {
        component: EncounterCombatInclusionToggle,
        condition: (args) => args.data.editable,
        props: (args) => ({
          rowContext: args,
        }),
      } satisfies EncounterCombatantMemberRowAction<
        typeof EncounterCombatInclusionToggle
      >,
      delete: {
        component: DeleteEncounterEntityButton,

        condition: (args) => args.data.unlocked,
        props: (args) => ({
          rowContext: args,
        }),
      } satisfies EncounterCombatantMemberRowAction<
        typeof DeleteEncounterEntityButton
      >,
      menu: {
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies EncounterCombatantMemberRowAction<typeof MenuButton>,
    },
    encounterMember: {
      remove: {
        component: GenericActionButton,
        condition: (args) => args.data.unlocked,
        props: (args) => ({
          'data-action': 'removeMember',
          'data-uuid': args.actor.uuid,
          iconClasses: 'fa-solid fa-trash fa-fw',
          tooltip: FoundryAdapter.localize('DND5E.Group.Action.Remove'),
        }),
      } satisfies EncounterMemberRowAction<typeof GenericActionButton>,
      menu: {
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies EncounterMemberRowAction<typeof MenuButton>,
    },
    feature: {
      edit: {
        component: EditButton,
        condition: (args) => args.data.unlocked,
        props: (args) => ({ doc: args.item }),
      } satisfies ItemRowAction<typeof EditButton>,
      delete: {
        component: DeleteButton,
        condition: (args) => args.data.unlocked,
        props: (args) => ({
          doc: args.item,
        }),
      } satisfies ItemRowAction<typeof DeleteButton>,
      toggleSheetTab: {
        component: CharacterSheetTabToggleButton,
        condition: (args) =>
          // TODO: remove doc type logic after partitioning
          args.sheetDocument.system.isCharacter &&
          args.data.editable &&
          !args.data.unlocked,
        props: (args) => ({
          doc: args.item,
          ctx: args.ctx,
        }),
      } satisfies ItemRowAction<typeof CharacterSheetTabToggleButton>,
      menu: {
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies ItemRowAction<typeof MenuButton>,
    },
    groupMember: {
      remove: {
        component: GenericActionButton,
        condition: (args) => args.data.unlocked,
        props: (args) => ({
          'data-action': 'removeMember',
          'data-uuid': args.actor.uuid,
          iconClasses: 'fa-solid fa-trash fa-fw',
          tooltip: FoundryAdapter.localize('DND5E.Group.Action.Remove'),
        }),
      } satisfies GroupMemberRowAction<typeof GenericActionButton>,
      menu: {
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies GroupMemberRowAction<typeof MenuButton>,
    },
    inventory: {
      edit: {
        component: EditButton,
        condition: (args) => args.data.unlocked,
        props: (args) => ({ doc: args.item }),
      } satisfies ItemRowAction<typeof EditButton>,
      delete: {
        component: DeleteButton,
        condition: (args) => args.data.unlocked,
        props: (args) => ({
          doc: args.item,
        }),
      } satisfies ItemRowAction<typeof DeleteButton>,
      attune: {
        component: AttuneButton,
        condition: (args) =>
          args.data.editable &&
          !args.data.unlocked &&
          // TODO: remove doc type logic after partitioning
          (args.sheetDocument.system.isCharacter ||
            args.sheetDocument.system.isNPC) &&
          FoundryAdapter.isAttunementApplicable(args.rowDocument),
        props: (args) => ({
          doc: args.item,
          ctx: args.ctx,
        }),
      } satisfies ItemRowAction<typeof AttuneButton>,
      equip: {
        component: EquipButton,
        props: (args) => ({ doc: args.item }),
        condition: (args) =>
          args.data.editable &&
          !args.data.unlocked &&
          // TODO: remove doc type logic after partitioning
          (args.sheetDocument.system.isCharacter ||
            args.sheetDocument.system.isNPC) &&
          'equipped' in args.rowDocument.system,
      } satisfies ItemRowAction<typeof EquipButton>,
      toggleSheetTab: {
        component: CharacterSheetTabToggleButton,
        condition: (args) =>
          // TODO: remove doc type logic after partitioning
          args.sheetDocument.system.isCharacter &&
          args.data.editable &&
          !args.data.unlocked,
        props: (args) => ({
          doc: args.item,
          ctx: args.ctx,
        }),
      } satisfies ItemRowAction<typeof CharacterSheetTabToggleButton>,
      menu: {
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies ItemRowAction<typeof MenuButton>,
    },
    itemAdvancement: {
      edit: {
        component: EditButton,
        condition: (args) => args.data.unlocked,
        props: (args) => ({
          doc: args.item.system.advancement?.get(args.id),
        }),
      } satisfies ItemAdvancementRowAction<typeof EditButton>,
      delete: {
        component: DeleteButton,
        condition: (args) => args.data.unlocked,
        props: (args) => ({
          doc: args.item.system.advancement?.get(args.id),
          deleteFn: () =>
            args.item.system.advancement
              ?.get(args.id)
              ?.deleteDialog({ sheet: args.item }),
        }),
      } satisfies ItemAdvancementRowAction<typeof DeleteButton>,
      menu: {
        component: MenuButton,
        props: () => ({
          targetSelector: '.advancement-item',
        }),
      } satisfies ItemAdvancementRowAction<typeof MenuButton>,
    },
    vehicleAssignedCrew: {
      unassign: {
        component: GenericActionButton,
        condition: (args) => args.data.unlocked,
        props: (args) => ({
          'data-action': 'unassignCrew',
          'data-member-uuid': args.actor.uuid,
          'data-item-uuid': args.ctx?.assignedTo?.uuid,
          iconClasses: 'fa-solid fa-user-minus',
          tooltip: FoundryAdapter.localize('TIDY5E.ContextMenuActionUnassign'),
        }),
      } satisfies VehicleCrewRowAction<typeof GenericActionButton>,
      menu: {
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies VehicleCrewRowAction<typeof MenuButton>,
    },
    vehicleDraftAnimal: {
      remove: {
        component: GenericActionButton,
        condition: (args) => args.data.unlocked,
        props: (args) => ({
          'data-action': 'removeDraftAnimal',
          'data-uuid': args.actor.uuid,
          iconClasses: 'fa-solid fa-trash fa-fw',
          tooltip: FoundryAdapter.localize('TIDY5E.RemoveSpecific', {
            name: FoundryAdapter.localize(
              'TIDY5E.Vehicle.Member.DraftAnimal.Label',
            ),
          }),
        }),
      } satisfies VehicleDraftAnimalRowAction<typeof GenericActionButton>,
      menu: {
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies VehicleDraftAnimalRowAction<typeof MenuButton>,
    },
    vehiclePassenger: {
      remove: {
        component: GenericActionButton,
        condition: (args) => args.data.unlocked,
        props: (args) => ({
          'data-action': 'removePassengers',
          'data-uuid': args.actor.uuid,
          iconClasses: 'fa-solid fa-trash fa-fw',
          tooltip: FoundryAdapter.localize('TIDY5E.RemoveSpecific', {
            name: FoundryAdapter.localize('DND5E.VEHICLE.Crew.Passengers'),
          }),
        }),
      } satisfies VehiclePassengerRowAction<typeof GenericActionButton>,
      menu: {
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies VehiclePassengerRowAction<typeof MenuButton>,
    },
    spell: {
      spell: {
        component: SpellButton,
        condition: (args) =>
          args.data.editable &&
          !args.rowDocument.system.linkedActivity &&
          // TODO: remove doc type logic after partitioning
          (args.sheetDocument.system.isCharacter ||
            args.sheetDocument.system.isNPC),
        props: (args) => ({ doc: args.item }),
      } satisfies ItemRowAction<typeof SpellButton>,
      edit: {
        component: EditButton,
        condition: (args) => args.data.unlocked,
        props: (args) => ({ doc: args.item }),
      } satisfies ItemRowAction<typeof EditButton>,
      delete: {
        component: DeleteButton,
        props: (args) => ({
          doc: args.item,
        }),
        condition: (args) =>
          args.data.unlocked && !args.rowDocument.system.linkedActivity,
      } satisfies ItemRowAction<typeof DeleteButton>,
      openActivity: {
        component: OpenActivityButton,
        props: (args) => ({
          doc: args.item,
        }),
        condition: (args) =>
          args.data.unlocked && !!args.rowDocument.system.linkedActivity,
      } satisfies ItemRowAction<typeof OpenActivityButton>,
      toggleSheetTab: {
        component: CharacterSheetTabToggleButton,
        condition: (args) =>
          // TODO: remove doc type logic after partitioning
          args.sheetDocument.system.isCharacter &&
          args.data.editable &&
          !args.data.unlocked,
        props: (args) => ({
          doc: args.item,
          ctx: args.ctx,
        }),
      } satisfies ItemRowAction<typeof CharacterSheetTabToggleButton>,
      menu: {
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies ItemRowAction<typeof MenuButton>,
    },
    vehicleUnassignedCrew: {
      remove: {
        component: GenericActionButton,
        condition: (args) => args.data.unlocked,
        props: (args) => ({
          'data-action': 'removeUnassignedCrew',
          'data-uuid': args.actor.uuid,
          iconClasses: 'fa-solid fa-trash fa-fw',
          tooltip: FoundryAdapter.localize('TIDY5E.RemoveSpecific', {
            name: FoundryAdapter.localize(
              'TIDY5E.Vehicle.Section.Crew.Unassigned.Label',
            ),
          }),
        }),
      } satisfies VehicleCrewRowAction<typeof GenericActionButton>,
      menu: {
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies VehicleCrewRowAction<typeof MenuButton>,
    },
  };
}
