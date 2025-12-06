import { CONSTANTS } from 'src/constants';
import type {
  ApplicationConfiguration,
  ApplicationRenderOptions,
} from 'src/types/application.types';
import VehicleSheet from './actor/VehicleSheet.svelte';
import { mount } from 'svelte';
import type {
  SimpleEditableColumn,
  VehicleCargoSection,
  VehicleFeatureSection,
  VehicleItemContext,
  VehicleSheetQuadroneContext,
  ActorSheetQuadroneContext,
} from 'src/types/types';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import { Tidy5eActorSheetQuadroneBase } from './Tidy5eActorSheetQuadroneBase.svelte';
import { VehicleSheetQuadroneRuntime } from 'src/runtime/actor/VehicleSheetQuadroneRuntime.svelte';
import { ItemContext } from 'src/features/item/ItemContext';
import { ConditionsAndEffects } from 'src/features/conditions-and-effects/ConditionsAndEffects';
import { Activities } from 'src/features/activities/activities';
import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import UserPreferencesService from 'src/features/user-preferences/UserPreferencesService';
import { Inventory } from 'src/features/sections/Inventory';
import type { CurrencyContext } from 'src/types/item.types';
import { actorUsesActionFeature } from 'src/features/actions/actions.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

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
    ApplicationConfiguration & { dragDrop:  Partial<DragDropConfiguration>[] }
  > = {
    position: {
      width: 740,
      height: 810,
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

    const enrichmentArgs = {
      secrets: this.actor.isOwner,
      rollData: actorContext.rollData,
      relativeTo: this.actor,
    };

    const context: VehicleSheetQuadroneContext = {
      abilities: this._prepareAbilities(actorContext),
      cargo: [],
      crew: this.actor.system.cargo.crew,
      conditions: conditions,
      currencies,
      effects: enhancedEffectSections,
      encumbrance: this.actor.system.attributes.encumbrance,
      enriched: {
        biography: await foundry.applications.ux.TextEditor.enrichHTML(
          this.actor.system.details.biography.value,
          enrichmentArgs
        ),
      },
      features: [],
      passengers: this.actor.system.cargo.passengers,
      scale: this.actor.system.attributes.scale,
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
      traits: this._prepareTraits(),
      type: CONSTANTS.SHEET_TYPE_VEHICLE,
      utilities: {},
      ...actorContext,
    };

    context.useActionsFeature = actorUsesActionFeature(this.actor);

    // Prepare owned items
    this._prepareItems(context);

    // Custom content
    context.customContent = await VehicleSheetQuadroneRuntime.getContent(
      context
    );

    // Runtime Tabs
    context.tabs = await VehicleSheetQuadroneRuntime.getTabs(context);

    return context;
  }

  _prepareItems(context: VehicleSheetQuadroneContext) {
    // TODO: Replace with Tidy Column Selection implementation
    const cargoColumns: SimpleEditableColumn[] = [
      {
        label: localize('DND5E.Quantity'),
        css: 'item-qty',
        property: 'quantity',
        editable: 'Number',
      },
    ];

    // TODO: Replace with Tidy Column Selection implementation
    const equipmentColumns: SimpleEditableColumn[] = [
      {
        label: localize('DND5E.Quantity'),
        css: 'item-qty',
        property: 'system.quantity',
        editable: 'Number',
      },
      {
        label: localize('DND5E.AC'),
        css: 'item-ac',
        property: 'system.armor.value',
      },
      {
        label: localize('DND5E.HP'),
        css: 'item-hp',
        property: 'system.hp.value',
        maxProperty: 'system.hp.max',
        editable: 'Number',
      },
      {
        label: localize('DND5E.Threshold'),
        css: 'item-threshold',
        property: 'threshold',
      },
    ];

    const features: Record<string, VehicleFeatureSection> = {
      actions: {
        type: CONSTANTS.SECTION_TYPE_FEATURE,
        label: localize('DND5E.ActionPl'),
        items: [],
        hasActions: true,
        crewable: true,
        key: 'actions',
        dataset: { type: 'feat' },
        columns: [
          {
            label: localize('DND5E.Cover'),
            css: 'item-cover',
            property: 'cover',
          },
        ],
        show: true,
        rowActions: [], // for the UI Overhaul
        sectionActions: [], // for the UI Overhaul
        canCreate: true,
      },
      equipment: {
        type: CONSTANTS.SECTION_TYPE_FEATURE,
        label: localize(CONFIG.Item.typeLabels.equipment),
        items: [],
        crewable: true,
        dataset: { type: 'equipment', 'system.type.value': 'vehicle' },
        columns: equipmentColumns,
        key: 'equipment',
        show: true,
        rowActions: [], // for the UI Overhaul
        sectionActions: [], // for the UI Overhaul
        canCreate: true,
      },
      passive: {
        type: CONSTANTS.SECTION_TYPE_FEATURE,
        label: localize('DND5E.Features'),
        items: [],
        dataset: { type: 'feat' },
        key: 'passive',
        show: true,
        rowActions: [], // for the UI Overhaul
        sectionActions: [], // for the UI Overhaul
        canCreate: true,
      },
      reactions: {
        type: CONSTANTS.SECTION_TYPE_FEATURE,
        label: localize('DND5E.ReactionPl'),
        items: [],
        dataset: { type: 'feat' },
        key: 'reactions',
        show: true,
        rowActions: [], // for the UI Overhaul
        sectionActions: [], // for the UI Overhaul
        canCreate: true,
      },
      weapons: {
        type: CONSTANTS.SECTION_TYPE_FEATURE,
        label: localize(`${CONFIG.Item.typeLabels.weapon}Pl`),
        items: [],
        crewable: true,
        dataset: { type: 'weapon', 'system.weaponType': 'siege' },
        columns: equipmentColumns,
        key: 'weapons',
        show: true,
        rowActions: [], // for the UI Overhaul
        sectionActions: [], // for the UI Overhaul
        canCreate: true,
      },
    };

    context.items.forEach((item) => {
      const ctx = (context.itemContext[item.id] ??= {});
      this._prepareItem(item, ctx);
    });

    const cargo: Record<string, VehicleCargoSection> = {
      crew: {
        type: CONSTANTS.SECTION_TYPE_CARGO,
        label: localize('DND5E.VehicleCrew'),
        items: context.actor.system.cargo.crew,
        css: 'cargo-row crew',
        editableName: true,
        dataset: { type: 'crew' },
        columns: cargoColumns,
        key: 'crew',
        show: true,
        rowActions: [], // for the UI Overhaul
        sectionActions: [], // for the UI Overhaul
      },
      passengers: {
        type: CONSTANTS.SECTION_TYPE_CARGO,
        label: localize('DND5E.VehiclePassengers'),
        items: context.actor.system.cargo.passengers,
        css: 'cargo-row passengers',
        editableName: true,
        dataset: { type: 'passengers' },
        columns: cargoColumns,
        key: 'passengers',
        show: true,
        rowActions: [], // for the UI Overhaul
        sectionActions: [], // for the UI Overhaul
      },
      cargo: {
        type: CONSTANTS.SECTION_TYPE_CARGO,
        label: localize('DND5E.VehicleCargo'),
        items: [],
        dataset: { type: 'loot' },
        columns: [
          {
            label: localize('DND5E.Quantity'),
            css: 'item-qty',
            property: 'system.quantity',
            editable: 'Number',
          },
          {
            label: localize('DND5E.Price'),
            css: 'item-price',
            property: 'system.price.value',
            editable: 'Number',
          },
          {
            label: localize('DND5E.Weight'),
            css: 'item-weight',
            property: 'system.weight.value',
            editable: 'Number',
          },
        ],
        key: CONSTANTS.SECTION_TYPE_CARGO,
        show: true,
        rowActions: [], // for the UI Overhaul
        sectionActions: [], // for the UI Overhaul
      },
    };

    const baseUnits =
      CONFIG.DND5E.encumbrance.baseUnits[
        this.actor.type as keyof typeof CONFIG.DND5E.encumbrance.baseUnits
      ] ?? CONFIG.DND5E.encumbrance.baseUnits.default;
    const units = game.settings.get('dnd5e', 'metricWeightUnits')
      ? baseUnits.metric
      : baseUnits.imperial;

    // Classify items owned by the vehicle and compute total cargo weight
    let totalWeight = 0;
    for (const item of context.items) {
      const ctx = (context.itemContext[item.id] ??= {});
      this._prepareCrewedItem(item, ctx);

      // Handle cargo explicitly
      const isCargo = item.flags.dnd5e?.vehicleCargo === true;
      if (isCargo) {
        totalWeight += item.system.totalWeightin?.(units) ?? 0;
        cargo.cargo.items.push(item);
        continue;
      }

      // Handle non-cargo item types
      switch (item.type) {
        case 'weapon':
          features.weapons.items.push(item);
          break;
        case 'equipment':
          features.equipment.items.push(item);
          break;
        case 'feat':
          // TODO: Determine the best way to delineate active, passive, and reaction-based item sections.
          const firstActivityActivationType =
            item.system.activities?.contents[0]?.activation?.type;
          if (
            !firstActivityActivationType ||
            firstActivityActivationType === 'none'
          ) {
            features.passive.items.push(item);
          } else if (firstActivityActivationType === 'reaction') {
            features.reactions.items.push(item);
          } else {
            features.actions.items.push(item);
          }
          break;
        default:
          totalWeight += item.system.totalWeightIn?.(units) ?? 0;
          cargo.cargo.items.push(item);
      }
    }

    // Update the rendering context data
    context.features = Object.values(features);
    context.cargo = Object.values(cargo);
  }

  protected _prepareItem(item: any, ctx: VehicleItemContext) {
    const { uses } = item.system;
    ctx.canToggle = false;
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

  protected _getSheetPinTabIdsForItem(item: any): string[] {
    return [CONSTANTS.TAB_VEHICLE_ATTRIBUTES];
  }
}

