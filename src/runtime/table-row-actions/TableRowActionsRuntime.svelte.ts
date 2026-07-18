import type { Item5e } from 'src/types/item.types';
import type {
  ActivityRowAction,
  Actor5e,
  ActorSheetQuadroneContext,
  ActorRowAction,
  AdvancementRowAction,
  CharacterSheetQuadroneContext,
  DocumentSheetQuadroneContext,
  EffectRowAction,
  EncounterCombatantMemberRowAction,
  ItemRowAction,
  NpcSheetQuadroneContext,
  VehicleSheetQuadroneContext,
} from 'src/types/types';
import SpellButton from 'src/components/table-quadrone/table-buttons/SpellButton.svelte';
import CharacterSheetTabToggleButton from 'src/components/table-quadrone/table-buttons/CharacterSheetTabToggleButton.svelte';
import EditButton from 'src/components/table-quadrone/table-buttons/EditButton.svelte';
import MenuButton from 'src/components/table-quadrone/table-buttons/MenuButton.svelte';
import type { ContainerContentsRowActionsContext } from '../types';
import OpenActivityButton from 'src/components/table-quadrone/table-buttons/OpenActivityButton.svelte';
import EffectToggleButton from 'src/components/table-quadrone/table-buttons/EffectToggleButton.svelte';
import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import EncounterCombatInclusionToggle from 'src/components/table-quadrone/table-buttons/EncounterCombatInclusionToggle.svelte';
import EncounterAddAsCombatPlaceholder from 'src/components/table-quadrone/table-buttons/EncounterAddAsCombatPlaceholder.svelte';
import EncounterCombatVisibilityToggle from 'src/components/table-quadrone/table-buttons/EncounterCombatVisibilityToggle.svelte';
import DeleteEncounterEntityButton from 'src/components/table-quadrone/table-buttons/DeleteEncounterEntityButton.svelte';
import DeleteButton from 'src/components/table-quadrone/table-buttons/DeleteButton.svelte';
import type { CrewArea5e } from 'src/foundry/foundry.types';
import GenericActionButton from 'src/components/table-quadrone/table-buttons/GenericActionButton.svelte';
import { foundryCoreSettings } from 'src/settings/settings.svelte';

// TODO: Set up a proper runtime where table actions can be fed to specific tab types.

type RowActionConfig = {
  /** The caller is configured to include the Actions tab. Default: false */
  hasActionsTab?: boolean;
  /** The caller is capable of equipping items. Default: true */
  canEquip?: boolean;
  /** The caller is capable of attuning to items. Default: true */
  canAttune?: boolean;
};

class TableRowActionsRuntime {
  getEffectsRowActions(context: DocumentSheetQuadroneContext<any>) {
    let result: EffectRowAction<any>[] = [];

    result.push({
      component: EffectToggleButton,
      props: (args) => ({
        effect: args.effect,
      }),
      condition: (args) =>
        context.document.documentName === CONSTANTS.DOCUMENT_NAME_ACTOR ||
        args.effect.type !== CONSTANTS.EFFECT_TYPE_ENCHANTMENT,
    } satisfies EffectRowAction<typeof EffectToggleButton>);

    if (context.unlocked) {
      result.push({
        component: EditButton,
        props: (args) => ({ doc: args.effect }),
      } satisfies EffectRowAction<typeof EditButton>);

      result.push({
        component: DeleteButton,
        props: (args) => ({
          doc: args.effect,
        }),
      } satisfies EffectRowAction<typeof DeleteButton>);
    }

    result.push({
      component: MenuButton,
      props: () => ({
        targetSelector: '[data-context-menu]',
      }),
    } satisfies EffectRowAction<typeof MenuButton>);

    return result;
  }

