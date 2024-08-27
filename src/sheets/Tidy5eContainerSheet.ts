import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type {
  ContainerSheetContext,
  ItemChatData,
  ItemDescription,
} from 'src/types/item.types';
import type {
  ExpandedItemData,
  ExpandedItemIdToLocationsMap,
  ItemCardStore,
  LocationToSearchTextMap,
  MessageBus,
  MessageBusMessage,
  SearchFilterCacheable,
  SheetExpandedItemsCacheable,
  SheetStats,
  SheetTabCacheable,
  Tab,
  Utilities,
} from 'src/types/types';
import { debug } from 'src/utils/logging';
import { get, writable } from 'svelte/store';
import { CustomContentRenderer } from './CustomContentRenderer';
import {
  applySheetAttributesToWindow,
  applyThemeDataAttributeToWindow,
  applyTitleToWindow,
  maintainCustomContentInputFocus,
} from 'src/utils/applications';
import { SettingsProvider, settingStore } from 'src/settings/settings';
import { ItemSheetRuntime } from 'src/runtime/item/ItemSheetRuntime';
import { TabManager } from 'src/runtime/tab/TabManager';
import { isNil } from 'src/utils/data';
import type { SvelteComponent } from 'svelte';
import ContainerSheet from './item/ContainerSheet.svelte';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import { ItemFilterService } from 'src/features/filtering/ItemFilterService';
import { StoreSubscriptionsService } from 'src/features/store/StoreSubscriptionsService';
import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import { CONSTANTS } from 'src/constants';
import { AsyncMutex } from 'src/utils/mutex';
import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime';
import { DocumentTabSectionConfigApplication } from 'src/applications/section-config/DocumentTabSectionConfigApplication';
import type { CharacterFavorite } from 'src/foundry/dnd5e.types';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { InlineContainerToggleService } from 'src/features/containers/InlineContainerToggleService';
import { Container } from 'src/features/containers/Container';
import { BaseSheetCustomSectionMixin } from './mixins/BaseSheetCustomSectionMixin';

