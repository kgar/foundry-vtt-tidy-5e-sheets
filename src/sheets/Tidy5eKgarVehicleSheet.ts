import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { SettingsProvider, settingStore } from 'src/settings/settings';
import type {
  ItemCardStore,
  SheetExpandedItemsCacheable,
  SheetStats,
  SheetTabCacheable,
  ExpandedItemData,
  ExpandedItemIdToLocationsMap,
  VehicleSheetContext,
  Utilities,
  MessageBus,
  MessageBusMessage,
  SearchFilterCacheable,
} from 'src/types/types';
import { writable } from 'svelte/store';
import VehicleSheet from './vehicle/VehicleSheet.svelte';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import {
  applySheetAttributesToWindow,
  applyTitleToWindow,
  blurUntabbableButtonsOnClick,
  maintainCustomContentInputFocus,
} from 'src/utils/applications';
import type { SvelteComponent } from 'svelte';
import { debug } from 'src/utils/logging';
import { getPercentage } from 'src/utils/numbers';
import type { ItemChatData } from 'src/types/item';
import { VehicleSheetRuntime } from 'src/runtime/VehicleSheetRuntime';
import {
  actorUsesActionFeature,
  getActorActions,
} from 'src/features/actions/actions';
import { isNil } from 'src/utils/data';
import { CustomContentRenderer } from './CustomContentRenderer';
import { getBaseActorSheet5e } from 'src/utils/class-inheritance';
import { ActorPortraitRuntime } from 'src/runtime/ActorPortraitRuntime';
import { CustomActorTraitsRuntime } from 'src/runtime/actor-traits/CustomActorTraitsRuntime';
import { ItemTableToggleCacheService } from 'src/features/caching/ItemTableToggleCacheService';
import { StoreSubscriptionsService } from 'src/features/store/StoreSubscriptionsService';
import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import { ItemFilterService } from 'src/features/filtering/ItemFilterService';
import { AsyncMutex } from 'src/utils/mutex';

