import { CONSTANTS } from 'src/constants';
import type {
  ApplicationConfiguration,
  ApplicationRenderOptions,
} from 'src/types/application.types';
import type {
  Actor5e,
  ActorInventoryTypes,
  ActorSheetQuadroneContext,
  DraftAnimalSection,
  InventorySection,
  PassengerMemberContext,
  TravelPaceConfigEntry,
  TravelSpeedConfigEntry,
  VehicleItemContext,
  VehicleSheetQuadroneContext,
} from 'src/types/types';
import VehicleSheet from './actor/VehicleSheet.svelte';
import { mount } from 'svelte';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import { Tidy5eActorSheetQuadroneBase } from './Tidy5eActorSheetQuadroneBase.svelte';
import { VehicleSheetQuadroneRuntime } from 'src/runtime/actor/VehicleSheetQuadroneRuntime.svelte';
import { ItemContext } from 'src/features/item/ItemContext';
import { ConditionsAndEffects } from 'src/features/conditions-and-effects/ConditionsAndEffects';
import { Activities } from 'src/features/activities/activities';
import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import UserPreferencesService from 'src/features/user-preferences/UserPreferencesService';
import { Inventory } from 'src/features/sections/Inventory';
import type { CurrencyContext, Item5e } from 'src/types/item.types';
import { actorUsesActionFeature } from 'src/features/actions/actions.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import TableRowActionsRuntime from 'src/runtime/tables/TableRowActionsRuntime.svelte';
import { SheetSections } from 'src/features/sections/SheetSections';
import SectionActions from 'src/features/sections/SectionActions';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type { CrewArea5e } from 'src/foundry/foundry.types';

const localize = FoundryAdapter.localize;

