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
  VehicleCargoSection,
  VehicleFeatureSection,
  SimpleEditableColumn,
  VehicleItemContext,
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
      cargo: [],
      features: [],
      useActionsFeature: actorUsesActionFeature(this.actor),
      utilities: utilities,
      ...defaultDocumentContext,
    };

    context.filterData = this.itemFilterService.getFilterData();
    context.filterPins = ItemFilterRuntime.defaultFilterPins[this.actor.type];

    context.useClassicControls = settings.value.useClassicControlsForVehicle;

    context.customActorTraits = CustomActorTraitsRuntime.getEnabledTraitsLegacy({
      context,
      app: this,
      element: this.element,
    });

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
    SheetSections.accountForExternalSections(['features'], context);

    debug('Vehicle Sheet context data', context);

    return context;
  }

  _prepareItems(context: VehicleSheetContext) {
    // TODO: Replace with Tidy Column Selection implementation
    const cargoColumns: SimpleEditableColumn[] = [
      {
        label: game.i18n.localize('DND5E.Quantity'),
        css: 'item-qty',
        property: 'quantity',
        editable: 'Number',
      },
    ];

    // TODO: Replace with Tidy Column Selection implementation
    const equipmentColumns: SimpleEditableColumn[] = [
      {
        label: game.i18n.localize('DND5E.Quantity'),
        css: 'item-qty',
        property: 'system.quantity',
        editable: 'Number',
      },
      {
        label: game.i18n.localize('DND5E.AC'),
        css: 'item-ac',
        property: 'system.armor.value',
      },
      {
        label: game.i18n.localize('DND5E.HP'),
        css: 'item-hp',
        property: 'system.hp.value',
        maxProperty: 'system.hp.max',
        editable: 'Number',
      },
      {
        label: game.i18n.localize('DND5E.Threshold'),
        css: 'item-threshold',
        property: 'threshold',
      },
    ];

    const features: Record<string, VehicleFeatureSection> = {
      actions: {
        type: CONSTANTS.SECTION_TYPE_FEATURE,
        label: game.i18n.localize('DND5E.ActionPl'),
        items: [],
        hasActions: true,
        crewable: true,
        key: 'actions',
        dataset: { type: 'feat' },
        columns: [
          {
            label: game.i18n.localize('DND5E.Cover'),
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
        label: game.i18n.localize(CONFIG.Item.typeLabels.equipment),
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
        label: game.i18n.localize('DND5E.Features'),
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
        label: game.i18n.localize('DND5E.ReactionPl'),
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
        label: game.i18n.localize(`${CONFIG.Item.typeLabels.weapon}Pl`),
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
      context.itemContext[item.id] ??= this._prepareItem(item, context);
    });

    const cargo: Record<string, VehicleCargoSection> = {
      crew: {
        type: CONSTANTS.SECTION_TYPE_CARGO,
        label: game.i18n.localize('DND5E.VehicleCrew'),
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
        label: game.i18n.localize('DND5E.VehiclePassengers'),
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
        label: game.i18n.localize('DND5E.VehicleCargo'),
        items: [],
        dataset: { type: 'loot' },
        columns: [
          {
            label: game.i18n.localize('DND5E.Quantity'),
            css: 'item-qty',
            property: 'system.quantity',
            editable: 'Number',
          },
          {
            label: game.i18n.localize('DND5E.Price'),
            css: 'item-price',
            property: 'system.price.value',
            editable: 'Number',
          },
          {
            label: game.i18n.localize('DND5E.Weight'),
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

  _prepareItem(item: Item5e, context: VehicleSheetContext): VehicleItemContext {
    const { uses } = item.system;
    const ctx: VehicleItemContext = {};
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
      this.currentTabId === CONSTANTS.TAB_VEHICLE_CARGO_AND_CREW;
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

  _disableFields(...args: any[]) {
    debug('Ignoring call to disable fields. Delegating to Tidy Sheets...');
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
