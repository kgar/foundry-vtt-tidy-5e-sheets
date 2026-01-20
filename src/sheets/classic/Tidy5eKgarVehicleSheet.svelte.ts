import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { settings } from 'src/settings/settings.svelte';
import type {
  SheetExpandedItemsCacheable,
  SheetStats,
  SheetTabCacheable,
  ExpandedItemData,
  ExpandedItemIdToLocationsMap,
  VehicleSheetContext,
  Utilities,
  SearchFilterCacheable,
  VehicleItemContext,
  VehicleMemberSection,
  Actor5e,
} from 'src/types/types';
import VehicleSheet from './vehicle/VehicleSheet.svelte';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import { mount } from 'svelte';
import { debug } from 'src/utils/logging';
import type { Item5e, ItemChatData } from 'src/types/item.types';
import { actorUsesActionFeature } from 'src/features/actions/actions.svelte';
import { CustomActorTraitsRuntime } from 'src/runtime/actor-traits/CustomActorTraitsRuntime';
import { ItemTableToggleCacheService } from 'src/features/caching/ItemTableToggleCacheService';
import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import { DocumentTabSectionConfigApplication } from 'src/applications/section-config/DocumentTabSectionConfigApplication.svelte';
import { SheetSections } from 'src/features/sections/SheetSections';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
import { Container } from 'src/features/containers/Container';
import { Activities } from 'src/features/activities/activities';
import { ExpansionTracker } from 'src/features/expand-collapse/ExpansionTracker.svelte';
import { ItemContext } from 'src/features/item/ItemContext';
import VehicleSheetClassicRuntime from 'src/runtime/actor/VehicleSheetClassicRuntime.svelte';
import { Inventory } from 'src/features/sections/Inventory';
import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime.svelte';
import { Tidy5eActorSheetClassicV2Base } from './Tidy5eActorSheetClassicV2Base.svelte';
import type { ApplicationConfiguration } from 'src/types/application.types';
import { mapGetOrInsert } from 'src/utils/map';

