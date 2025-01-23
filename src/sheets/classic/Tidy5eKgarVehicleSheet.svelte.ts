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
  MessageBus,
  SearchFilterCacheable,
  VehicleCargoSection,
  VehicleFeatureSection,
  SimpleEditableColumn,
  VehicleItemContext,
} from 'src/types/types';
import VehicleSheet from './vehicle/VehicleSheet.svelte';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import {
  applySheetAttributesToWindow,
  applyMutableSettingAttributesToWindow,
  applyTitleToWindow,
  blurUntabbableButtonsOnClick,
  maintainCustomContentInputFocus,
} from 'src/utils/applications.svelte';
import { mount, unmount } from 'svelte';
import { debug } from 'src/utils/logging';
import type { Item5e, ItemChatData } from 'src/types/item.types';
import { VehicleSheetRuntime } from 'src/runtime/VehicleSheetRuntime';
import {
  actorUsesActionFeature,
  getActorActionSections,
} from 'src/features/actions/actions.svelte';
import { isNil } from 'src/utils/data';
import { CustomContentRenderer } from '../CustomContentRenderer';
import { getBaseActorSheet5e } from 'src/utils/class-inheritance';
import { ActorPortraitRuntime } from 'src/runtime/ActorPortraitRuntime';
import { CustomActorTraitsRuntime } from 'src/runtime/actor-traits/CustomActorTraitsRuntime';
import { ItemTableToggleCacheService } from 'src/features/caching/ItemTableToggleCacheService';
import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import { ItemFilterService } from 'src/features/filtering/ItemFilterService.svelte';
import { AsyncMutex } from 'src/utils/mutex';
import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime.svelte';
import { Tidy5eBaseActorSheet } from './Tidy5eBaseActorSheet.svelte';
import { DocumentTabSectionConfigApplication } from 'src/applications/section-config/DocumentTabSectionConfigApplication.svelte';
import { SheetSections } from 'src/features/sections/SheetSections';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
import { Container } from 'src/features/containers/Container';
import { Activities } from 'src/features/activities/activities';
import type { Activity5e } from 'src/foundry/dnd5e.types';
import { CoarseReactivityProvider } from 'src/features/reactivity/CoarseReactivityProvider.svelte';
import AttachedInfoCard from 'src/components/info-card/AttachedInfoCard.svelte';
import { ExpansionTracker } from 'src/features/expand-collapse/ExpansionTracker.svelte';