export class Tidy5eVehicleSheetQuadrone extends Tidy5eActorSheetQuadroneBase<VehicleSheetQuadroneContext>(
  CONSTANTS.SHEET_TYPE_VEHICLE
) {
  currentTabId: string;

  constructor(options?: Partial<ApplicationConfiguration> | undefined) {
    super(options);
    this.currentTabId = CONSTANTS.TAB_VEHICLE_ATTRIBUTES;
  }

  static DEFAULT_OPTIONS: Partial<
    ApplicationConfiguration & { dragDrop: Partial<DragDropConfiguration>[] }
  > = {
    // classes: [
    //   CONSTANTS.MODULE_ID,
    //   'sheet',
    //   'actor',
    //   CONSTANTS.SHEET_TYPE_VEHICLE,
    //   CONSTANTS.SHEET_TYPE_NPC,
    //   CONSTANTS.SHEET_LAYOUT_QUADRONE,
    // ],
    position: {
      width: 740,
      height: 810,
    },
    actions: {
      browseActors: async function (
        this: Tidy5eVehicleSheetQuadrone,
        _event: MouseEvent,
        target: HTMLElement
      ) {
        const area =
          target.closest('[data-area]')?.getAttribute('data-area') ?? 'crew';

        const result = await dnd5e.applications.CompendiumBrowser.selectOne({
          filters: {
            locked: {
              documentClass: 'Actor',
              types: new Set(['npc']),
            },
          },
        });

        if (!result) {
          return;
        }

        const actor = await fromUuid(result);

        if (!actor) {
          return;
        }

        this._onAdjustCrew(actor, area);
      },
    },
  };

  _createComponent(node: HTMLElement): Record<string, any> {
    if (this.actor.limited) {
      return this._createLimitedViewComponent(node);
    }

    const component = mount(VehicleSheet, {
      target: node,
      context: new Map<any, any>(this._getActorSvelteContext()),
    });

    initTidy5eContextMenu(this, this.element, CONSTANTS.SHEET_LAYOUT_QUADRONE);

    return component;
  }

  async _prepareContext(
    options: ApplicationRenderOptions
  ): Promise<VehicleSheetQuadroneContext> {
    if (options?.soft && this._context?.data) {
      return this._context.data;
    }

    const actorContext = (await super._prepareContext(
      options
    )) as ActorSheetQuadroneContext;

    // Effects & Conditions
    let baseEffects =
      dnd5e.applications.components.EffectsElement.prepareCategories(
        this.actor.allApplicableEffects()
      );
    let { conditions, effects: enhancedEffectSections } =
      await ConditionsAndEffects.getConditionsAndEffectsForActorQuadrone(
        actorContext,
        this.object,
        baseEffects
      );

    const preferences = UserSheetPreferencesService.getByType(this.actor.type);

    const userPreferences = UserPreferencesService.get();

    const currencies: CurrencyContext[] = [];
    Object.keys(CONFIG.DND5E.currencies).forEach((key) =>
      currencies.push({
        key: key,
        value: this.actor.system.currency[key] as number,
        abbr:
          CONFIG.DND5E.currencies[key as keyof typeof CONFIG.DND5E.currencies]
            ?.abbreviation ?? key,
      })
    );

    const paces: TravelPaceConfigEntry[] = Object.entries(
      CONFIG.DND5E.travelPace
    )
      .toSorted((a, b) => a[1].multiplier - b[1].multiplier)
      .map(([key, config], index) => ({ key, config, index }));

    const currentPace =
      paces.find(
        (pace) => pace.key === this.actor.system.attributes.travel.pace
      ) ?? paces[0];

    const enrichmentArgs = {
      secrets: this.actor.isOwner,
      rollData: actorContext.rollData,
      relativeTo: this.actor,
    };

    const context: VehicleSheetQuadroneContext = {
      abilities: this._prepareAbilities(actorContext),
      inventory: [],
      conditions: conditions,
      cost: {
        value: this.actor.system.attributes.price?.value ?? 0,
        denomination:
          CONFIG.DND5E.currencies[
            this.actor.system.attributes.price?.denomination
          ]?.abbreviation ??
          this.actor.system.attributes.price?.denomination ??
          'gp',
      },
      crew: {
        assigned: {
          ...SheetSections.EMPTY,
          type: 'crew',
          label: 'TIDY5E.Vehicle.Section.Crew.Assigned.Label',
          members: [],
          key: CONSTANTS.SECTION_KEY_ASSIGNED,
        },
        unassigned: {
          ...SheetSections.EMPTY,
          type: 'crew',
          label: 'TIDY5E.Vehicle.Section.Crew.Unassigned.Label',
          members: [],
          key: 'unassigned',
        },
      },
      containerPanelItems: await Inventory.getContainerPanelItems(
        actorContext.items
      ),
      currencies,
      effects: enhancedEffectSections,
      encumbrance: await this.actor.system.getEncumbrance(),
      enriched: {
        biography: await foundry.applications.ux.TextEditor.enrichHTML(
          this.actor.system.details.biography.value,
          enrichmentArgs
        ),
      },
      features: [],
      mountableItems: {},
      passengers: {
        ...SheetSections.EMPTY,
        type: 'passengers',
        label: 'DND5E.VEHICLE.Crew.Passengers',
        members: [],
        key: 'passengers',
      },
      quality: this.actor.system.attributes.quality?.value ?? 0,
      scale: this.actor.system.attributes.scale,
      showContainerPanel: TidyFlags.showContainerPanel.get(this.actor) == true,
      size: {
        key: this.actor.system.traits.size,
        label:
          CONFIG.DND5E.actorSizes[this.actor.system.traits.size]?.label ??
          this.actor.system.traits.size,
        abbr:
          CONFIG.DND5E.actorSizes[this.actor.system.traits.size]
            ?.abbreviation ?? '—',
        mod: this.actor.system.attributes.encumbrance.mod,
      },
      speeds: super._getMovementSpeeds(),
      statblock: [],
      traits: this._prepareTraits(),
      travelSpeeds: this._prepareTravelSpeeds(),
      type: CONSTANTS.SHEET_TYPE_VEHICLE,
      utilities: {},
      ...actorContext,
    };

    context.useActionsFeature = actorUsesActionFeature(this.actor);

    await this._prepareItems(context);

    await this._prepareDraftAnimals(context);

    await this._prepareCrew(context);

    await this._preparePassengers(context);

    // Section Actions

    context.statblock.forEach((section) => {
      if (section.type === CONSTANTS.SECTION_TYPE_INVENTORY) {
        section.sectionActions = SectionActions.getStandardItemHeaderActions(
          this.actor,
          this.actor.isOwner,
          context.unlocked,
          section
        );
      } else {
        // TODO: Draft Animal item header actions?
      }
    });

    context.inventory.forEach((section) => {
      section.sectionActions = SectionActions.getStandardItemHeaderActions(
        this.actor,
        this.actor.isOwner,
        context.unlocked,
        section
      );
    });

    // Custom content
    context.customContent = await VehicleSheetQuadroneRuntime.getContent(
      context
    );

    // Runtime Tabs
    context.tabs = await VehicleSheetQuadroneRuntime.getTabs(context);

    return context;
  }

  private async _prepareDraftAnimals(context: VehicleSheetQuadroneContext) {
    const drafted: DraftAnimalSection = {
      ...SheetSections.EMPTY,
      type: 'draft',
      key: 'draft',
      label: 'TIDY5E.Vehicle.Member.DraftAnimal.LabelPl',
      members: await Promise.all(
        this.actor.system.draft.value.map(async (uuid: string) => {
          const actor = await fromUuid(uuid);
          return { actor, quantity: 1 };
        })
      ),
      rowActions: TableRowActionsRuntime.getDraftAnimalRowActions(context),
    };

    context.statblock.push(drafted);
  }

  private async _prepareCrew(context: VehicleSheetQuadroneContext) {
    if (!context.system.crew.value.length) {
      return;
    }
    const crew = this.groupCrew(context.system.crew.value);
    const unassigned = { ...crew };
    const vehicleItems = context.items.filter((i) => i.system.isMountable);

    const assignments: Record<string, Item5e[]> = {};
    const assigned: Record<string, number> = {};

    for (const item of vehicleItems) {
      for (const uuid of item.system.crew.value) {
        const max = crew[uuid];
        if (!max) {
          continue;
        }
        assigned[uuid] ??= 0;
        assigned[uuid]++;
        unassigned[uuid]--;

        assignments[uuid] ??= [];
        assignments[uuid].push(item);
      }
    }

    context.crew.assigned.members = (
      await this.resolveCrewMemberContext(assigned, assignments)
    ).value;
    context.crew.unassigned.members = (
      await this.resolveCrewMemberContext(unassigned)
    ).value;
  }

  private async _preparePassengers(context: VehicleSheetQuadroneContext) {
    const uuids: string[] = context.system.passengers.value;
    const groups = this.groupCrew(uuids);
    context.passengers.members = (
      await Promise.all(
        Object.keys(groups).map(async (uuid) => {
          const actor = await fromUuid(uuid);
          return {
            actor,
            subtitle: this._getSubtitle(actor),
            quantity: groups[uuid],
          } satisfies PassengerMemberContext;
        })
      )
    ).filter((ctx) => !!ctx.actor);
  }

  async _prepareItems(context: VehicleSheetQuadroneContext): Promise<void> {
    const statblockRowActions = TableRowActionsRuntime.getInventoryRowActions(
      context,
      { canEquip: false, hasActionsTab: false }
    );

    const statblock: Record<string, InventorySection> = {
      [CONSTANTS.ITEM_TYPE_FEAT]: {
        type: CONSTANTS.SECTION_TYPE_INVENTORY,
        items: [],
        canCreate: true,
        label: 'DND5E.Features',
        dataset: {
          ['type']: CONSTANTS.ITEM_TYPE_FEAT,
        },
        key: CONSTANTS.ITEM_TYPE_FEAT,
        rowActions: statblockRowActions,
        sectionActions: [],
        show: true,
      },
      [CONSTANTS.ITEM_TYPE_WEAPON]: {
        type: CONSTANTS.SECTION_TYPE_INVENTORY,
        items: [],
        canCreate: true,
        label: 'TYPES.Item.weaponPl',
        dataset: {
          ['type']: CONSTANTS.ITEM_TYPE_WEAPON,
          ['system.type.value']: CONSTANTS.ITEM_SUBTYPE_SIEGE_WEAPON,
        },
        key: CONSTANTS.ITEM_TYPE_WEAPON,
        rowActions: statblockRowActions,
        sectionActions: [],
        show: true,
      },
      [CONSTANTS.ITEM_TYPE_EQUIPMENT]: {
        type: CONSTANTS.SECTION_TYPE_INVENTORY,
        items: [],
        canCreate: true,
        label: 'TYPES.Item.equipmentPl',
        dataset: {
          ['type']: CONSTANTS.ITEM_TYPE_EQUIPMENT,
          ['system.type.value']: CONSTANTS.ITEM_SUBTYPE_VEHICLE_EQUIPMENT,
        },
        key: CONSTANTS.ITEM_TYPE_EQUIPMENT,
        rowActions: statblockRowActions,
        sectionActions: [],
        show: true,
      },
    };

    const inventoryRowActions = TableRowActionsRuntime.getInventoryRowActions(
      context,
      { hasActionsTab: true }
    );

    const inventory: ActorInventoryTypes =
      Inventory.getDefaultInventorySections({
        rowActions: inventoryRowActions,
      });

    const inventoryTypes = Inventory.getInventoryTypes();

    const statblockTypes = [
      CONSTANTS.ITEM_TYPE_FEAT,
      CONSTANTS.ITEM_TYPE_WEAPON,
      CONSTANTS.ITEM_TYPE_EQUIPMENT,
    ];

    for (const item of context.items) {
      const ctx = (context.itemContext[item.id] ??= {});
      await this._prepareItem(item, ctx, context);

      // partition to section
      if (Inventory.isItemInventoryType(item) && !item.system.isMountable) {
        // Cargo
        Inventory.applyInventoryItemToSection(inventory, item, inventoryTypes, {
          canCreate: true,
          rowActions: inventoryRowActions,
        });
      } else {
        Inventory.applyInventoryItemToSection(
          statblock,
          item,
          statblockTypes,
          {
            canCreate: false,
            rowActions: statblockRowActions,
          },
          CONSTANTS.ITEM_TYPE_FEAT
        );
      }
    }

    context.statblock.push(...Object.values(statblock));

    SheetSections.getFilteredGlobalSectionsToShowWhenEmpty(
      context.actor,
      CONSTANTS.TAB_ACTOR_INVENTORY
    ).forEach((s) => {
      inventory[s] ??= Inventory.createInventorySection(s, inventoryTypes, {
        canCreate: true,
        rowActions: inventoryRowActions,
      });
    });

    context.inventory = Object.values(inventory);
  }

  protected async _prepareItem(
    item: any,
    ctx: VehicleItemContext,
    context: VehicleSheetQuadroneContext
  ): Promise<void> {
    const { uses } = item.system;
    ctx.hasUses = uses && uses.max > 0;

    // Save
    ctx.save = ItemContext.getItemSaveContext(item);

    // To Hit
    ctx.toHit = ItemContext.getToHit(item);

    // Activities
    ctx.activities = Activities.getVisibleActivities(
      item,
      item.system.activities
    )?.map(Activities.getActivityItemContext);

    // Crew Assignment
    const crew = item.system.crew;

    if (item.system.isMountable) {
      ctx.crew = await Promise.all(
        Array.fromRange(Math.max(crew.max ?? 0, crew.value.length)).map(
          async (index) => {
            const uuid = crew.value[index];
            return { actor: uuid ? await fromUuid(uuid) : undefined };
          }
        )
      );

      if (item.system.crew.max) {
        context.mountableItems[item.uuid] = {
          uuid: item.uuid,
          img: item.img,
          name: item.name,
          crew: {
            value: ctx.crew.filter((c) => !!c.actor).length,
            max: item.system.crew.max,
          },
        };
      }
    }
  }

  /**
   * Prepare items that are mounted to a vehicle and require one or more crew to operate.
   * @param item     Copy of the item data being prepared for display.
   * @param ctx  Display context for the item.
   * @protected
   */
  protected _prepareCrewedItem(item: any, ctx: VehicleItemContext) {
    // Determine crewed status
    const isCrewed = item.system.crewed;
    ctx.toggleClass = isCrewed ? 'active' : '';
    ctx.toggleTitle = FoundryAdapter.localize(
      `DND5E.${isCrewed ? 'Crewed' : 'Uncrewed'}`
    );

    // Handle crew actions
    if (item.type === 'feat' && item.system.activation?.type === 'crew') {
      if (item.system.cover === 1) {
        ctx.cover = FoundryAdapter.localize('DND5E.CoverTotal');
      } else if (item.system.cover === 0.5) {
        ctx.cover = '½';
      } else if (item.system.cover === 0.75) {
        ctx.cover = '¾';
      } else {
        ctx.cover = '—';
      }
    }

    // Prepare vehicle weapons
    if (item.type === 'equipment' || item.type === 'weapon') {
      ctx.threshold = item.system.hp?.dt ? item.system.hp.dt : '—';
    }
  }

  protected _getSheetPinTabIdsForItem(item: Item5e): string[] {
    const tabIds: string[] = [];

    // TODO: Somehow share the mountable logic somewhere
    const originTab =
      Inventory.isItemInventoryType(item) && !item.system.isMountable
        ? CONSTANTS.TAB_ACTOR_INVENTORY
        : CONSTANTS.TAB_STATBLOCK;

    if (originTab) {
      tabIds.push(originTab);
    }

    return tabIds;
  }

  _prepareTravelSpeeds(): VehicleSheetQuadroneContext['travelSpeeds'] {
    const travelUnits = this.actor.system.attributes.travel?.units;
    const travelPaceEntries = this._buildTravelPaceEntries();

    const unitsDay =
      CONFIG.DND5E.travelUnits[travelUnits]?.abbreviationDay ?? travelUnits;
    const unitsHour =
      CONFIG.DND5E.travelUnits[travelUnits]?.abbreviationHour ?? travelUnits;

    // Determine the current/primary travel speed
    const currentSpeed = travelPaceEntries[0] ?? {
      key: '',
      label: '',
      valueDay: 0,
      valueHour: 0,
      unitsDay,
      unitsHour,
    };

    return {
      currentSpeed,
      travelSpeeds: travelPaceEntries,
      units: {
        day: unitsDay,
        hour: unitsHour,
      },
    };
  }

  _buildTravelPaceEntries(): TravelSpeedConfigEntry[] {
    const entries: TravelSpeedConfigEntry[] = [];
    const paces = this.actor.system.attributes.travel?.paces;
    const speeds = this.actor.system.attributes.travel?.speeds;
    const travelUnits = this.actor.system.attributes.travel?.units;

    const unitsDay =
      CONFIG.DND5E.travelUnits[travelUnits]?.abbreviationDay ?? travelUnits;
    const unitsHour =
      CONFIG.DND5E.travelUnits[travelUnits]?.abbreviationHour ?? travelUnits;

    if (paces?.land > 0) {
      entries.push({
        key: 'land',
        label: localize('DND5E.TRAVEL.Type.Land'),
        valueDay: paces.land,
        valueHour: speeds.land,
        unitsDay,
        unitsHour,
      });
    }
    if (paces?.air > 0) {
      entries.push({
        key: 'air',
        label: localize('DND5E.TRAVEL.Type.Air'),
        valueDay: paces.air,
        valueHour: speeds.air,
        unitsDay,
        unitsHour,
      });
    }
    if (paces?.water > 0) {
      entries.push({
        key: 'water',
        label: localize('DND5E.TRAVEL.Type.Water'),
        valueDay: paces.water,
        valueHour: speeds.water,
        unitsDay,
        unitsHour,
      });
    }

    return entries;
  }

  async removeDraftAnimal(uuid: string) {
    const draft = [...this.actor.system.draft.value];
    const removed = draft.findSplice((u) => u === uuid);

    if (removed) {
      return await this.actor.update({ 'system.draft.value': draft });
    }
  }

  _onAdjustCrew(
    actor: Actor5e,
    dest: CrewArea5e,
    { src }: { src?: CrewArea5e } = {}
  ) {
    const updates = {};

    if (src) {
      Object.assign(
        updates,
        this.actor.system.getCrewUpdates(src, actor.uuid, '-1')
      );
    }

    Object.assign(
      updates,
      this.actor.system.getCrewUpdates(dest, actor.uuid, '+1')
    );

    if (!foundry.utils.isEmpty(updates)) {
      this.actor.update(updates);
    }
  }

  /**
   * Handle assigning a crew member to a station.
   * @param actor            The actor.
   * @param item              The station.
   * @param options.src An optional area the crew member came from.
   * @protected
   */
  async _assignCrew(
    actor: Actor5e,
    item: Item5e,
    { src }: { src?: CrewArea5e } = {}
  ): Promise<void> {
    const itemUpdates = { _id: item.id };
    const actorUpdates = { items: [itemUpdates] };
    let crew = foundry.utils.getProperty(item, 'system.crew.value');

    // Prevent assigning a non-crew-member.
    if (src && src !== 'crew') {
      return;
    }

    // The actor may not be a crew member yet. If so, add them to the crew.
    if (!src) {
      Object.assign(
        actorUpdates,
        this.actor.system.getCrewUpdates('crew', actor.uuid, '+1')
      );
    }

    foundry.utils.setProperty(
      itemUpdates,
      'system.crew.value',
      crew.concat(actor.uuid)
    );

    await this.actor.update(actorUpdates);
  }

  async applyDeltaToCrew(area: CrewArea5e, uuid: string, delta: string) {
    let updates = {};
    Object.assign(updates, this.actor.system.getCrewUpdates(area, uuid, delta));
    await this.actor.update(updates);
  }

  /* -------------------------------------------- */
  /*  Drag and Drop                               */
  /* -------------------------------------------- */

  /**
   * Prepare vehicle-specific drag operations so
   * the vehicle sheet can properly handle
   * crew assignment and adjustment.
   * This drag logic is intended to be compatible with default
   * vehicle sheets.
   */
  async _onDragStart(
    event: DragEvent & { target: HTMLElement; currentTarget: HTMLElement }
  ) {
    const { area } =
      event.target.closest<HTMLElement>('[data-area]')?.dataset ?? {};
    const { uuid } =
      event.target.closest<HTMLElement>('[data-uuid]')?.dataset ?? {};
    const { itemId } =
      event.target.closest<HTMLElement>('[data-item-id]')?.dataset ?? {};
    const { type } = foundry.utils.parseUuid(uuid) ?? {};

    if (!area || type !== 'Actor') {
      return super._onDragStart(event);
    }

    event.dataTransfer?.setData(
      'text/plain',
      JSON.stringify({ area, itemId, type, uuid })
    );
  }

  async _onDropActor(
    event: DragEvent & { target: HTMLElement; currentTarget: HTMLElement },
    document: Actor5e
  ) {
    if (!document.system.isCreature) {
      return;
    }

    let { area: src, itemId /* later, for assignment drops */ } =
      foundry.applications.ux.TextEditor.getDragEventData(event);

    const { area: dest = 'crew' } =
      event.target?.closest<HTMLElement>('[data-area]')?.dataset ?? {};

    if (src === dest) {
      // Try Sort?
      return;
    }

    // TODO: Handle Assignment, if relevant, instead of adjusting crew

    return this._onAdjustCrew(document, dest, { src });
  }

  /* -------------------------------------------- */
  /*  Helpers                                     */
  /* -------------------------------------------- */

  /**
   * Group crew by UUID.
   */
  groupCrew(crew: string[]): Record<string, number> {
    return crew.reduce((obj, uuid) => {
      obj[uuid] ??= 0;
      obj[uuid]++;
      return obj;
    }, {} as Record<string, number>);
  }

  /* -------------------------------------------- */

  /**
   * Resolve crew UUIDs.
   */
  async resolveCrewMemberContext(
    group: Record<string, number>,
    // Actor UUID to Item UUIDs set
    actorToItemAssignments?: Record<string, string[]>
  ): Promise<{
    value: {
      actor: Actor5e;
      quantity: number;
      uuid: string;
      subtitle: string;
    }[];
  }> {
    let total = 0;

    const value = await Promise.all(
      Object.entries(group)
        .filter(([, quantity]) => quantity)
        .map(async ([uuid, quantity]) => {
          total += quantity;
          const actor = await fromUuid(uuid);
          const { system } = actor;
          const cr = system.details?.cr ?? system.details?.level;
          const subtitle = [
            CONFIG.DND5E.actorSizes[system.traits?.size]?.label,
            system.details?.type?.label,
            system.details?.cr
              ? game.i18n.format('DND5E.CRLabel', {
                  cr: dnd5e.utils.formatCR(system.details.cr),
                })
              : null,
            system.details?.level
              ? game.i18n.format('DND5E.LevelNumber', {
                  level: system.details.level,
                })
              : null,
          ].filterJoin(' • ');
          return {
            uuid,
            quantity,
            actor,
            cr,
            subtitle,
          };
        })
    );

    return {
      value: value.sort((a, b) => {
        return (
          (b.cr ?? 0) - (a.cr ?? 0) ||
          a.quantity - b.quantity ||
          a.actor.name.localeCompare(b.actor.name, game.i18n.lang)
        );
      }),
    };
  }

  private _getSubtitle(actor: Actor5e) {
    const system = actor.system;

    return [
      CONFIG.DND5E.actorSizes[system.traits?.size]?.label,
      system.details?.type?.label,
      system.details?.cr
        ? game.i18n.format('DND5E.CRLabel', {
            cr: dnd5e.utils.formatCR(system.details.cr),
          })
        : null,
      system.details?.level
        ? game.i18n.format('DND5E.LevelNumber', {
            level: system.details.level,
          })
        : null,
    ].filterJoin(' • ');
  }
}