export class Tidy5eVehicleSheet
  extends Tidy5eActorSheetClassicV2Base<VehicleSheetContext>(
    CONSTANTS.SHEET_TYPE_VEHICLE
  )
  implements
    SheetTabCacheable,
    SheetExpandedItemsCacheable,
    SearchFilterCacheable
{
  stats = $state<SheetStats>({
    lastSubmissionTime: null,
  });
  currentTabId: string;
  expandedItems: ExpandedItemIdToLocationsMap = new Map<string, Set<string>>();
  expandedItemData: ExpandedItemData = new Map<string, ItemChatData>();
  inlineToggleService = new InlineToggleService();
  itemTableTogglesCache: ItemTableToggleCacheService;
  sectionExpansionTracker: ExpansionTracker;

  constructor(...args: any[]) {
    super(...args);

    this.itemTableTogglesCache = new ItemTableToggleCacheService({
      userId: game.user.id,
      documentId: this.actor.id,
    });

    this.currentTabId = settings.value.initialVehicleSheetTab;

    this.sectionExpansionTracker = new ExpansionTracker(
      true,
      this.document,
      CONSTANTS.LOCATION_SECTION
    );
  }

  /** @override */
  static unsupportedItemTypes = new Set([
    'background',
    'class',
    'race',
    'subclass',
  ]);

  static DEFAULT_OPTIONS: Partial<ApplicationConfiguration> = {
    position: {
      width: 740,
      height: 810,
    },
    actions: {
      browseActors: async function () {
        new dnd5e.applications.CompendiumBrowser({
          filters: {
            locked: {
              documentClass: 'Actor',
              types: new Set(['character', 'npc']),
            },
          },
        }).render({ force: true });
      },
    },
  };

  _createComponent(node: HTMLElement): Record<string, any> {
    const component = mount(VehicleSheet, {
      target: node,
      context: new Map<any, any>([
        [CONSTANTS.SVELTE_CONTEXT.APP_ID, this.appId],
        [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this._context],
        [CONSTANTS.SVELTE_CONTEXT.STATS, this.stats],
        [
          CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
          this.inlineToggleService,
        ],
        [CONSTANTS.SVELTE_CONTEXT.ITEM_FILTER_SERVICE, this.itemFilterService],
        [
          CONSTANTS.SVELTE_CONTEXT.ON_FILTER,
          this.itemFilterService.onFilter.bind(this.itemFilterService),
        ],
        [
          CONSTANTS.SVELTE_CONTEXT.ON_FILTER_CLEAR_ALL,
          this.itemFilterService.onFilterClearAll.bind(this.itemFilterService),
        ],
        [
          CONSTANTS.SVELTE_CONTEXT.ON_TAB_SELECTED,
          this.onTabSelected.bind(this),
        ],
        [
          CONSTANTS.SVELTE_CONTEXT.ON_ITEM_TOGGLED,
          this.onItemToggled.bind(this),
        ],
        [CONSTANTS.SVELTE_CONTEXT.LOCATION, ''],
        [CONSTANTS.SVELTE_CONTEXT.EXPANDED_ITEMS, new Map(this.expandedItems)],
        [
          CONSTANTS.SVELTE_CONTEXT.EXPANDED_ITEM_DATA,
          new Map(this.expandedItemData),
        ],
        [
          CONSTANTS.SVELTE_CONTEXT.ITEM_TABLE_TOGGLES,
          new Map(this.itemTableTogglesCache.itemTableToggles),
        ],
        [
          CONSTANTS.SVELTE_CONTEXT.ON_ITEM_TABLE_TOGGLE,
          this.itemTableTogglesCache.onItemTableToggle.bind(
            this.itemTableTogglesCache
          ),
        ],
        [
          CONSTANTS.SVELTE_CONTEXT.SECTION_EXPANSION_TRACKER,
          this.sectionExpansionTracker,
        ],
      ]),
    });

    initTidy5eContextMenu(this, node, CONSTANTS.SHEET_LAYOUT_CLASSIC);

    return component;
  }

  async _prepareContext(options = {}) {
    const defaultDocumentContext = await super._prepareContext(options);

    const vehiclePreferences = UserSheetPreferencesService.getByType(
      this.actor.type
    );

    const actionListSortMode =
      vehiclePreferences.tabs?.[CONSTANTS.TAB_ACTOR_ACTIONS]?.sort ?? 'm';

    const utilities: Utilities<VehicleSheetContext> = {
      [CONSTANTS.TAB_ACTOR_ACTIONS]: {
        utilityToolbarCommands: [
          {
            id: 'sort-mode-alpha',
            title: FoundryAdapter.localize('SIDEBAR.SortModeAlpha'),
            iconClass: 'fa-solid fa-arrow-down-a-z fa-fw',
            execute: async () => {
              await UserSheetPreferencesService.setDocumentTypeTabPreference(
                this.actor.type,
                CONSTANTS.TAB_ACTOR_ACTIONS,
                'sort',
                'm'
              );
            },
            visible: actionListSortMode === 'a',
          },
          {
            id: 'action-list-default',
            title: FoundryAdapter.localize('TIDY5E.SortMode.ActionListDefault'),
            iconClass: 'fa-solid fa-arrow-down-short-wide fa-fw',
            execute: async () => {
              await UserSheetPreferencesService.setDocumentTypeTabPreference(
                this.actor.type,
                CONSTANTS.TAB_ACTOR_ACTIONS,
                'sort',
                'a'
              );
            },
            visible: actionListSortMode === 'm',
          },
          {
            id: 'expand-all',
            title: FoundryAdapter.localize('TIDY5E.Commands.ExpandAll'),
            iconClass: 'fas fa-angles-down',
            execute: () =>
              this.sectionExpansionTracker.setAll(
                CONSTANTS.TAB_ACTOR_ACTIONS,
                true
              ),
          },
          {
            id: 'collapse-all',
            title: FoundryAdapter.localize('TIDY5E.Commands.CollapseAll'),
            iconClass: 'fas fa-angles-up',
            execute: () =>
              this.sectionExpansionTracker.setAll(
                CONSTANTS.TAB_ACTOR_ACTIONS,
                false
              ),
          },
          {
            id: 'configure-sections',
            title: FoundryAdapter.localize(
              'TIDY5E.Utilities.ConfigureSections'
            ),
            iconClass: 'fas fa-cog',
            execute: ({ context, sections }) => {
              new DocumentTabSectionConfigApplication(
                {
                  sections: sections,
                  tabId: CONSTANTS.TAB_ACTOR_ACTIONS,
                  tabTitle: VehicleSheetClassicRuntime.getTabTitle(
                    CONSTANTS.TAB_ACTOR_ACTIONS
                  ),
                },
                {
                  document: context.actor,
                }
              ).render(true);
            },
          },
        ],
      },
    };

    const context: VehicleSheetContext = {
      inventory: [],
      draft: await this._prepareMemberSection(
        'draft',
        'TIDY5E.Vehicle.Member.DraftAnimal.LabelPl',
        'DND5E.VEHICLE.Action.Drop.Animal'
      ),
      passengers: await this._prepareMemberSection(
        'passengers',
        'DND5E.VEHICLE.Crew.Passengers',
        'DND5E.VEHICLE.Action.Drop.Passengers'
      ),
      crew: await this._prepareMemberSection(
        'crew',
        'DND5E.VEHICLE.Crew.Label',
        'DND5E.VEHICLE.Action.Drop.Crew'
      ),
      features: {
        ...SheetSections.EMPTY,
        type: 'feature',
        key: 'features',
        label: 'TYPES.Item.featurePl',
        canCreate: true,
        items: [],
        dataset: {
          type: CONSTANTS.ITEM_TYPE_FEAT,
        },
      },
      useActionsFeature: actorUsesActionFeature(this.actor),
      utilities: utilities,
      equipmentStations: {
        ...SheetSections.EMPTY,
        type: 'inventory',
        label: 'TYPES.Item.equipmentPl',
        key: 'equipment',
        items: [],
        canCreate: true,
        dataset: {
          type: CONSTANTS.ITEM_TYPE_EQUIPMENT,
          ['system.type.value']: 'vehicle',
        },
      },
      weaponStations: {
        ...SheetSections.EMPTY,
        type: 'inventory',
        key: 'weapons',
        label: 'TYPES.Item.weaponPl',
        items: [],
        canCreate: true,
        dataset: {
          type: CONSTANTS.ITEM_TYPE_WEAPON,
          ['system.type.value']: 'siege',
        },
      },
      ...defaultDocumentContext,
    };

    this._prepareVehicleItems(context);

    context.filterData = this.itemFilterService.getFilterData();
    context.filterPins = ItemFilterRuntime.defaultFilterPins[this.actor.type];

    context.useClassicControls = settings.value.useClassicControlsForVehicle;

    context.customActorTraits = CustomActorTraitsRuntime.getEnabledTraitsLegacy(
      {
        context,
        app: this,
        element: this.element,
      }
    );

    context.customContent = await VehicleSheetClassicRuntime.getContent(
      context
    );

    for (const item of context.items) {
      const ctx = context.itemContext[item.id];
      if (item.type === CONSTANTS.ITEM_TYPE_CONTAINER) {
        ctx.containerContents = await Container.getContainerContents(item, {
          hasActor: true,
          unlocked: context.unlocked,
        });
      }
    }

    let tabs = await VehicleSheetClassicRuntime.getTabs(context);

    const selectedTabs = TidyFlags.selectedTabs.get(context.actor);

    if (selectedTabs?.length) {
      tabs = tabs
        .filter((t) => selectedTabs?.includes(t.id))
        .sort(
          (a, b) => selectedTabs.indexOf(a.id) - selectedTabs.indexOf(b.id)
        );
    } else {
      const defaultTabs = settings.value.defaultVehicleSheetTabs;
      tabs = tabs
        .filter((t) => defaultTabs?.includes(t.id))
        .sort((a, b) => defaultTabs.indexOf(a.id) - defaultTabs.indexOf(b.id));
    }

    context.tabs = tabs;

    await this.setExpandedItemData();

    debug('Vehicle Sheet context data', context);

    return context;
  }

  async _prepareMemberSection(
    area: string,
    label: string,
    dropLabel: string
  ): Promise<VehicleMemberSection> {
    const section: VehicleMemberSection = {
      ...SheetSections.EMPTY,
      members: [],
      dropLabel,
      label,
    };

    const memberUuids = this.actor.system[area]?.value ?? [];

    const memberCounts: Record<string, { actor: Actor5e; quantity: number }> =
      {};

    for (const uuid of memberUuids) {
      if (memberCounts[uuid]) {
        memberCounts[uuid].quantity++;
      } else {
        const actor = await fromUuid(uuid);
        if (actor) {
          memberCounts[uuid] = {
            actor,
            quantity: 1,
          };
        }
      }
    }

    section.members = Object.values(memberCounts);

    return section;
  }

  _prepareVehicleItems(context: VehicleSheetContext) {
    const inventory = Inventory.getDefaultInventorySections();
    const inventoryTypes = Inventory.getInventoryTypes();

    context.items.forEach((item) => {
      context.itemContext[item.id] ??= this._prepareItem(item, context);

      // Stations - Equipment
      if (
        item.system.isMountable &&
        item.type === CONSTANTS.ITEM_TYPE_EQUIPMENT
      ) {
        context.equipmentStations.items.push(item);
      }
      // Stations - Weapons
      else if (
        item.system.isMountable &&
        item.type === CONSTANTS.ITEM_TYPE_WEAPON
      ) {
        context.weaponStations.items.push(item);
      }
      // Inventory
      else if (Inventory.isItemInventoryType(item)) {
        Inventory.applyInventoryItemToSection(inventory, item, inventoryTypes, {
          canCreate: true,
          rowActions: [],
        });
      }
      // Features (and stray items)
      else {
        context.features.items.push(item);
      }
    });

    context.inventory = Object.values(inventory);
  }

  _prepareItem(item: Item5e, context: VehicleSheetContext): VehicleItemContext {
    const { uses } = item.system;
    const ctx: VehicleItemContext = {};
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

    if (item.isMountable) {
      this._prepareCrewedItem(item, ctx);
    }
    
    return ctx;
  }

  /**
   * Prepare items that are mounted to a vehicle and require one or more crew to operate.
   * @param {object} item     Copy of the item data being prepared for display.
   * @param {object} context  Display context for the item.
   * @protected
   */
  _prepareCrewedItem(item: Item5e, context: VehicleItemContext) {
    // Determine crewed status
    const isCrewed = item.system.crewed;
    context.toggleClass = isCrewed ? 'active' : '';
    context.toggleTitle = game.i18n.localize(
      `DND5E.${isCrewed ? 'Crewed' : 'Uncrewed'}`
    );

    // Handle crew actions
    if (item.type === 'feat' && item.system.activation?.type === 'crew') {
      if (item.system.cover === 1) {
        context.cover = game.i18n.localize('DND5E.CoverTotal');
      } else if (item.system.cover === 0.5) {
        context.cover = '½';
      } else if (item.system.cover === 0.75) {
        context.cover = '¾';
      } else {
        context.cover = '—';
      }
    }

    // Prepare vehicle weapons
    if (item.type === 'equipment' || item.type === 'weapon') {
      context.threshold = item.system.hp?.dt ? item.system.hp.dt : '—';
    }
  }

  private async setExpandedItemData() {
    this.expandedItemData.clear();
    for (const [id, locations] of this.expandedItems) {
      if (locations.size === 0) {
        continue;
      }
      const item = this.actor.items.get(id);
      if (item) {
        this.expandedItemData.set(
          id,
          await item.getChatData({ secrets: this.actor.isOwner })
        );
      }
    }
  }

  async _onDropSingleItem(
    itemData: any,
    event: DragEvent & { target: HTMLElement; currentTarget: HTMLElement }
  ) {
    const cargoTypes = Inventory.getInventoryTypes();
    const isCargo =
      cargoTypes.includes(itemData.type) &&
      this.currentTabId === CONSTANTS.TAB_VEHICLE_CARGO_LEGACY;
    foundry.utils.setProperty(itemData, 'flags.dnd5e.vehicleCargo', isCargo);

    // Create a Consumable spell scroll on the Inventory tab
    if (itemData.type === 'spell') {
      const options: Record<string, unknown> = {};

      if (settings.value.includeFlagsInSpellScrollCreation) {
        options.flags = itemData.flags;
      }

      const scroll = await dnd5e.documents.Item5e.createScrollFromSpell(
        itemData,
        options
      );

      return scroll.toObject();
    }

    return await super._onDropSingleItem.call(this, itemData, event);
  }

  async _onDropActor(
    event: DragEvent,
    actorData: { type: string; uuid: string } & Record<string, any>
  ) {
    const actor = await fromUuid(actorData.uuid);

    if (!actor?.system.isCreature) {
      return;
    }

    const target = event.target as HTMLElement | undefined;

    let { area: src, itemId } = actorData;

    const { area: dest = 'crew' } =
      target?.closest<HTMLElement>('[data-area]')?.dataset ?? {};

    if (!itemId) {
      itemId = target?.closest<HTMLElement>('[data-item-id]')?.dataset.itemId;
    }

    if (src === dest) {
      return;
    }

    const item = this.actor.items.get(itemId);

    if (item && (src === 'draft' || dest === 'draft')) {
      return this._onAssignCrew(actor, item, dest, { src });
    }

    return this._onAdjustCrew(actor, dest, { src });
  }

  _disableFields(...args: any[]) {
    debug('Ignoring call to disable fields. Delegating to Tidy Sheets...');
  }

  /* -------------------------------------------- */
  /*  Crew Management                             */
  /* -------------------------------------------- */

  /**
   * Handle adjusting a crew member's area or adding a new one.
   * @param {Actor5e} actor             The actor.
   * @param {CrewArea5e} dest           The destination area.
   * @param {object} [options]
   * @param {CrewArea5e} [options.src]  An optional area the crew member came from.
   * @protected
   */
  _onAdjustCrew(actor: Actor5e, dest: string, { src }: { src?: string } = {}) {
    const updates = {};
    if (src)
      Object.assign(
        updates,
        this.actor.system.getCrewUpdates(src, actor.uuid, '-1')
      );
    Object.assign(
      updates,
      this.actor.system.getCrewUpdates(dest, actor.uuid, '+1')
    );
    if (!foundry.utils.isEmpty(updates)) this.actor.update(updates);
  }

  /* -------------------------------------------- */

  /**
   * Handle assigning or unassigned a crew member to a station.
   */
  _onAssignCrew(
    actor: Actor5e,
    item: Item5e,
    dest: string,
    { src }: { src?: string } = {}
  ) {
    const itemUpdates = { _id: item.id };
    const actorUpdates = { items: [itemUpdates] };
    let crew = foundry.utils.getProperty(item, 'system.crew.value');

    // Case 1 - Assigning to a station.
    if (dest === 'draft') {
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

      this.actor.update(actorUpdates);
    }
    // Case 2 - Unassigning from a station.
    else {
      crew = [...crew];

      if (!crew.findSplice((u: string) => u === actor.uuid)) {
        return;
      }

      item.update({ 'system.crew.value': crew });
    }
  }

  /* -------------------------------------------- */
  /* SheetTabCacheable
  /* -------------------------------------------- */

  onTabSelected(tabId: string) {
    this.currentTabId = tabId;
  }

  /* -------------------------------------------- */
  /* SheetExpandedItemsCacheable
  /* -------------------------------------------- */

  onItemToggled(itemId: string, isVisible: boolean, location: string) {
    const locationSet = mapGetOrInsert(
      this.expandedItems,
      itemId,
      new Set<string>()
    );

    if (isVisible) {
      locationSet?.add(location);
    } else {
      locationSet?.delete(location);
    }

    debug('Item Toggled', {
      expandedItems: this.expandedItems,
    });
  }

  /* -------------------------------------------- */
  /* SearchFilterCacheable
  /* -------------------------------------------- */

  onSearch(location: string, text: string): void {
    debug('Searched', {
      location,
      text,
    });
    this.searchFilters.set(location, text);
  }
}
