import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type {
  ContainerItemContext,
  ContainerSection,
  ContainerSheetContext,
  Item5e,
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
import { debug, error } from 'src/utils/logging';
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
import { ContainerSheetSections } from 'src/features/sections/ContainerSheetSections';
import { SheetSections } from 'src/features/sections/SheetSections';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { Inventory } from 'src/features/sections/Inventory';
import type { CharacterFavorite } from 'src/foundry/dnd5e.types';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { Container } from 'src/features/sections/Container';
import { InlineContainerService } from 'src/features/inline-container/InlineContainerService';

export class Tidy5eKgarContainerSheet
  extends dnd5e.applications.item.ItemSheet5e
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
  card = writable<ItemCardStore>();
  inlineContainerService = new InlineContainerService();
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
      classes: ['tidy5e-sheet', 'sheet', 'item', 'container'],
    });
  }

  component: SvelteComponent | undefined;
  activateListeners(html: any) {
    let first = true;
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
      ['card', this.card],
      ['context', this.context],
      ['currentTabId', this.currentTabId],
      ['expandedItems', new Map(this.expandedItems)],
      ['expandedItemData', new Map(this.expandedItemData)],
      ['messageBus', this.messageBus],
      ['inlineContainerService', this.inlineContainerService],
      [
        'onFilter',
        this.itemFilterService.onFilter.bind(this.itemFilterService),
      ],
      [
        'onFilterClearAll',
        this.itemFilterService.onFilterClearAll.bind(this.itemFilterService),
      ],
      ['onItemToggled', this.onItemToggled.bind(this)],
      ['onSearch', this.onSearch.bind(this)],
      ['onTabSelected', this.onTabSelected.bind(this)],
      ['searchFilters', new Map(this.searchFilters)],

      ['stats', this.stats],
    ]);

    this.component = new ContainerSheet({
      target: node,
      context: context,
    });

    initTidy5eContextMenu(this, html);
  }

  async getData(options = {}) {
    const defaultDocumentContext = await super.getData(options);

    defaultDocumentContext.items = Array.from(await this.item.system.contents);
    defaultDocumentContext.capacity = await this.item.system.computeCapacity();
    defaultDocumentContext.itemContext = {};

    for (const item of defaultDocumentContext.items) {
      const ctx = (defaultDocumentContext.itemContext[item.id] ??= {});
      ctx.totalWeight = (await item.system.totalWeight).toNearest(0.1);
      ctx.isStack = item.system.quantity > 1;
      (ctx.attunement = FoundryAdapter.getAttunementContext(item)),
        (ctx.containerContents =
          item.type === CONSTANTS.SHEET_TYPE_CONTAINER
            ? Container.getContainerContents(item)
            : undefined);
    }

    defaultDocumentContext.isContainer = true;
    defaultDocumentContext.inventory = {
      contents: {
        label: 'DND5E.Contents',
        items: defaultDocumentContext.items,
      },
    };

    defaultDocumentContext.items = defaultDocumentContext.items.sort(
      (a, b) => (a.sort || 0) - (b.sort || 0)
    );

    this.item.actor?.system?.favorites?.forEach((f: CharacterFavorite) => {
      const item = fromUuidSync(f.id, { relative: this.item.actor });
      const ctx = defaultDocumentContext.itemContext[item.id];
      if (ctx) {
        ctx.favoriteId = f.id;
      }
    });

    // Backfill required section data
    Object.assign(defaultDocumentContext.inventory.contents, {
      show: true,
      key: CONSTANTS.TAB_CONTAINER_SECTION_CONTENTS,
    });

    const containerPreferences = SheetPreferencesService.getByType(
      this.item.type
    );

    const contentsSortMode =
      containerPreferences.tabs?.[CONSTANTS.TAB_CONTAINER_CONTENTS]?.sort ??
      'm';

    try {
      // TODO: When I fully take over section preparation, move this filter() step higher up so that it is not looping in individual sections
      let contents = this.itemFilterService.filter(
        defaultDocumentContext.inventory.contents.items,
        CONSTANTS.TAB_CONTAINER_CONTENTS
      );
      if (contentsSortMode === 'a') {
        contents = contents.toSorted((a, b) => a.name.localeCompare(b.name));
      }
      defaultDocumentContext.inventory.contents.items = contents;
    } catch (e) {
      error(
        'An error occurred while sorting and filtering section data',
        false,
        e
      );
      debug('Sorting/Filtering error troubleshooting info', {
        defaultDocumentContext,
      });
    }

    // Partition into sections
    const items = defaultDocumentContext.inventory.contents.items;

    let sections = Inventory.getDefaultInventorySections();

    for (let item of items) {
      ContainerSheetSections.applyContentsItemToSection(sections, item);
    }

    defaultDocumentContext.inventory.sections = Object.values(sections);

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
                sections: context.inventory.sections,
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

    TidyHooks.tidy5eSheetsPreConfigureSections(
      this,
      this.element.get(0),
      context
    );

    // Apply Section Configs
    // ------------------------------------------------------------

    const sectionConfigs = TidyFlags.sectionConfig.get(this.item);

    // Sort Sections
    context.inventory.sections = SheetSections.sortKeyedSections(
      context.inventory.sections,
      sectionConfigs?.[CONSTANTS.TAB_CONTAINER_CONTENTS]
    );

    // Trim Empty Sections
    context.inventory.sections = context.inventory.sections.filter(
      (section: ContainerSection) => section.items.length
    );

    // Apply Show/Hide
    for (let section of context.inventory.sections) {
      section.show =
        sectionConfigs?.[CONSTANTS.TAB_CONTAINER_CONTENTS]?.[section.key]
          ?.show !== false && section.items.length;
    }

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

  private _renderMutex = new AsyncMutex();
  async _render(force?: boolean, options = {}) {
    if (typeof options !== 'object') {
      options = {};
    }
    await this._renderMutex.lock(async () => {
      await this._renderSheet(force, options);
    });
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
  /*  Drag & Drop                                 */
  /* -------------------------------------------- */

  /** @inheritdoc */
  async _onDragStart(event) {
    const li = event.currentTarget;
    if (event.target.classList.contains('content-link')) return;
    if (!li.dataset.itemId) return super._onDragStart(event);

    const item = await this.item.system.getContainedItem(li.dataset.itemId);
    const dragData = item?.toDragData();
    if (!dragData) return;

    // Set data transfer
    event.dataTransfer.setData('text/plain', JSON.stringify(dragData));
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  _onDrop(event) {
    const data = TextEditor.getDragEventData(event);
    if (!['Item', 'Folder'].includes(data.type))
      return super._onDrop(event, data);

    if (Hooks.call('dnd5e.dropItemSheetData', this.item, this, data) === false)
      return;

    if (data.type === 'Folder') return this._onDropFolder(event, data);
    return this._onDropItem(event, data);
  }

  /* -------------------------------------------- */

  /**
   * Handle the dropping of Folder data onto the Container sheet.
   * @param {DragEvent} event              The concluding DragEvent which contains the drop data.
   * @param {object} data                  The data transfer extracted from the event.
   * @returns {Promise<Item5e[]>}          The created Item objects.
   */
  async _onDropFolder(event, data) {
    const folder = await Folder.implementation.fromDropData(data);
    if (!this.item.isOwner || folder.type !== 'Item') return [];

    let recursiveWarning = false;
    const parentContainers = await this.item.system.allContainers();
    const containers = new Set();

    let items = await Promise.all(
      folder.contents.map(async (item) => {
        if (!(item instanceof Item)) item = await fromUuid(item.uuid);
        if (item.system.container === this.item.id) return;
        if (this.item.uuid === item.uuid || parentContainers.includes(item)) {
          recursiveWarning = true;
          return;
        }
        if (item.type === 'container') containers.add(item.id);
        return item;
      })
    );
    items = items.filter((i) => i && !containers.has(i.system.container));

    // Display recursive warning, but continue with any remaining items
    if (recursiveWarning)
      ui.notifications.warn('DND5E.ContainerRecursiveError', {
        localize: true,
      });
    if (!items.length) return [];

    // Create any remaining items
    const toCreate = await Item5e.createWithContents(items, {
      container: this.item,
      transformAll: (itemData) =>
        itemData.type === 'spell'
          ? Item5e.createScrollFromSpell(itemData)
          : itemData,
    });
    if (this.item.folder)
      toCreate.forEach((d) => (d.folder = this.item.folder.id));
    return Item5e.createDocuments(toCreate, {
      pack: this.item.pack,
      parent: this.item.parent,
      keepId: true,
    });
  }

  /* -------------------------------------------- */

  /**
   * Handle the dropping of Item data onto an Item Sheet.
   * @param {DragEvent} event              The concluding DragEvent which contains the drop data.
   * @param {object} data                  The data transfer extracted from the event.
   * @returns {Promise<Item5e[]|boolean>}  The created Item objects or `false` if it couldn't be created.
   * @protected
   */
  async _onDropItem(event, data) {
    const item = await Item.implementation.fromDropData(data);
    if (!this.item.isOwner || !item) return false;

    // If item already exists in this container, just adjust its sorting
    if (item.system.container === this.item.id) {
      return this._onSortItem(event, item);
    }

    // Prevent dropping containers within themselves
    const parentContainers = await this.item.system.allContainers();
    if (this.item.uuid === item.uuid || parentContainers.includes(item)) {
      ui.notifications.error('DND5E.ContainerRecursiveError', {
        localize: true,
      });
      return;
    }

    // If item already exists in same DocumentCollection, just adjust its container property
    if (item.actor === this.item.actor && item.pack === this.item.pack) {
      return item.update({
        folder: this.item.folder,
        'system.container': this.item.id,
      });
    }

    // Otherwise, create a new item & contents in this context
    const toCreate = await Item5e.createWithContents([item], {
      container: this.item,
      transformAll: (itemData) =>
        itemData.type === 'spell'
          ? Item5e.createScrollFromSpell(itemData)
          : itemData,
    });
    if (this.item.folder)
      toCreate.forEach((d) => (d.folder = this.item.folder.id));
    return Item5e.createDocuments(toCreate, {
      pack: this.item.pack,
      parent: this.item.actor,
      keepId: true,
    });
  }

  /* -------------------------------------------- */

  /**
   * Handle a drop event for an existing contained Item to sort it relative to its siblings.
   * @param {DragEvent} event  The concluding DragEvent.
   * @param {Item5e} item      The item that needs to be sorted.
   * @protected
   */
  async _onSortItem(event, item) {
    const dropTarget = event.target.closest('[data-item-id]');
    if (!dropTarget) return;
    const contents = await this.item.system.contents;
    const target = contents.get(dropTarget.dataset.itemId);

    // Don't sort on yourself
    if (item.id === target.id) return;

    // Identify sibling items based on adjacent HTML elements
    const siblings = [];
    for (const el of dropTarget.parentElement.children) {
      const siblingId = el.dataset.itemId;
      if (siblingId && siblingId !== item.id)
        siblings.push(contents.get(siblingId));
    }

    // Perform the sort
    const sortUpdates = SortingHelpers.performIntegerSort(item, {
      target,
      siblings,
    });
    const updateData = sortUpdates.map((u) => {
      const update = u.update;
      update._id = u.target.id;
      return update;
    });

    // Perform the update
    Item.updateDocuments(updateData, {
      pack: this.item.pack,
      parent: this.item.actor,
    });
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
