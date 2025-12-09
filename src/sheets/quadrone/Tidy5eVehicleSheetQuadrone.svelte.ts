import { CONSTANTS } from 'src/constants';
import type {
  ApplicationConfiguration,
  ApplicationRenderOptions,
} from 'src/types/application.types';
import VehicleSheet from './actor/VehicleSheet.svelte';
import { mount } from 'svelte';
import type {
  VehicleItemContext,
  VehicleSheetQuadroneContext,
  ActorSheetQuadroneContext,
  InventorySection,
  ActorInventoryTypes,
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
import TableRowActionsRuntime from 'src/runtime/tables/TableRowActionsRuntime.svelte';
import { SheetSections } from 'src/features/sections/SheetSections';
import SectionActions from 'src/features/sections/SectionActions';

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
      inventory: [],
      crew: this.actor.system.cargo.crew,
      conditions: conditions,
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
    const statblock: Record<string, InventorySection> = {
      features: {
        type: CONSTANTS.SECTION_TYPE_INVENTORY,
        items: [],
        canCreate: true,
        label: 'DND5E.Features',
        dataset: {
          ['type']: CONSTANTS.ITEM_TYPE_FEAT,
        },
        key: 'features',
        rowActions: [],
        sectionActions: [],
        show: true,
      },
      weapons: {
        type: CONSTANTS.SECTION_TYPE_INVENTORY,
        items: [],
        canCreate: true,
        label: 'TYPES.Item.weaponPl',
        dataset: {
          ['type']: CONSTANTS.ITEM_TYPE_WEAPON,
          ['system.type.value']: CONSTANTS.ITEM_SUBTYPE_SIEGE_WEAPON,
        },
        key: 'weapons',
        rowActions: [],
        sectionActions: [],
        show: true,
      },
      equipment: {
        type: CONSTANTS.SECTION_TYPE_INVENTORY,
        items: [],
        canCreate: true,
        label: 'TYPES.Item.equipmentPl',
        dataset: {
          ['type']: CONSTANTS.ITEM_TYPE_EQUIPMENT,
          ['system.type.value']: CONSTANTS.ITEM_SUBTYPE_VEHICLE_EQUIPMENT,
        },
        key: 'equipment',
        rowActions: [],
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

    for (const item of context.items) {
      const ctx = (context.itemContext[item.id] ??= {});
      this._prepareItem(item, ctx);

      // partition to section
      if (Inventory.isItemInventoryType(item) && !item.system.isMountable) {
        // Cargo
        Inventory.applyInventoryItemToSection(inventory, item, inventoryTypes, {
          canCreate: true,
          rowActions: inventoryRowActions,
        });
      } else {
        // Statblock
        const section =
          item.type === CONSTANTS.ITEM_TYPE_WEAPON
            ? 'weapons'
            : item.type === CONSTANTS.ITEM_TYPE_EQUIPMENT
            ? 'equipment'
            : 'features';

        statblock[section].items.push(item);
      }

      // TODO: Custom sections?

      context.features = Object.values(statblock);
      context.inventory = Object.values(inventory);

      context.features.forEach((section) => {
        section.sectionActions = SectionActions.getStandardItemHeaderActions(
          this.actor,
          this.actor.isOwner,
          context.unlocked,
          section
        );
      });

      context.inventory.forEach((section) => {
        section.sectionActions = SectionActions.getStandardItemHeaderActions(
          this.actor,
          this.actor.isOwner,
          context.unlocked,
          section
        );
      });

      SheetSections.getFilteredGlobalSectionsToShowWhenEmpty(
        context.actor,
        CONSTANTS.TAB_ACTOR_INVENTORY
      ).forEach((s) => {
        inventory[s] ??= Inventory.createInventorySection(s, inventoryTypes, {
          canCreate: true,
          rowActions: inventoryRowActions,
        });
      });
    }
  }

  protected _prepareItem(item: any, ctx: VehicleItemContext) {
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
    if (item.system.isMountable) {
      // TODO
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

  protected _getSheetPinTabIdsForItem(item: any): string[] {
    return [CONSTANTS.TAB_VEHICLE_ATTRIBUTES];
  }
}