export class Tidy5eKgarContainerSheet
  extends BaseSheetCustomSectionMixin(
    (object) => object.system.contents,
    dnd5e.applications.item.ContainerSheet
  )
  implements
    SheetTabCacheable,
    SheetExpandedItemsCacheable,
    SearchFilterCacheable
{
  context = writable<ContainerSheetContext>();
  stats = writable<SheetStats>({
    lastSubmissionTime: null,
  });
  currentTabId: string | undefined = undefined;
  searchFilters: LocationToSearchTextMap = new Map<string, string>();
  expandedItems: ExpandedItemIdToLocationsMap = new Map<string, Set<string>>();
  expandedItemData: ExpandedItemData = new Map<string, ItemChatData>();
  inlineContainerToggleService = new InlineContainerToggleService();
  card = writable<ItemCardStore>();
  itemFilterService: ItemFilterService;
  subscriptionsService: StoreSubscriptionsService;
  messageBus: MessageBus = writable<MessageBusMessage | undefined>();

  constructor(...args: any[]) {
    super(...args);

    this.subscriptionsService = new StoreSubscriptionsService();

    this.itemFilterService = new ItemFilterService({}, this.item);
  }

  get template() {
    return FoundryAdapter.getTemplate('empty-form-template-for-items.hbs');
  }

  static get defaultOptions() {
    return FoundryAdapter.mergeObject(super.defaultOptions, {
      classes: [
        CONSTANTS.MODULE_ID,
        'sheet',
        'item',
        'container',
        'app-v1',
        CONSTANTS.SHEET_LAYOUT_CLASSIC,
      ],
    });
  }

  component: SvelteComponent | undefined;
  activateListeners(html: any) {
    let first = true;
    this.subscriptionsService.unsubscribeAll();
    this.subscriptionsService.registerSubscriptions(
      this.itemFilterService.filterData$.subscribe(() => {
        if (first) return;
        this.render();
      }),
      settingStore.subscribe((s) => {
        if (first) return;
        applyThemeDataAttributeToWindow(s.colorScheme, this.element.get(0));
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

    const context = new Map<any, any>([
      [CONSTANTS.SVELTE_CONTEXT.APP_ID, this.appId],
      [CONSTANTS.SVELTE_CONTEXT.CARD, this.card],
      [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this.context],
      [CONSTANTS.SVELTE_CONTEXT.CURRENT_TAB_ID, this.currentTabId],
      [CONSTANTS.SVELTE_CONTEXT.EXPANDED_ITEMS, new Map(this.expandedItems)],
      [
        CONSTANTS.SVELTE_CONTEXT.EXPANDED_ITEM_DATA,
        new Map(this.expandedItemData),
      ],
      [CONSTANTS.SVELTE_CONTEXT.MESSAGE_BUS, this.messageBus],
      [
        CONSTANTS.SVELTE_CONTEXT.INLINE_CONTAINER_TOGGLE_SERVICE,
        this.inlineContainerToggleService,
      ],
      [
        CONSTANTS.SVELTE_CONTEXT.ON_FILTER,
        this.itemFilterService.onFilter.bind(this.itemFilterService),
      ],
      [
        CONSTANTS.SVELTE_CONTEXT.ON_FILTER_CLEAR_ALL,
        this.itemFilterService.onFilterClearAll.bind(this.itemFilterService),
      ],
      [CONSTANTS.SVELTE_CONTEXT.ON_ITEM_TOGGLED, this.onItemToggled.bind(this)],
      [CONSTANTS.SVELTE_CONTEXT.ON_SEARCH, this.onSearch.bind(this)],
      [CONSTANTS.SVELTE_CONTEXT.ON_TAB_SELECTED, this.onTabSelected.bind(this)],
      [CONSTANTS.SVELTE_CONTEXT.SEARCH_FILTERS, new Map(this.searchFilters)],
      [CONSTANTS.SVELTE_CONTEXT.STATS, this.stats],
    ]);

    this.component = new ContainerSheet({
      target: node,
      context: context,
    });

    initTidy5eContextMenu(this, html);
  }

  async getData(options = {}) {
    const defaultDocumentContext = await super.getData(this.options);

    this.item.actor?.system?.favorites?.forEach((f: CharacterFavorite) => {
      const item = fromUuidSync(f.id, { relative: this.item.actor });

      if (!item) {
        return;
      }

      const ctx = defaultDocumentContext.itemContext[item.id];

      if (ctx) {
        ctx.favoriteId = f.id;
      }
    });

    const itemDescriptions: ItemDescription[] = [];

    itemDescriptions.push({
      content: defaultDocumentContext.enriched.description,
      field: 'system.description.value',
      label: FoundryAdapter.localize('DND5E.Description'),
    });

    if (defaultDocumentContext.isIdentifiable && FoundryAdapter.userIsGm()) {
      itemDescriptions.push({
        content: defaultDocumentContext.enriched.unidentified,
        field: 'system.unidentified.description',
        label: FoundryAdapter.localize('DND5E.DescriptionUnidentified'),
      });
    }

    itemDescriptions.push({
      content: defaultDocumentContext.enriched.chat,
      field: 'system.description.chat',
      label: FoundryAdapter.localize('DND5E.DescriptionChat'),
    });

    const eligibleCustomTabs = ItemSheetRuntime.getCustomItemTabs(
      defaultDocumentContext
    );

    const customTabs: Tab[] = await TabManager.prepareTabsForRender(
      defaultDocumentContext,
      eligibleCustomTabs
    );

    const tabs = ItemSheetRuntime.sheets[this.item.type]?.defaultTabs() ?? [];

    tabs.push(...customTabs);

    const containerPreferences = SheetPreferencesService.getByType(
      this.item.type
    );

    const contentsSortMode =
      containerPreferences.tabs?.[CONSTANTS.TAB_CONTAINER_CONTENTS]?.sort ??
      'm';

    // Utilities
    let utilities: Utilities<ContainerSheetContext> = {
      [CONSTANTS.TAB_CONTAINER_CONTENTS]: {
        utilityToolbarCommands: [
          {
            title: FoundryAdapter.localize('SIDEBAR.SortModeAlpha'),
            iconClass: 'fa-solid fa-arrow-down-a-z fa-fw',
            execute: async () => {
              await SheetPreferencesService.setDocumentTypeTabPreference(
                this.item.type,
                CONSTANTS.TAB_CONTAINER_CONTENTS,
                'sort',
                'm'
              );
              this.render();
            },
            visible: contentsSortMode === 'a',
          },
          {
            title: FoundryAdapter.localize('SIDEBAR.SortModeManual'),
            iconClass: 'fa-solid fa-arrow-down-short-wide fa-fw',
            execute: async () => {
              await SheetPreferencesService.setDocumentTypeTabPreference(
                this.item.type,
                CONSTANTS.TAB_CONTAINER_CONTENTS,
                'sort',
                'a'
              );
              this.render();
            },
            visible: contentsSortMode === 'm',
          },
          {
            title: FoundryAdapter.localize(
              'TIDY5E.Utilities.ConfigureSections'
            ),
            iconClass: 'fas fa-cog',
            execute: ({ context }) => {
              new DocumentTabSectionConfigApplication({
                document: context.item,
                // Provide a way to build the necessary config, perhaps within the application constructor. We've got all the info we need in order to perform the operation.
                sections: context.containerContents.contents,
                tabId: CONSTANTS.TAB_CONTAINER_CONTENTS,
                tabTitle: ItemSheetRuntime.getTabTitle(
                  CONSTANTS.TAB_CONTAINER_CONTENTS
                ),
              }).render(true);
            },
          },
        ],
      },
    };

    // Context Data
    const context: ContainerSheetContext = {
      ...defaultDocumentContext,
      appId: this.appId,
      activateEditors: (node, options) =>
        FoundryAdapter.activateEditors(node, this, options?.bindSecrets),
      containerContents: await Container.getContainerContents(this.item),
      customContent: await ItemSheetRuntime.getContent(defaultDocumentContext),
      filterData: this.itemFilterService.getDocumentItemFilterData(),
      filterPins: ItemFilterRuntime.defaultFilterPins[this.item.type],
      identifiedName: FoundryAdapter.getIdentifiedName(this.item),
      itemDescriptions,
      itemOverrides: new Set<string>(this._getItemOverrides()),
      lockItemQuantity: FoundryAdapter.shouldLockItemQuantity(),
      originalContext: defaultDocumentContext,
      tabs: tabs,
      utilities: utilities,
      viewableWarnings:
        defaultDocumentContext.warnings?.filter(
          (w: any) => !isNil(w.message?.trim(), '')
        ) ?? [],
    };

    const contents = await this.item.system.contents;

    for (const item of contents) {
      if (item.type === CONSTANTS.ITEM_TYPE_CONTAINER) {
        const ctx = context.itemContext[item.id];
        ctx.containerContents = await Container.getContainerContents(item);
      }
    }

    TidyHooks.tidy5eSheetsPreConfigureSections(
      this,
      this.element.get(0),
      context
    );

    debug(`Container Sheet context data`, context);

    return context;
  }

  private async setExpandedItemData() {
    this.expandedItemData.clear();
    const contents = await this.item.system.contents;

    for (const id of this.expandedItems.keys()) {
      const item = contents.get(id);
      if (item) {
        this.expandedItemData.set(
          id,
          await item.getChatData({ secrets: this.item.isOwner })
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
    this.context.set(data);

    if (force) {
      this.component?.$destroy();
      await super._render(force, options);
      applySheetAttributesToWindow(
        this.item.documentName,
        this.item.type,
        SettingsProvider.settings.colorScheme.get(),
        this.element.get(0)
      );
      await this.renderCustomContent({ data, isFullRender: true });
      TidyHooks.tidy5eSheetsRenderItemSheet(
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
      return;
    }

    maintainCustomContentInputFocus(this, async () => {
      applyTitleToWindow(this.title, this.element.get(0));
      await this.renderCustomContent({ data, isFullRender: false });
      TidyHooks.tidy5eSheetsRenderItemSheet(
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
    data: ContainerSheetContext;
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

  async _onSubmit(...args: any[]) {
    await super._onSubmit(...args);

    // TODO: Figure out why multiple render calls is trashing the prose editor.
    // This setTimeout() is making it so the item prose editors don't go nonresponsive.
    // I think it may have something to do with Save -> Trigger Component Refresh (onSubmit) -> Render -> Trash Prose Editor HTML -> Render again
    setTimeout(() => {
      this.stats.update((stats) => {
        stats.lastSubmissionTime = new Date();
        return stats;
      });
    });
  }

  close(...args: any[]) {
    try {
      this._saveViewState();
    } catch (e) {
      debug(
        `Unable to save view state for ${Tidy5eKgarContainerSheet.name}. Ignoring.`
      );
    } finally {
      this.component?.$destroy();
      this.subscriptionsService.unsubscribeAll();
      return super.close(...args);
    }
  }

  async _onDropSingleItem(...args: any[]) {
    return super._onDropSingleItem(...args);
  }

  _getHeaderButtons() {
    const buttons = super._getHeaderButtons();

    return FoundryAdapter.removeConfigureSettingsButtonWhenLockedForNonGm(
      buttons
    );
  }

  _disableFields(...args: any[]) {
    debug('Ignoring call to disable fields. Delegating to Tidy Sheets...');
  }

  /* -------------------------------------------- */
  /* SheetTabCacheable
  /* -------------------------------------------- */

  onTabSelected(tabId: string) {
    this.currentTabId = tabId;
    const tabs = get(this.context)?.tabs ?? [];
    setTimeout(() => {
      this._handleAutoHeightTabs(tabs);
    });
  }

  private _handleAutoHeightTabs(tabs: Tab[]) {
    const currentTabSettings = tabs.find((t) => t.id === this.currentTabId);
    if (currentTabSettings?.autoHeight) {
      this._saveScrollPositions(this.element);
      this.setPosition({ height: 'auto' });
    }
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
