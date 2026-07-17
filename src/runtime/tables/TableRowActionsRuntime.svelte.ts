import type { Item5e } from 'src/types/item.types';
import type {
  ActivityTableAction,
  Actor5e,
  ActorSheetQuadroneContext,
  ActorTableAction,
  AdvancementTableAction,
  CharacterSheetQuadroneContext,
  DocumentSheetQuadroneContext,
  EffectTableAction,
  EncounterCombatantMemberTableAction,
  ItemTableAction,
  NpcSheetQuadroneContext,
  VehicleSheetQuadroneContext,
} from 'src/types/types';
import SpellButton from 'src/components/table-quadrone/table-buttons/SpellButton.svelte';
import EquipButton from 'src/components/table-quadrone/table-buttons/EquipButton.svelte';
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
import AttuneButton from 'src/components/table-quadrone/table-buttons/AttuneButton.svelte';
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
  getInventoryRowActions(
    context: ActorSheetQuadroneContext,
    config?: RowActionConfig,
  ): ItemTableAction<any>[] {
    const canAttune = config?.canAttune ?? true;
    const canEquip = config?.canEquip ?? true;
    const hasActionsTab = config?.hasActionsTab ?? false;

    let rowActions: ItemTableAction<any>[] = $derived.by(() => {
      let result: ItemTableAction<any>[] = [];

      if (context.owner) {
        result.push({
          component: AttuneButton,
          condition: (args) =>
            canAttune && FoundryAdapter.isAttunementApplicable(args.data.item),
          props: (args) => ({
            doc: args.data.item,
            ctx: args.data.ctx,
          }),
        } satisfies ItemTableAction<typeof AttuneButton>);

        if (context.unlocked) {
          result.push({
            component: EditButton,
            props: (args) => ({ doc: args.data.item }),
          } satisfies ItemTableAction<typeof EditButton>);

          result.push({
            component: DeleteButton,
            props: (args) => ({
              doc: args.data.item,
            }),
          } satisfies ItemTableAction<typeof DeleteButton>);
        } else {
          if (canEquip ?? true) {
            result.push({
              component: EquipButton,
              props: (args) => ({ doc: args.data.item }),
              condition: (args) => 'equipped' in args.data.item.system,
            } satisfies ItemTableAction<typeof EquipButton>);
          }

          if (hasActionsTab) {
            result.push({
              component: CharacterSheetTabToggleButton,
              props: (args) => ({
                doc: args.data.item,
                ctx: args.data.ctx,
              }),
            } satisfies ItemTableAction<typeof CharacterSheetTabToggleButton>);
          }
        }
      }

      result.push({
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies ItemTableAction<typeof MenuButton>);

      return result;
    });

    return rowActions;
  }

  getCharacterFeatureRowActions(context: CharacterSheetQuadroneContext) {
    let rowActions: ItemTableAction<any>[] = $derived.by(() => {
      let result: ItemTableAction<any>[] = [];

      if (context.owner) {
        if (context.unlocked) {
          result.push({
            component: EditButton,
            props: (args) => ({ doc: args.data.item }),
          } satisfies ItemTableAction<typeof EditButton>);

          result.push({
            component: DeleteButton,
            props: (args) => ({
              doc: args.data.item,
            }),
          } satisfies ItemTableAction<typeof DeleteButton>);
        } else {
          result.push({
            component: CharacterSheetTabToggleButton,
            props: (args) => ({
              doc: args.data.item,
              ctx: args.data.ctx,
            }),
          } satisfies ItemTableAction<typeof CharacterSheetTabToggleButton>);
        }
      }

      result.push({
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies ItemTableAction<typeof MenuButton>);

      return result;
    });

    return rowActions;
  }

  getSpellRowActions(
    context: ActorSheetQuadroneContext,
    config?: RowActionConfig,
  ) {
    let rowActions: ItemTableAction<any>[] = $derived.by(() => {
      let result: ItemTableAction<any>[] = [];

      if (context.owner) {
        result.push({
          component: SpellButton,
          condition: (args) => !args.data.item.system.linkedActivity,
          props: (args) => ({ doc: args.data.item }),
        } satisfies ItemTableAction<typeof SpellButton>);

        if (context.unlocked) {
          result.push({
            component: EditButton,
            props: (args) => ({ doc: args.data.item }),
          } satisfies ItemTableAction<typeof EditButton>);

          result.push(
            {
              component: DeleteButton,
              props: (args) => ({
                doc: args.data.item,
              }),
              condition: (args) => !args.data.item.system.linkedActivity,
            } satisfies ItemTableAction<typeof DeleteButton>,
            {
              component: OpenActivityButton,
              props: (args) => ({
                doc: args.data.item,
              }),
              condition: (args) => !!args.data.item.system.linkedActivity,
            } satisfies ItemTableAction<typeof OpenActivityButton>,
          );
        } else {
          if (config?.hasActionsTab) {
            result.push({
              component: CharacterSheetTabToggleButton,
              props: (args) => ({
                doc: args.data.item,
                ctx: args.data.ctx,
              }),
            } satisfies ItemTableAction<typeof CharacterSheetTabToggleButton>);
          }
        }
      }

      result.push({
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies ItemTableAction<typeof MenuButton>);

      return result;
    });

    return rowActions;
  }

  getContainerContentsRowActions(
    context: ContainerContentsRowActionsContext,
    itemParent?: Actor5e | undefined,
  ) {
    let rowActions: ItemTableAction<any>[] = $derived.by(() => {
      let result: ItemTableAction<any>[] = [];

      if (context.unlocked) {
        result.push({
          component: EditButton,
          props: (args) => ({ doc: args.data.item }),
        } satisfies ItemTableAction<typeof EditButton>);

        result.push({
          component: DeleteButton,
          props: (args) => ({
            doc: args.data.item,
          }),
        } satisfies ItemTableAction<typeof DeleteButton>);
      } else if (context.hasActor && itemParent?.system.isCharacter) {
        result.push({
          component: CharacterSheetTabToggleButton,
          props: (args) => ({ doc: args.data.item, ctx: args.data.ctx }),
        } satisfies ItemTableAction<typeof CharacterSheetTabToggleButton>);
      }

      result.push({
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies ItemTableAction<typeof MenuButton>);

      return result;
    });

    return rowActions;
  }

  getActionsRowActions(owner: boolean, unlocked: boolean) {
    let rowActions: ItemTableAction<any>[] = $derived.by(() => {
      let result: ItemTableAction<any>[] = [];

      if (owner) {
        if (unlocked) {
          result.push({
            component: EditButton,
            props: (args) => ({ doc: args.data.item }),
          } satisfies ItemTableAction<typeof EditButton>);

          result.push({
            component: DeleteButton,
            props: (args) => ({
              doc: args.data.item,
            }),
          } satisfies ItemTableAction<typeof DeleteButton>);
        }
      }

      result.push({
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies ItemTableAction<typeof MenuButton>);

      return result;
    });

    return rowActions;
  }

  getEffectsRowActions(context: DocumentSheetQuadroneContext<any>) {
    let result: EffectTableAction<any>[] = [];

    result.push({
      component: EffectToggleButton,
      props: (args) => ({
        effect: args.data.effect,
      }),
      condition: (args) =>
        context.document.documentName === CONSTANTS.DOCUMENT_NAME_ACTOR ||
        args.data.effect.type !== CONSTANTS.EFFECT_TYPE_ENCHANTMENT,
    } satisfies EffectTableAction<typeof EffectToggleButton>);

    if (context.unlocked) {
      result.push({
        component: EditButton,
        props: (args) => ({ doc: args.data.effect }),
      } satisfies EffectTableAction<typeof EditButton>);

      result.push({
        component: DeleteButton,
        props: (args) => ({
          doc: args.data.effect,
        }),
      } satisfies EffectTableAction<typeof DeleteButton>);
    }

    result.push({
      component: MenuButton,
      props: () => ({
        targetSelector: '[data-context-menu]',
      }),
    } satisfies EffectTableAction<typeof MenuButton>);

    return result;
  }

  getActivityRowActions(unlocked: boolean) {
    let rowActions: ActivityTableAction<any>[] = $derived.by(() => {
      let result: ActivityTableAction<any>[] = [];

      if (unlocked) {
        result.push({
          component: EditButton,
          props: (args) => ({ doc: args.data.activity }),
        } satisfies ActivityTableAction<typeof EditButton>);

        result.push({
          component: DeleteButton,
          props: (args) => ({
            doc: args.data.activity,
          }),
        } satisfies ActivityTableAction<typeof DeleteButton>);
      }

      result.push({
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies ActivityTableAction<typeof MenuButton>);

      return result;
    });

    return rowActions;
  }

  getStatblockRowActions(context: NpcSheetQuadroneContext) {
    let rowActions: ItemTableAction<any>[] = $derived.by(() => {
      let result: ItemTableAction<any>[] = [];

      if (context.owner) {
        if (context.unlocked) {
          result.push({
            component: EditButton,
            props: (args) => ({ doc: args.data.item }),
          } satisfies ItemTableAction<typeof EditButton>);

          result.push({
            component: DeleteButton,
            props: (args) => ({
              doc: args.data.item,
            }),
          } satisfies ItemTableAction<typeof DeleteButton>);
        }
      }

      result.push({
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies ItemTableAction<typeof MenuButton>);

      return result;
    });

    return rowActions;
  }

  getGroupMemberRowActions(actor: Actor5e, unlocked: boolean) {
    let rowActions: ActorTableAction<any>[] = $derived.by(() => {
      let result: ActorTableAction<any>[] = [];

      if (actor.isOwner) {
        if (unlocked) {
          result.push({
            component: GenericActionButton,
            props: (args) => ({
              'data-action': 'removeMember',
              'data-uuid': args.data.actor.uuid,
              iconClasses: 'fa-solid fa-trash fa-fw',
              tooltip: FoundryAdapter.localize('DND5E.Group.Action.Remove'),
            }),
          } satisfies ActorTableAction<typeof GenericActionButton>);
        }
      }

      result.push({
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies ActorTableAction<typeof MenuButton>);

      return result;
    });

    return rowActions;
  }

  getEncounterMemberRowActions(context: ActorSheetQuadroneContext) {
    let rowActions: ActorTableAction<any>[] = $derived.by(() => {
      let result: ActorTableAction<any>[] = [];

      if (context.owner) {
        if (context.unlocked) {
          result.push({
            component: GenericActionButton,
            props: (args) => ({
              'data-action': 'removeMember',
              'data-uuid': args.data.actor.uuid,
              iconClasses: 'fa-solid fa-trash fa-fw',
              tooltip: FoundryAdapter.localize('DND5E.Group.Action.Remove'),
            }),
          } satisfies ActorTableAction<typeof GenericActionButton>);
        }
      }

      result.push({
        component: MenuButton,
        props: () => ({
          targetSelector: '[data-context-menu]',
        }),
      } satisfies ActorTableAction<typeof MenuButton>);

      return result;
    });

    return rowActions;
  }

  getDraftAnimalRowActions(context: VehicleSheetQuadroneContext) {
    let result: ActorTableAction<any>[] = [];

    if (context.owner && context.unlocked) {
      result.push({
        component: GenericActionButton,
        props: (args) => ({
          'data-action': 'removeDraftAnimal',
          'data-uuid': args.data.actor.uuid,
          iconClasses: 'fa-solid fa-trash fa-fw',
          tooltip: FoundryAdapter.localize('TIDY5E.RemoveSpecific', {
            name: FoundryAdapter.localize(
              'TIDY5E.Vehicle.Member.DraftAnimal.Label',
            ),
          }),
        }),
      } satisfies ActorTableAction<typeof GenericActionButton>);
    }

    result.push({
      component: MenuButton,
      props: () => ({
        targetSelector: '[data-context-menu]',
      }),
    } satisfies ActorTableAction<typeof MenuButton>);

    return result;
  }

  getUnassignedCrewPassengerRowActions(
    context: VehicleSheetQuadroneContext,
    area: CrewArea5e,
  ) {
    let result: ActorTableAction<any>[] = [];

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
          'data-uuid': args.data.actor.uuid,
          iconClasses: 'fa-solid fa-trash fa-fw',
          tooltip: FoundryAdapter.localize('TIDY5E.RemoveSpecific', {
            name: FoundryAdapter.localize(memberTypeKey),
          }),
        }),
      } satisfies ActorTableAction<typeof GenericActionButton>);
    }

    result.push({
      component: MenuButton,
      props: () => ({
        targetSelector: '[data-context-menu]',
      }),
    } satisfies ActorTableAction<typeof MenuButton>);

    return result;
  }

  getAssignedCrewRowActions(context: VehicleSheetQuadroneContext) {
    let result: ActorTableAction<any>[] = [];

    if (context.owner && context.unlocked) {
      result.push({
        component: GenericActionButton,
        props: (args) => ({
          callback: () => {
            return context.sheet._unassignCrew(
              args.data.actor.uuid,
              args.data.ctx.assignedTo,
            );
          },
          iconClasses: 'fa-solid fa-user-minus',
          tooltip: FoundryAdapter.localize('TIDY5E.ContextMenuActionUnassign'),
        }),
      } satisfies ActorTableAction<typeof GenericActionButton>);
    }

    result.push({
      component: MenuButton,
      props: () => ({
        targetSelector: '[data-context-menu]',
      }),
    } satisfies ActorTableAction<typeof MenuButton>);

    return result;
  }

  getEncounterCombatRowActions(context: ActorSheetQuadroneContext) {
    let rowActions: EncounterCombatantMemberTableAction<any>[] = $derived.by(
      () => {
        let result: EncounterCombatantMemberTableAction<any>[] = [];

        if (context.owner) {
          result.push({
            component: EncounterAddAsCombatPlaceholder,
            props: () => ({}),
          } satisfies EncounterCombatantMemberTableAction<
            typeof EncounterAddAsCombatPlaceholder
          >);
          result.push({
            component: EncounterCombatVisibilityToggle,
            props: (args) => ({
              rowContext: args.data,
            }),
          } satisfies EncounterCombatantMemberTableAction<
            typeof EncounterCombatVisibilityToggle
          >);
          result.push({
            component: EncounterCombatInclusionToggle,
            props: (args) => ({
              rowContext: args.data,
            }),
          } satisfies EncounterCombatantMemberTableAction<
            typeof EncounterCombatInclusionToggle
          >);
          if (context.unlocked) {
            result.push({
              component: DeleteEncounterEntityButton,
              props: (args) => ({
                rowContext: args.data,
              }),
            } satisfies EncounterCombatantMemberTableAction<
              typeof DeleteEncounterEntityButton
            >);
          }
        }

        result.push({
          component: MenuButton,
          props: () => ({
            targetSelector: '[data-context-menu]',
          }),
        } satisfies EncounterCombatantMemberTableAction<typeof MenuButton>);

        return result;
      },
    );

    return rowActions;
  }

  getItemAdvancementRowActions(unlocked: boolean, item: Item5e) {
    let result: AdvancementTableAction[] = [];

    if (unlocked) {
      result.push({
        component: EditButton,
        props: (args) => ({
          doc: item.system.advancement?.get(args.data.id),
        }),
      } satisfies AdvancementTableAction<typeof EditButton>);

      result.push({
        component: DeleteButton,
        props: (args) => ({
          doc: item.system.advancement?.get(args.data.id),
          deleteFn: () =>
            item.system.advancement
              ?.get(args.data.id)
              ?.deleteDialog({ sheet: item }),
        }),
      } satisfies AdvancementTableAction<typeof DeleteButton>);
    }

    result.push({
      component: MenuButton,
      props: () => ({
        targetSelector: '.advancement-item',
      }),
    } satisfies ItemTableAction<typeof MenuButton>);

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