  getActivityRowActions(unlocked: boolean) {
    let rowActions: ActivityRowAction<any>[] = $derived.by(() => {
      let result: ActivityRowAction<any>[] = [];

      if (unlocked) {
        result.push({
          component: EditButton,
          props: (args) => ({ doc: args.activity }),
        } satisfies ActivityRowAction<typeof EditButton>);

        result.push({
          component: DeleteButton,
          props: (args) => ({
            doc: args.activity,
          }),
        } satisfies ActivityRowAction<typeof DeleteButton>);
      }

      result.push({
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies ActivityRowAction<typeof MenuButton>);

      return result;
    });

    return rowActions;
  }

  getGroupMemberRowActions(actor: Actor5e, unlocked: boolean) {
    let rowActions: ActorRowAction<any>[] = $derived.by(() => {
      let result: ActorRowAction<any>[] = [];

      if (actor.isOwner) {
        if (unlocked) {
          result.push({
            component: GenericActionButton,
            props: (args) => ({
              'data-action': 'removeMember',
              'data-uuid': args.actor.uuid,
              iconClasses: 'fa-solid fa-trash fa-fw',
              tooltip: FoundryAdapter.localize('DND5E.Group.Action.Remove'),
            }),
          } satisfies ActorRowAction<typeof GenericActionButton>);
        }
      }

      result.push({
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies ActorRowAction<typeof MenuButton>);

      return result;
    });

    return rowActions;
  }

  getEncounterMemberRowActions(context: ActorSheetQuadroneContext) {
    let rowActions: ActorRowAction<any>[] = $derived.by(() => {
      let result: ActorRowAction<any>[] = [];

      if (context.owner) {
        if (context.unlocked) {
          result.push({
            component: GenericActionButton,
            props: (args) => ({
              'data-action': 'removeMember',
              'data-uuid': args.actor.uuid,
              iconClasses: 'fa-solid fa-trash fa-fw',
              tooltip: FoundryAdapter.localize('DND5E.Group.Action.Remove'),
            }),
          } satisfies ActorRowAction<typeof GenericActionButton>);
        }
      }

      result.push({
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies ActorRowAction<typeof MenuButton>);

      return result;
    });

    return rowActions;
  }

  getDraftAnimalRowActions(context: VehicleSheetQuadroneContext) {
    let result: ActorRowAction<any>[] = [];

    if (context.owner && context.unlocked) {
      result.push({
        component: GenericActionButton,
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
      } satisfies ActorRowAction<typeof GenericActionButton>);
    }

    result.push({
      component: MenuButton,
      props: () => ({
        targetSelector: '[data-context-menu]',
      }),
    } satisfies ActorRowAction<typeof MenuButton>);

    return result;
  }

  getUnassignedCrewPassengerRowActions(
    context: VehicleSheetQuadroneContext,
    area: CrewArea5e,
  ) {
    let result: ActorRowAction<any>[] = [];

    if (context.owner && context.unlocked) {
      const memberTypeKey =
        area === 'crew'
          ? 'TIDY5E.Vehicle.Section.Crew.Unassigned.Label'
          : area === 'passengers'
            ? 'DND5E.VEHICLE.Crew.Passengers'
            : '';

      result.push({
        component: GenericActionButton,
        props: (args) => ({
          'data-action':
            area === 'crew'
              ? 'removeUnassignedCrew'
              : area === 'passengers'
                ? 'removePassengers'
                : '',
          'data-uuid': args.actor.uuid,
          iconClasses: 'fa-solid fa-trash fa-fw',
          tooltip: FoundryAdapter.localize('TIDY5E.RemoveSpecific', {
            name: FoundryAdapter.localize(memberTypeKey),
          }),
        }),
      } satisfies ActorRowAction<typeof GenericActionButton>);
    }

    result.push({
      component: MenuButton,
      props: () => ({
        targetSelector: '[data-context-menu]',
      }),
    } satisfies ActorRowAction<typeof MenuButton>);

    return result;
  }

  getAssignedCrewRowActions(context: VehicleSheetQuadroneContext) {
    let result: ActorRowAction<any>[] = [];

    if (context.owner && context.unlocked) {
      result.push({
        component: GenericActionButton,
        props: (args) => ({
          callback: () => {
            return context.sheet._unassignCrew(
              args.actor.uuid,
              args.ctx.assignedTo,
            );
          },
          iconClasses: 'fa-solid fa-user-minus',
          tooltip: FoundryAdapter.localize('TIDY5E.ContextMenuActionUnassign'),
        }),
      } satisfies ActorRowAction<typeof GenericActionButton>);
    }

    result.push({
      component: MenuButton,
      props: () => ({
        targetSelector: '[data-context-menu]',
      }),
    } satisfies ActorRowAction<typeof MenuButton>);

    return result;
  }

  getEncounterCombatRowActions(context: ActorSheetQuadroneContext) {
    let rowActions: EncounterCombatantMemberRowAction<any>[] = $derived.by(
      () => {
        let result: EncounterCombatantMemberRowAction<any>[] = [];

        if (context.owner) {
          result.push({
            component: EncounterAddAsCombatPlaceholder,
            props: () => ({}),
          } satisfies EncounterCombatantMemberRowAction<
            typeof EncounterAddAsCombatPlaceholder
          >);
          result.push({
            component: EncounterCombatVisibilityToggle,
            props: (args) => ({
              rowContext: args,
            }),
          } satisfies EncounterCombatantMemberRowAction<
            typeof EncounterCombatVisibilityToggle
          >);
          result.push({
            component: EncounterCombatInclusionToggle,
            props: (args) => ({
              rowContext: args,
            }),
          } satisfies EncounterCombatantMemberRowAction<
            typeof EncounterCombatInclusionToggle
          >);
          if (context.unlocked) {
            result.push({
              component: DeleteEncounterEntityButton,
              props: (args) => ({
                rowContext: args,
              }),
            } satisfies EncounterCombatantMemberRowAction<
              typeof DeleteEncounterEntityButton
            >);
          }
        }

        result.push({
          component: MenuButton,
          props: () => ({
            targetSelector: '[data-context-menu]',
          }),
        } satisfies EncounterCombatantMemberRowAction<typeof MenuButton>);

        return result;
      },
    );

    return rowActions;
  }

  getItemAdvancementRowActions(unlocked: boolean, item: Item5e) {
    let result: AdvancementRowAction[] = [];

    if (unlocked) {
      result.push({
        component: EditButton,
        props: (args) => ({
          doc: item.system.advancement?.get(args.id),
        }),
      } satisfies AdvancementRowAction<typeof EditButton>);

      result.push({
        component: DeleteButton,
        props: (args) => ({
          doc: item.system.advancement?.get(args.id),
          deleteFn: () =>
            item.system.advancement
              ?.get(args.id)
              ?.deleteDialog({ sheet: item }),
        }),
      } satisfies AdvancementRowAction<typeof DeleteButton>);
    }

    result.push({
      component: MenuButton,
      props: () => ({
        targetSelector: '.advancement-item',
      }),
    } satisfies ItemRowAction<typeof MenuButton>);

    return result;
  }

  // TODO: Determine how to make managing row action styles less hardcoded and more configured.
  calculateRowActionWidthRems(rowActionCount: number) {
    let paddingX = 0.1875;
    let buttonWidth = 1.5;
    return buttonWidth * rowActionCount + paddingX;
  }

  getRowActionWidthInfo<TEntry>(
    entries: TEntry[],
    rowActionFn: (entry: TEntry) => any[] | undefined,
  ) {
    let maxRowActionsCount = 1;

    for (const entry of entries) {
      maxRowActionsCount = Math.max(
        maxRowActionsCount,
        (rowActionFn(entry) ?? []).length,
      );
    }

    const widthRems = this.calculateRowActionWidthRems(maxRowActionsCount);
    const widthPx = widthRems * foundryCoreSettings.value.fontSizePx;

    return {
      maxRowActionsCount,
      widthRems,
      widthPx,
    };
  }
}

const singleton = new TableRowActionsRuntime();

export default singleton;