export class Tidy5eVehicleSheet
  extends dnd5e.applications.actor.ActorSheet5eVehicle
  implements
    SheetTabCacheable,
    SheetExpandedItemsCacheable,
    SearchFilterCacheable
{
  context = new CoarseReactivityProvider<VehicleSheetContext | undefined>(
    undefined
  );
  stats = $state<SheetStats>({
    lastSubmissionTime: null,
  });
  currentTabId: string;
  expandedItems: ExpandedItemIdToLocationsMap = new Map<string, Set<string>>();
  expandedItemData: ExpandedItemData = new Map<string, ItemChatData>();
  inlineToggleService = new InlineToggleService();
  itemTableTogglesCache: ItemTableToggleCacheService;
  itemFilterService: ItemFilterService;
  messageBus = $state<MessageBus>({ message: undefined });
  sectionExpansionTracker = new ExpansionTracker(
    true,
    CONSTANTS.LOCATION_SECTION
  );

  constructor(...args: any[]) {
    super(...args);

    this.itemTableTogglesCache = new ItemTableToggleCacheService({
      userId: game.user.id,
      documentId: this.actor.id,
    });

    this.itemFilterService = new ItemFilterService({}, this.actor);

    this.currentTabId = settings.value.initialVehicleSheetTab;
  }

  get template() {
    return FoundryAdapter.getTemplate('empty-form-template.hbs');
  }

  static get defaultOptions() {
    const { width, height } =
      SheetPreferencesService.getByType(CONSTANTS.SHEET_TYPE_VEHICLE) ?? {};

    return FoundryAdapter.mergeObject(super.defaultOptions, {
      classes: [
        CONSTANTS.MODULE_ID,
        'sheet',
        'actor',
        CONSTANTS.SHEET_TYPE_VEHICLE,
        CONSTANTS.SHEET_LAYOUT_CLASSIC,
        'app-v1',
      ],
      width: width ?? 740,
      height: height ?? 810,
      scrollY: ['[data-tidy-track-scroll-y]', '.scroll-container'],
    });
  }

  component: Record<string, any> | undefined;
  additionalComponents: Record<string, any>[] = [];
  _effectCleanup?: () => void;
  activateListeners(html: { get: (index: 0) => HTMLElement }) {
    // Document Apps Reactivity
    game.user.apps[this.id] = this;

    // Sheet effects
    let first = true;

    this._effectCleanup = $effect.root(() => {
      $effect(() => {
        if (first) return;
        applyMutableSettingAttributesToWindow(
          settings.value,
          this.element.get(0)
        );
        this.render();
      });

      $effect(() => {
        debug('Message bus message received', {
          app: this,
          actor: this.actor,
          message: this.messageBus,
        });
      });
    });

    first = false;

    const node = html.get(0);

    this.component = mount(VehicleSheet, {
      target: node,
      context: new Map<any, any>([
        [CONSTANTS.SVELTE_CONTEXT.APP_ID, this.appId],
        [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this.context],
        [CONSTANTS.SVELTE_CONTEXT.MESSAGE_BUS, this.messageBus],
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
        [CONSTANTS.SVELTE_CONTEXT.CURRENT_TAB_ID, this.currentTabId],
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

    const infoCard = mount(AttachedInfoCard, {
      target: node,
      props: {
        sheet: this,
      },
    });

    this.additionalComponents.push(infoCard);

    initTidy5eContextMenu(this, html);

    FoundryAdapter.createContextMenu(html, '.activity[data-activity-id]', [], {
      onOpen: (element: HTMLElement) => {
        const itemId =
          element.closest<HTMLElement>('[data-item-id]')?.dataset.itemId;
        const item =
          this.document.type === 'container'
            ? this.document.system.getContainedItem(itemId)
            : this.document.items.get(itemId);
        // Parts of ContextMenu doesn't play well with promises, so don't show menus for containers in packs
        if (!item || item instanceof Promise) return;
        if (element.closest('[data-activity-id]')) {
          dnd5e.documents.activity.UtilityActivity.onContextMenu(item, element);
        }
      },
    });
  }

  async getData(options = {}) {
    const defaultDocumentContext = await super.getData(this.options);

    Tidy5eBaseActorSheet.applyCommonContext(defaultDocumentContext);

    const unlocked =
      FoundryAdapter.isSheetUnlocked(this.actor) &&
      defaultDocumentContext.editable;

    const vehiclePreferences = SheetPreferencesService.getByType(
      this.actor.type
    );

    const actionListSortMode =
      vehiclePreferences.tabs?.[CONSTANTS.TAB_ACTOR_ACTIONS]?.sort ?? 'm';

    const utilities: Utilities<VehicleSheetContext> = {
      [CONSTANTS.TAB_ACTOR_ACTIONS]: {
        utilityToolbarCommands: [
          {
            title: FoundryAdapter.localize('SIDEBAR.SortModeAlpha'),
            iconClass: 'fa-solid fa-arrow-down-a-z fa-fw',
            execute: async () => {
              await SheetPreferencesService.setDocumentTypeTabPreference(
                this.actor.type,
                CONSTANTS.TAB_ACTOR_ACTIONS,
                'sort',
                'm'
              );
            },
            visible: actionListSortMode === 'a',
          },
          {
            title: FoundryAdapter.localize('TIDY5E.SortMode.ActionListDefault'),
            iconClass: 'fa-solid fa-arrow-down-short-wide fa-fw',
            execute: async () => {
              await SheetPreferencesService.setDocumentTypeTabPreference(
                this.actor.type,
                CONSTANTS.TAB_ACTOR_ACTIONS,
                'sort',
                'a'
              );
            },
            visible: actionListSortMode === 'm',
          },
          {
            title: FoundryAdapter.localize('TIDY5E.Commands.ExpandAll'),
            iconClass: 'fas fa-angles-down',
            execute: () =>
              this.sectionExpansionTracker.setAll(
                CONSTANTS.TAB_ACTOR_ACTIONS,
                true
              ),
          },
          {
            title: FoundryAdapter.localize('TIDY5E.Commands.CollapseAll'),
            iconClass: 'fas fa-angles-up',
            execute: () =>
              this.sectionExpansionTracker.setAll(
                CONSTANTS.TAB_ACTOR_ACTIONS,
                false
              ),
          },
          {
            title: FoundryAdapter.localize(
              'TIDY5E.Utilities.ConfigureSections'
            ),
            iconClass: 'fas fa-cog',
            execute: ({ context, sections }) => {
              new DocumentTabSectionConfigApplication({
                document: context.actor,
                sections: sections,
                tabId: CONSTANTS.TAB_ACTOR_ACTIONS,
                tabTitle: VehicleSheetRuntime.getTabTitle(
                  CONSTANTS.TAB_ACTOR_ACTIONS
                ),
              }).render(true);
            },
          },
        ],
      },
    };

    const context: VehicleSheetContext = {
      ...defaultDocumentContext,
      actions: await getActorActionSections(this.actor),
      activateEditors: (node, options) =>
        FoundryAdapter.activateEditors(node, this, options?.bindSecrets),
      actorPortraitCommands:
        ActorPortraitRuntime.getEnabledPortraitMenuCommands(this.actor),
      allowEffectsManagement: true,
      appId: this.appId,
      customActorTraits: CustomActorTraitsRuntime.getEnabledTraits(
        defaultDocumentContext
      ),
      customContent: await VehicleSheetRuntime.getContent(
        defaultDocumentContext
      ),
      document: this.document,
      filterData: this.itemFilterService.getDocumentItemFilterData(),
      filterPins: ItemFilterRuntime.defaultFilterPins[this.actor.type],
      useClassicControls: settings.value.useClassicControlsForVehicle,
      editable: defaultDocumentContext.editable,
      healthPercentage: this.actor.system.attributes.hp.pct.toNearest(0.1),
      lockExpChanges: FoundryAdapter.shouldLockExpChanges(),
      lockHpMaxChanges: FoundryAdapter.shouldLockHpMaxChanges(),
      lockItemQuantity: FoundryAdapter.shouldLockItemQuantity(),
      lockLevelSelector: FoundryAdapter.shouldLockLevelSelector(),
      lockMoneyChanges: FoundryAdapter.shouldLockMoneyChanges(),
      lockSensitiveFields:
        (!unlocked && settings.value.useTotalSheetLock) ||
        !defaultDocumentContext.editable,
      modernRules: FoundryAdapter.checkIfModernRules(this.actor),
      owner: this.actor.isOwner,
      showLimitedSheet: FoundryAdapter.showLimitedSheet(this.actor),
      tabs: [],
      unlocked: unlocked,
      useActionsFeature: actorUsesActionFeature(this.actor),
      useRoundedPortraitStyle: [
        CONSTANTS.CIRCULAR_PORTRAIT_OPTION_ALL as string,
        CONSTANTS.CIRCULAR_PORTRAIT_OPTION_NPCVEHICLE as string,
      ].includes(settings.value.useCircularPortraitStyle),
      utilities: utilities,
      viewableWarnings:
        defaultDocumentContext.warnings?.filter(
          (w: any) => !isNil(w.message?.trim(), '')
        ) ?? [],
    };

    for (const item of context.items) {
      const ctx = context.itemContext[item.id];
      if (item.type === CONSTANTS.ITEM_TYPE_CONTAINER) {
        ctx.containerContents = await Container.getContainerContents(item);
      }
    }

    let tabs = await VehicleSheetRuntime.getTabs(context);

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

    debug('Vehicle Sheet context data', context);

    return context;
  }

  protected _prepareItems(context: VehicleSheetContext) {
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
      },
      equipment: {
        label: game.i18n.localize(CONFIG.Item.typeLabels.equipment),
        items: [],
        crewable: true,
        dataset: { type: 'equipment', 'system.type.value': 'vehicle' },
        columns: equipmentColumns,
        key: 'equipment',
        show: true,
      },
      passive: {
        label: game.i18n.localize('DND5E.Features'),
        items: [],
        dataset: { type: 'feat' },
        key: 'passive',
        show: true,
      },
      reactions: {
        label: game.i18n.localize('DND5E.ReactionPl'),
        items: [],
        dataset: { type: 'feat' },
        key: 'reactions',
        show: true,
      },
      weapons: {
        label: game.i18n.localize(`${CONFIG.Item.typeLabels.weapon}Pl`),
        items: [],
        crewable: true,
        dataset: { type: 'weapon', 'system.weaponType': 'siege' },
        columns: equipmentColumns,
        key: 'weapons',
        show: true,
      },
    };

    context.items.forEach((item) => {
      context.itemContext[item.id] ??= this._prepareItem(item, context);
    });

    const cargo: Record<string, VehicleCargoSection> = {
      crew: {
        label: game.i18n.localize('DND5E.VehicleCrew'),
        items: context.actor.system.cargo.crew,
        css: 'cargo-row crew',
        editableName: true,
        dataset: { type: 'crew' },
        columns: cargoColumns,
        key: 'crew',
        show: true,
      },
      passengers: {
        label: game.i18n.localize('DND5E.VehiclePassengers'),
        items: context.actor.system.cargo.passengers,
        css: 'cargo-row passengers',
        editableName: true,
        dataset: { type: 'passengers' },
        columns: cargoColumns,
        key: 'passengers',
        show: true,
      },
      cargo: {
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
        key: 'cargo',
        show: true,
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
    context.encumbrance = context.system.attributes.encumbrance;
  }

  _prepareItem(item: Item5e, context: VehicleSheetContext): VehicleItemContext {
    const { uses } = item.system;
    const ctx: VehicleItemContext = {};
    ctx.canToggle = false;
    ctx.hasUses = uses && uses.max > 0;
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
    if (item.type === 'feat' && item.system.activation.type === 'crew') {
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
    for (const id of this.expandedItems.keys()) {
      const item = this.actor.items.get(id);
      if (item) {
        this.expandedItemData.set(
          id,
          await item.getChatData({ secrets: this.actor.isOwner })
        );
      }
    }
  }

  /**
   * A boolean which gates double-rendering and prevents a second
   * colliding render from triggering an infamous
   * "One of original or other are not Objects!" error.
   */
  private tidyRendering = false;

  render(...args: unknown[]) {
    debug('Sheet render begin');
    this.tidyRendering = true;
    super.render(...args);
  }

  private _renderMutex = new AsyncMutex();
  async _render(force?: boolean, options = {}) {
    await this._renderMutex.lock(async () => {
      const doubleRenderDetected =
        this.options.token && this.tidyRendering === false;

      if (doubleRenderDetected) {
        return;
      }

      await this._renderSheet(force, options);
    });
    this.tidyRendering = false;
    debug('Sheet render end');
  }

  private async _renderSheet(force?: boolean, options = {}) {
    await this.setExpandedItemData();
    const data = await this.getData();
    SheetSections.accountForExternalSections(['features'], data);
    this.context.data = data;

    if (force) {
      const { width, height } =
        SheetPreferencesService.getByType(CONSTANTS.SHEET_TYPE_VEHICLE) ?? {};
      this.position = {
        ...this.position,
        width: width ?? this.position.width,
        height: height ?? this.position.height,
      };

      this._saveScrollPositions(this.element);
      this._destroySvelteComponent();
      await super._render(force, options);
      applySheetAttributesToWindow(
        this.actor.documentName,
        this.actor.uuid,
        this.actor.type,
        this.element.get(0)
      );
      await this.renderCustomContent({ data, isFullRender: true });
      TidyHooks.tidy5eSheetsRenderActorSheet(
        this,
        this.element.get(0),
        data,
        true
      );
      CustomContentRenderer.wireCompatibilityEventListeners(
        this.element,
        super.activateListeners,
        this
      );
      blurUntabbableButtonsOnClick(this.element.get(0));
      return;
    }

    await maintainCustomContentInputFocus(this, async () => {
      applyTitleToWindow(this.title, this.element.get(0));
      await this.renderCustomContent({ data, isFullRender: false });
      TidyHooks.tidy5eSheetsRenderActorSheet(
        this,
        this.element.get(0),
        data,
        false
      );
      CustomContentRenderer.wireCompatibilityEventListeners(
        this.element,
        super.activateListeners,
        this
      );
    });
  }

  private async renderCustomContent(args: {
    data: VehicleSheetContext;
    isFullRender: boolean;
  }) {
    await CustomContentRenderer.render({
      app: this,
      customContent: args.data.customContent,
      data: args.data,
      element: this.element,
      isFullRender: args.isFullRender,
      superActivateListeners: super.activateListeners,
      tabs: args.data.tabs,
    });
  }

  _getHeaderButtons() {
    const buttons = super._getHeaderButtons();
    return FoundryAdapter.removeConfigureSettingsButtonWhenLockedForNonGm(
      buttons
    );
  }

  _destroySvelteComponent() {
    if (this.component) {
      unmount(this.component);
    }
    this.component = undefined;

    this.additionalComponents.forEach((c) => unmount(c));
    this.additionalComponents = [];
  }

  _saveScrollPositions(html: any) {
    if (html.length && this.component) {
      const save = super._saveScrollPositions(html);
      debug('Saved scroll positions', this._scrollPositions);
      return save;
    }
  }

  async _onDropSingleItem(itemData: any, event: DragEvent) {
    const cargoTypes = [
      'weapon',
      'equipment',
      'consumable',
      'tool',
      'loot',
      'container',
    ];
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

    if (itemData.type === 'consumable') {
      return super._onDropSingleItem(itemData, event);
    }

    // Skip the default vehicle sheet handler, as we are handling all use cases.
    const baseActor5eClass = getBaseActorSheet5e(this);
    if (baseActor5eClass) {
      return baseActor5eClass._onDropSingleItem.call(this, itemData, event);
    }
  }

  close(options: unknown = {}) {
    this._effectCleanup?.();
    this._destroySvelteComponent();
    delete game.user.apps[this.id];
    return super.close(options);
  }

  async _onSubmit(...args: any[]) {
    await super._onSubmit(...args);
    this.stats.lastSubmissionTime = new Date();
  }

  _disableFields(...args: any[]) {
    debug('Ignoring call to disable fields. Delegating to Tidy Sheets...');
  }

  _onResize(event: any) {
    super._onResize(event);
    const { width, height } = this.position;
    SheetPreferencesService.setDocumentTypePreference(
      CONSTANTS.SHEET_TYPE_VEHICLE,
      'width',
      width
    );
    SheetPreferencesService.setDocumentTypePreference(
      CONSTANTS.SHEET_TYPE_VEHICLE,
      'height',
      height
    );
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
    const locationSet =
      this.expandedItems.get(itemId) ??
      this.expandedItems.set(itemId, new Set<string>()).get(itemId);

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
