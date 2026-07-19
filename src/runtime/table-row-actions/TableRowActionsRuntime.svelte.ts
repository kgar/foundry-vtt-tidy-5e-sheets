import type { Item5e } from 'src/types/item.types';
import type {
  ActorSheetQuadroneContext,
  ActorRowAction,
  AdvancementRowAction,
  EncounterCombatantMemberRowAction,
  ItemRowAction,
  VehicleSheetQuadroneContext,
} from 'src/types/types';
import EditButton from 'src/components/table-quadrone/table-buttons/EditButton.svelte';
import MenuButton from 'src/components/table-quadrone/table-buttons/MenuButton.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import EncounterCombatInclusionToggle from 'src/components/table-quadrone/table-buttons/EncounterCombatInclusionToggle.svelte';
import EncounterAddAsCombatPlaceholder from 'src/components/table-quadrone/table-buttons/EncounterAddAsCombatPlaceholder.svelte';
import EncounterCombatVisibilityToggle from 'src/components/table-quadrone/table-buttons/EncounterCombatVisibilityToggle.svelte';
import DeleteEncounterEntityButton from 'src/components/table-quadrone/table-buttons/DeleteEncounterEntityButton.svelte';
import DeleteButton from 'src/components/table-quadrone/table-buttons/DeleteButton.svelte';
import type { CrewArea5e } from 'src/foundry/foundry.types';
import GenericActionButton from 'src/components/table-quadrone/table-buttons/GenericActionButton.svelte';
import { foundryCoreSettings } from 'src/settings/settings.svelte';

class TableRowActionsRuntime {
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