export class Tidy5eVehicleSheet
  extends dnd5e.applications.actor.ActorSheet5eVehicle
  implements
    SheetTabCacheable,
    SheetExpandedItemsCacheable,
    SearchFilterCacheable
{
  context = writable<VehicleSheetContext>();
  stats = writable<SheetStats>({
    lastSubmissionTime: null,
  });
  card = writable<ItemCardStore>();
  currentTabId: string;
  expandedItems: ExpandedItemIdToLocationsMap = new Map<string, Set<string>>();
  expandedItemData: ExpandedItemData = new Map<string, ItemChatData>();
  itemTableTogglesCache: ItemTableToggleCacheService;
  subscriptionsService: StoreSubscriptionsService;
  itemFilterService: ItemFilterService;
  messageBus: MessageBus = writable<MessageBusMessage | undefined>();

  constructor(...args: any[]) {
    super(...args);

    this.subscriptionsService = new StoreSubscriptionsService();

    this.itemTableTogglesCache = new ItemTableToggleCacheService({
      userId: game.user.id,
      documentId: this.actor.id,
    });

    this.itemFilterService = new ItemFilterService({}, this.actor);

    this.currentTabId = SettingsProvider.settings.initialVehicleSheetTab.get();
  }

  get template() {
    return FoundryAdapter.getTemplate('empty-form-template.hbs');
  }

  static get defaultOptions() {
    const { width, height } =
      SheetPreferencesService.getByType(CONSTANTS.SHEET_TYPE_VEHICLE) ?? {};

    return FoundryAdapter.mergeObject(super.defaultOptions, {
      classes: ['tidy5e-sheet', 'sheet', 'actor', CONSTANTS.SHEET_TYPE_VEHICLE],
      width: width ?? 740,
      height: height ?? 810,
      scrollY: ['[data-tidy-track-scroll-y]', '.scroll-container'],
    });
  }

  component: SvelteComponent | undefined;
  activateListeners(html: { get: (index: 0) => HTMLElement }) {
    let first = true;
    this.subscriptionsService.registerSubscriptions(
      this.itemFilterService.filterData$.subscribe(() => {
        if (first) return;
        this.render();
      }),
      settingStore.subscribe(() => {
        if (first) return;
        this.render();
      }),
      this.messageBus.subscribe((m) => {
        debug('Message bus message received', {
          app: this,
          actor: this.actor,
          message: m,
        });
      })
    );
    first = false;

    const node = html.get(0);
    this.card.set({ sheet: node, item: null, itemCardContentTemplate: null });

    this.component = new VehicleSheet({
      target: node,
      context: new Map<any, any>([
        ['context', this.context],
        ['messageBus', this.messageBus],
        ['stats', this.stats],
        ['card', this.card],
        [
          'onFilter',
          this.itemFilterService.onFilter.bind(this.itemFilterService),
        ],
        [
          'onFilterClearAll',
          this.itemFilterService.onFilterClearAll.bind(this.itemFilterService),
        ],
        ['currentTabId', this.currentTabId],
        ['onTabSelected', this.onTabSelected.bind(this)],
        ['onItemToggled', this.onItemToggled.bind(this)],
        ['location', ''],
        ['expandedItems', new Map(this.expandedItems)],
        ['expandedItemData', new Map(this.expandedItemData)],
        [
          'itemTableToggles',
          new Map(this.itemTableTogglesCache.itemTableToggles),
        ],
        [
          'onItemTableToggle',
          this.itemTableTogglesCache.onItemTableToggle.bind(
            this.itemTableTogglesCache
          ),
        ],
      ]),
    });

    initTidy5eContextMenu(this, html);
  }

  async getData(options = {}) {
    const defaultDocumentContext = await super.getData(this.options);

    const unlocked =
      FoundryAdapter.isActorSheetUnlocked(this.actor) &&
      defaultDocumentContext.editable;

    const vehiclePreferences = SheetPreferencesService.getByType(
      this.actor.type
    );

    const actionListSortMode =
      vehiclePreferences.tabs?.[CONSTANTS.TAB_ACTOR_ACTIONS]?.sort ?? 'm';

    const utilities: Utilities = {
      [CONSTANTS.TAB_ACTOR_ACTIONS]: {
        utilityToolbarCommands: [
          {
            title: FoundryAdapter.localize('SIDEBAR.SortModeAlpha'),
            iconClass: 'fa-solid fa-arrow-down-a-z',
            execute: async () => {
              await SheetPreferencesService.setActorTypeTabPreference(
                this.actor.type,
                CONSTANTS.TAB_ACTOR_ACTIONS,
                'sort',
                'm'
              );
              this.render();
            },
            visible: actionListSortMode === 'a',
          },
          {
            title: FoundryAdapter.localize('TIDY5E.SortMode.ActionListDefault'),
            iconClass: 'fa-solid fa-arrow-down-short-wide',
            execute: async () => {
              await SheetPreferencesService.setActorTypeTabPreference(
                this.actor.type,
                CONSTANTS.TAB_ACTOR_ACTIONS,
                'sort',
                'a'
              );
              this.render();
            },
            visible: actionListSortMode === 'm',
          },
          {
            title: FoundryAdapter.localize('TIDY5E.Commands.ExpandAll'),
            iconClass: 'fas fa-angles-down',
            execute: () =>
              // TODO: Use app.messageBus
              this.messageBus.set({
                tabId: CONSTANTS.TAB_ACTOR_ACTIONS,
                message: CONSTANTS.MESSAGE_BUS_EXPAND_ALL,
              }),
          },
          {
            title: FoundryAdapter.localize('TIDY5E.Commands.CollapseAll'),
            iconClass: 'fas fa-angles-up',
            execute: () =>
              // TODO: Use app.messageBus
              this.messageBus.set({
                tabId: CONSTANTS.TAB_ACTOR_ACTIONS,
                message: CONSTANTS.MESSAGE_BUS_COLLAPSE_ALL,
              }),
          },
        ],
      },
    };

    const context = {
      ...defaultDocumentContext,
      actions: getActorActions(this.actor, this.itemFilterService),
      activateFoundryJQueryListeners: (node: HTMLElement) => {
        this._activateCoreListeners($(node));
        getBaseActorSheet5e(this).activateListeners.call(this, $(node));
      },
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
      filterData: this.itemFilterService.getActorItemFilterData(),
      useClassicControls:
        SettingsProvider.settings.useClassicControlsForVehicle.get(),
      editable: defaultDocumentContext.editable,
      healthPercentage: getPercentage(
        this.actor?.system?.attributes?.hp?.value,
        this.actor?.system?.attributes?.hp?.max
      ),
      lockExpChanges: FoundryAdapter.shouldLockExpChanges(),
      lockHpMaxChanges: FoundryAdapter.shouldLockHpMaxChanges(),
      lockItemQuantity: FoundryAdapter.shouldLockItemQuantity(),
      lockLevelSelector: FoundryAdapter.shouldLockLevelSelector(),
      lockMoneyChanges: FoundryAdapter.shouldLockMoneyChanges(),
      lockSensitiveFields:
        (!unlocked && SettingsProvider.settings.useTotalSheetLock.get()) ||
        !defaultDocumentContext.editable,
      owner: this.actor.isOwner,
      showLimitedSheet: FoundryAdapter.showLimitedSheet(this.actor),
      tabs: [],
      unlocked: unlocked,
      useActionsFeature: actorUsesActionFeature(this.actor),
      useRoundedPortraitStyle: [
        CONSTANTS.CIRCULAR_PORTRAIT_OPTION_ALL as string,
        CONSTANTS.CIRCULAR_PORTRAIT_OPTION_NPCVEHICLE as string,
      ].includes(SettingsProvider.settings.useCircularPortraitStyle.get()),
      utilities: utilities,
      viewableWarnings:
        defaultDocumentContext.warnings?.filter(
          (w: any) => !isNil(w.message?.trim(), '')
        ) ?? [],
    };

    let tabs = await VehicleSheetRuntime.getTabs(context);

    const selectedTabs = FoundryAdapter.tryGetFlag<string[]>(
      context.actor,
      'selected-tabs'
    );

    if (selectedTabs?.length) {
      tabs = tabs
        .filter((t) => selectedTabs?.includes(t.id))
        .sort(
          (a, b) => selectedTabs.indexOf(a.id) - selectedTabs.indexOf(b.id)
        );
    } else {
      const defaultTabs =
        SettingsProvider.settings.defaultVehicleSheetTabs.get();
      tabs = tabs
        .filter((t) => defaultTabs?.includes(t.id))
        .sort((a, b) => defaultTabs.indexOf(a.id) - defaultTabs.indexOf(b.id));
    }

    context.tabs = tabs;

    debug('Vehicle Sheet context data', context);

    return context;
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

  private _renderMutex = new AsyncMutex();
  async _render(force?: boolean, options = {}) {
    await this._renderMutex.lock(async () => {
      await this._renderSheet(force, options);
    });
  }

  private async _renderSheet(force?: boolean, options = {}) {
    await this.setExpandedItemData();
    const data = await this.getData();
    this.context.set(data);

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
        this.actor.type,
        SettingsProvider.settings.colorScheme.get(),
        this.element.get(0)
      );
      await this.renderCustomContent({ data, isFullRender: true });
      Hooks.callAll(
        'tidy5e-sheet.renderActorSheet',
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
      blurUntabbableButtonsOnClick(this.element);
      return;
    }

    await maintainCustomContentInputFocus(this, async () => {
      applyTitleToWindow(this.title, this.element.get(0));
      await this.renderCustomContent({ data, isFullRender: false });
      Hooks.callAll(
        'tidy5e-sheet.renderActorSheet',
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
    this.component?.$destroy();
    this.component = undefined;
  }

  _saveScrollPositions(html: any) {
    if (html.length && this.component) {
      const save = super._saveScrollPositions(html);
      debug('Saved scroll positions', this._scrollPositions);
      return save;
    }
  }

  async _onDropSingleItem(itemData: any) {
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
      const scroll = await dnd5e.documents.Item5e.createScrollFromSpell(
        itemData
      );
      return scroll.toObject();
    }

    if (itemData.type === 'consumable') {
      return super._onDropSingleItem(itemData);
    }

    // Skip the default vehicle sheet handler, as we are handling all use cases.
    const baseActor5eClass = getBaseActorSheet5e(this);
    if (baseActor5eClass) {
      return baseActor5eClass._onDropSingleItem.call(this, itemData);
    }
  }

  close(options: unknown = {}) {
    this._destroySvelteComponent();
    this.subscriptionsService.unsubscribeAll();
    return super.close(options);
  }

  async _onSubmit(...args: any[]) {
    await super._onSubmit(...args);
    this.stats.update((stats) => {
      stats.lastSubmissionTime = new Date();
      return stats;
    });
  }

  _disableFields(...args: any[]) {
    debug('Ignoring call to disable fields. Delegating to Tidy Sheets...');
  }

  _onResize(event: any) {
    super._onResize(event);
    const { width, height } = this.position;
    SheetPreferencesService.setActorTypePreference(
      CONSTANTS.SHEET_TYPE_VEHICLE,
      'width',
      width
    );
    SheetPreferencesService.setActorTypePreference(
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
