import { mount } from 'svelte';
import { CONSTANTS } from 'src/constants';
import ContainerSheet from './container/ContainerSheet.svelte';
import type {
  ApplicationClosingOptions,
  ApplicationRenderOptions,
  DocumentSheetApplicationConfiguration,
} from 'src/types/application.types';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type {
  ContainerSheetQuadroneContext,
  CurrencyContext,
  Item5e,
  ItemChatData,
  ItemDescription,
} from 'src/types/item.types';
import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
import { ItemFilterService } from 'src/features/filtering/ItemFilterService.svelte';
import type {
  LocationToSearchTextMap,
  ExpandedItemIdToLocationsMap,
  ExpandedItemData,
  Tab,
  SheetTabCacheable,
} from 'src/types/types';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import { ItemSheetQuadroneRuntime } from 'src/runtime/item/ItemSheetQuadroneRuntime.svelte';
import { Container } from 'src/features/containers/Container';
import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime.svelte';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { settings } from 'src/settings/settings.svelte';
import ItemHeaderStart from './item/parts/ItemHeaderStart.svelte';
import { ExpansionTracker } from 'src/features/expand-collapse/ExpansionTracker.svelte';
import UserPreferencesService from 'src/features/user-preferences/UserPreferencesService';
import { TidyExtensibleDocumentSheetMixin } from 'src/mixins/TidyDocumentSheetMixin.svelte';
import { SheetTabConfigurationQuadroneApplication } from 'src/applications/tab-configuration/SheetTabConfigurationQuadroneApplication.svelte';
import { ThemeSettingsQuadroneApplication } from 'src/applications/theme/ThemeSettingsQuadroneApplication.svelte';
import type { DropEffectValue } from 'src/mixins/DragAndDropBaseMixin';
import { Inventory } from 'src/features/sections/Inventory';
import { isNil } from 'src/utils/data';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { mapGetOrInsert } from 'src/utils/map';

export class Tidy5eContainerSheetQuadrone
  extends TidyExtensibleDocumentSheetMixin(
    CONSTANTS.SHEET_TYPE_CONTAINER,
    SvelteApplicationMixin<
      DocumentSheetApplicationConfiguration | undefined,
      ContainerSheetQuadroneContext
    >(foundry.applications.sheets.ItemSheetV2)
  )
  implements SheetTabCacheable
{
  currentTabId: string = '';
  searchFilters: LocationToSearchTextMap = new Map<string, string>();
  expandedItems: ExpandedItemIdToLocationsMap = new Map<string, Set<string>>();
  expandedItemData: ExpandedItemData = new Map<string, ItemChatData>();
  inlineToggleService = new InlineToggleService();
  itemFilterService: ItemFilterService;
  sectionExpansionTracker: ExpansionTracker;

  constructor(options?: DocumentSheetApplicationConfiguration | undefined) {
    super(options);

    this.itemFilterService = new ItemFilterService(
      {},
      this.item,
      ItemFilterRuntime.getDocumentFiltersQuadrone
    );

    this.currentTabId = CONSTANTS.TAB_CONTAINER_CONTENTS;

    this.sectionExpansionTracker = new ExpansionTracker(
      true,
      this.document,
      CONSTANTS.LOCATION_SECTION
    );
  }

  static DEFAULT_OPTIONS: Partial<
    DocumentSheetApplicationConfiguration & {
      dragDrop: Partial<DragDropConfiguration>[];
    }
  > = {
    classes: [
      CONSTANTS.MODULE_ID,
      'sheet',
      'item',
      CONSTANTS.ITEM_TYPE_CONTAINER,
      'quadrone',
    ],
    tag: 'form',
    window: {
      frame: true,
      positioned: true,
      resizable: true,
      controls: [
        {
          action: 'openTabConfiguration',
          icon: 'fas fa-file-invoice',
          label: 'TIDY5E.TabConfiguration.MenuOptionText',
          ownership: 'OWNER',
          visible: function (this: Tidy5eContainerSheetQuadrone) {
            return this.isEditable;
          },
        },
        {
          icon: 'fa-solid fa-swatchbook',
          label: 'TIDY5E.ThemeSettings.SheetMenu.name',
          action: 'themeSettings',
          ownership: 'OWNER',
          visible: function (this: Tidy5eContainerSheetQuadrone) {
            return this.isEditable;
          },
        },
      ],
    },
    position: {
      width: 620,
      height: 580,
    },
    actions: {
      openTabConfiguration: async function (
        this: Tidy5eContainerSheetQuadrone
      ) {
        new SheetTabConfigurationQuadroneApplication({
          document: this.document,
        }).render({ force: true });
      },
      // TODO: Item and Container Sheets duplicate this functionality; consolidate somewhere
      showIcon: async function (this: Tidy5eContainerSheetQuadrone) {
        const title =
          this.item.system.identified === false
            ? this.item.system.unidentified.name
            : this.item.name;
        new foundry.applications.apps.ImagePopout({
          src: this.item.img,
          uuid: this.item.uuid,
          window: { title },
        }).render({ force: true });
      },
      themeSettings: async function (this: Tidy5eContainerSheetQuadrone) {
        await new ThemeSettingsQuadroneApplication({
          document: this.document,
        }).render({
          force: true,
        });
      },
    },
    dragDrop: [
      {
        dragSelector: `[data-tidy-always-draggable]`,
        dropSelector: null,
      },
      {
        dragSelector: '[data-tidy-draggable]',
        dropSelector: null,
      },
    ],
    submitOnClose: true,
  };

  selectTab(tabId: string) {
    this.onTabSelected(tabId);
    this.render();
  }

  _createComponent(node: HTMLElement): Record<string, any> {
    const context = new Map<any, any>([
      [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this._context],
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
      [CONSTANTS.SVELTE_CONTEXT.SEARCH_FILTERS, new Map(this.searchFilters)],
      [
        CONSTANTS.SVELTE_CONTEXT.SECTION_EXPANSION_TRACKER,
        this.sectionExpansionTracker,
      ],
      [CONSTANTS.SVELTE_CONTEXT.ON_TAB_SELECTED, this.onTabSelected.bind(this)],
      [CONSTANTS.SVELTE_CONTEXT.EXPANDED_ITEM_DATA, this.expandedItemData],
      [CONSTANTS.SVELTE_CONTEXT.ON_ITEM_TOGGLED, this.onItemToggled.bind(this)],
      [CONSTANTS.SVELTE_CONTEXT.EXPANDED_ITEMS, this.expandedItems],
    ]);

    const component = mount(ContainerSheet, {
      target: node,
      context: context,
    });

    initTidy5eContextMenu(this, this.element, CONSTANTS.SHEET_LAYOUT_QUADRONE);

    return component;
  }

  _createAdditionalComponents(node: HTMLElement) {
    const windowHeader = this.element.querySelector('.window-header');

    const headerStart = mount(ItemHeaderStart, {
      target: windowHeader,
      anchor: windowHeader.querySelector('.window-title'),
      context: new Map<string, any>([
        [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this._context],
      ]),
    });

    return [headerStart];
  }

  async _prepareContext(
    options: ApplicationRenderOptions
  ): Promise<ContainerSheetQuadroneContext> {
    this.itemFilterService.refreshFilters();

    const documentSheetContext = await super._prepareContext(options);

    const rollData = this.item.getRollData();

    const enrichmentOptions = {
      secrets: this.item.isOwner,
      relativeTo: this.item,
      rollData: rollData,
    };

    const enriched = {
      description: await foundry.applications.ux.TextEditor.enrichHTML(
        this.item.system.description.value,
        enrichmentOptions
      ),
      unidentified: await foundry.applications.ux.TextEditor.enrichHTML(
        this.item.system.unidentified?.description,
        enrichmentOptions
      ),
      chat: await foundry.applications.ux.TextEditor.enrichHTML(
        this.item.system.description.chat,
        enrichmentOptions
      ),
    };

    const isIdentifiable = 'identified' in this.document.system;
    const unidentified = this.item.system.identified === false;
    const showOnlyUnidentified =
      unidentified && !FoundryAdapter.isInGmEditMode(this.item);

    documentSheetContext.source = this.document.toObject().system;

    let itemDescriptions: ItemDescription[] = [];

    if (!showOnlyUnidentified) {
      itemDescriptions.push({
        enriched: enriched.description,
        content: documentSheetContext.source.description.value,
        field: 'system.description.value',
        label: FoundryAdapter.localize('DND5E.Description'),
      });
    }

    if (isIdentifiable) {
      itemDescriptions.push({
        enriched: enriched.unidentified,
        content: documentSheetContext.source.unidentified.description,
        field: 'system.unidentified.description',
        label: FoundryAdapter.localize('DND5E.DescriptionUnidentified'),
      });
    }

    if (!showOnlyUnidentified) {
      itemDescriptions.push({
        enriched: enriched.chat,
        content: documentSheetContext.source.description.chat,
        field: 'system.description.chat',
        label: FoundryAdapter.localize('DND5E.DescriptionChat'),
      });
    }

    if (!this.item.isOwner) {
      itemDescriptions = itemDescriptions.slice(0, 1);
    }

    const containerPreferences = SheetPreferencesService.getByType(
      this.item.type
    );

    const contentsSortMethod =
      containerPreferences.tabs?.[CONSTANTS.TAB_CONTAINER_CONTENTS]?.sort ??
      'm';

    const currencies: CurrencyContext[] = [];

    Object.keys(CONFIG.DND5E.currencies).forEach((key) =>
      currencies.push({
        key: key,
        value: this.item.system.currency[key] as number,
        abbr:
          CONFIG.DND5E.currencies[key as keyof typeof CONFIG.DND5E.currencies]
            ?.abbreviation ?? key,
      })
    );

    const capacityContext = await Container.computeCapacity(this.item);

    const context: ContainerSheetQuadroneContext = {
      capacity: capacityContext,
      concealDetails:
        !game.user.isGM && this.document.system.identified === false,
      config: CONFIG.DND5E,
      containerContents: await Container.getContainerContents(this.item, {
        hasActor: !!this.item.actor,
        unlocked: documentSheetContext.unlocked,
      }),
      customContent: [],
      currencies,
      currentTabId: this.currentTabId,
      enriched: enriched,
      filterData: this.itemFilterService.getFilterData(),
      filterPins: ItemFilterRuntime.defaultFilterPinsQuadrone[this.item.type],
      identifiedName: FoundryAdapter.getIdentifiedName(this.item),
      isContainer: true,
      isIdentifiable: isIdentifiable,
      isIdentified: this.document.system.identified !== false,
      isPhysical: this.document.system.hasOwnProperty('quantity'),
      item: this.item,
      itemContext: await Container.getContainerItemContext(this.item, {
        hasActor: !!this.item.actor,
        unlocked: documentSheetContext.unlocked,
      }),
      itemDescriptions: itemDescriptions,
      items: Array.from(await this.item.system.contents),
      itemType: game.i18n.localize(CONFIG.Item.typeLabels[this.item.type]),
      labels: this.document.labels,
      lockItemQuantity: FoundryAdapter.shouldLockItemQuantity(),
      lockMoneyChanges: FoundryAdapter.shouldLockMoneyChanges(),
      modernRules: FoundryAdapter.checkIfModernRules(this.item),
      name: {
        value: this.item.name,
        editable: this.item._source.name,
        field: this.item.schema.getField('name'),
      },
      owner: this.item.isOwner,
      properties: {
        active: [],
        object: {},
        options: [],
      },
      rollData: rollData,
      sheet: this,
      system: this.document.system,
      tabs: [],
      userPreferences: UserPreferencesService.get(),
      ...documentSheetContext,
    };

    // Properties
    context.properties = {
      active: [],
      object: Object.fromEntries(
        (this.document.system.properties ?? []).map((p: string) => [p, true])
      ),
      options: (this.document.system.validProperties ?? [])
        .reduce(
          (
            arr: ContainerSheetQuadroneContext['properties']['options'],
            k: any
          ) => {
            // @ts-ignore
            const { label } = CONFIG.DND5E.itemProperties[k];
            arr.push({
              label,
              value: k,
              selected: this.item._source.system.properties?.includes(k),
            });
            return arr;
          },
          []
        )
        .sort(
          (
            a: ContainerSheetQuadroneContext['properties']['options'][0],
            b: ContainerSheetQuadroneContext['properties']['options'][0]
          ) => a.label.localeCompare(b.label, game.i18n.lang)
        ),
    };

    // Tabs
    context.customContent = await ItemSheetQuadroneRuntime.getContent(context);

    context.tabs = await ItemSheetQuadroneRuntime.getTabs(context);

    await this.setExpandedItemData();

    TidyHooks.tidy5eSheetsPreConfigureSections(this, this.element, context);

    return context;
  }

  private async setExpandedItemData() {
    this.expandedItemData.clear();
    for (const [id, locations] of this.expandedItems) {
      if (locations.size === 0) {
        continue;
      }
      const item = this.item.system.contents.get(id);
      if (item) {
        this.expandedItemData.set(
          id,
          await item.getChatData({ secrets: this.item.isOwner })
        );
      }
    }
  }

  /* -------------------------------------------- */
  /*  Rendering Life-Cycle Methods                */
  /* -------------------------------------------- */
  async _renderHTML(
    context: ContainerSheetQuadroneContext,
    options: ApplicationRenderOptions
  ) {
    game.user.apps[this.id] = this;

    return await super._renderHTML(context, options);
  }

  async close(options: ApplicationClosingOptions = {}) {
    delete game.user.apps[this.id];

    return await super.close(options);
  }

  /* -------------------------------------------- */
  /*  Drag and Drop                               */
  /* -------------------------------------------- */

  #dropBehavior: DropEffectValue | null = null;

  /** @inheritDoc */
  async _onDrop(
    event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement }
  ): Promise<unknown> {
    this.#dropBehavior = this._dropBehavior(event);

    try {
      const data = foundry.applications.ux.TextEditor.getDragEventData(event);
      if (!['Item', 'Folder'].includes(data.type)) {
        return await super._onDrop(event);
      }

      if (TidyHooks.dnd5eDropItemSheetData(this.item, this, data) === false) {
        return;
      }

      const documentClass = foundry.utils.getDocumentClass(data.type);

      const document = await documentClass.fromDropData(data);

      if (data.type === 'Folder') {
        return await this._onDropFolder(event, document);
      }

      return await this._onDropItem(event, document);
    } finally {
      this.#dropBehavior = null;
    }
  }

  /* -------------------------------------------- */

  async _onDropFolder(
    event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement },
    document: any
  ): Promise<Item5e[]> {
    if (!this.item.isOwner || document.type !== 'Item') {
      return [];
    }

    let recursiveWarning = false;
    const parentContainers = await this.item.system.allContainers();
    const containers = new Set();

    let items = await Promise.all(
      document.contents.map(async (item: any) => {
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
    const toCreate = await dnd5e.documents.Item5e.createWithContents(items, {
      container: this.item,
      transformAll: (itemData: any) => {
        const options: Record<string, unknown> = {};

        if (settings.value.includeFlagsInSpellScrollCreation) {
          options.flags = itemData.flags;
        }

        return itemData.type === 'spell'
          ? dnd5e.documents.Item5e.createScrollFromSpell(itemData, options)
          : itemData;
      },
    });
    if (this.item.folder)
      toCreate.forEach((d: any) => (d.folder = this.item.folder.id));
    return dnd5e.documents.Item5e.createDocuments(toCreate, {
      pack: this.item.pack,
      parent: this.item.parent,
      keepId: true,
    });
  }

  /* -------------------------------------------- */

  async _onDropItem(
    event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement },
    document: Item5e
  ): Promise<Item5e[] | boolean | void> {
    if (!this.item.isOwner || !document) {
      return false;
    }

    const behavior = this.#dropBehavior ?? 'none';

    if (behavior === 'none') {
      return false;
    }

    // If item already exists in this container, just adjust its sorting
    if (behavior === 'move' && document.system.container === this.item.id) {
      return this._onSortItem(event, document);
    }

    // Prevent dropping containers within themselves
    const parentContainers = await this.item.system.allContainers();
    if (
      this.item.uuid === document.uuid ||
      parentContainers.includes(document)
    ) {
      ui.notifications.error('DND5E.ContainerRecursiveError', {
        localize: true,
      });
      return;
    }

    // If item already exists in same DocumentCollection, just adjust its container property
    if (
      behavior === 'move' &&
      document.actor === this.item.actor &&
      document.pack === this.item.pack
    ) {
      return document.update({
        folder: this.item.folder,
        'system.container': this.item.id,
      });
    }

    // Otherwise, create a new item & contents in this context
    const toCreate = await dnd5e.documents.Item5e.createWithContents(
      [document],
      {
        container: this.item,
        transformAll: (itemData: any, options: any) =>
          this._onDropSingleItem(itemData, { ...options, event }),
      }
    );
    if (this.item.folder) {
      toCreate.forEach((d: any) => (d.folder = this.item.folder.id));
    }

    const created = dnd5e.documents.Item5e.createDocuments(toCreate, {
      pack: this.item.pack,
      parent: this.item.actor,
      keepId: true,
    });

    if (behavior === 'move') {
      document.delete({ deleteContents: true });
    }

    return created;
  }

  /**
   * Process a single item when dropping into the container.
   * @param {object} itemData           The item data to create.
   * @param {object} options
   * @param {string} options.container  ID of the container to create the items.
   * @param {number} options.depth      Current depth of the item being created.
   * @param {DragEvent} options.event   The concluding DragEvent which provided the drop data.
   * @returns {Promise<object|false>}   The item data to create after processing, or false if the item should not be
   *                                    created or creation has been otherwise handled.
   * @protected
   */
  async _onDropSingleItem(itemData: any, { container, depth, event }: any) {
    if (itemData.type === CONSTANTS.ITEM_TYPE_SPELL) {
      if (settings.value.includeFlagsInSpellScrollCreation) {
        itemData.flags = itemData.flags;
      }

      const scroll = await dnd5e.documents.Item5e.createScrollFromSpell(
        itemData
      );

      return scroll?.toObject?.() ?? false;
    }

    if (this.item.actor && container === this.item.id) {
      const result = await FoundryAdapter.onDropStackConsumablesForActor(
        this.item.actor,
        itemData,
        { container }
      );
      if (result) return false;
    }

    return itemData;
  }

  /* -------------------------------------------- */

  /**
   * Handle a drop event for an existing contained Item to sort it relative to its siblings.
   */
  async _onSortItem(
    event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement },
    item: Item5e
  ) {
    const eventTarget = event.target;

    const dropTarget = eventTarget.closest<HTMLElement>('[data-item-id]');

    if (!dropTarget) return;

    const contents = await this.item.system.contents;
    const target = contents.get(dropTarget.dataset.itemId);

    // Don't sort on yourself
    if (item.id === target.id) return;

    // Identify sibling items based on adjacent HTML elements
    const siblings = [];
    for (const el of Array.from(dropTarget.parentElement!.children)) {
      if (el instanceof HTMLElement) {
        const siblingId = el.dataset.itemId;
        if (siblingId && siblingId !== item.id)
          siblings.push(contents.get(siblingId));
      }
    }

    const sectionUpdate = FoundryAdapter.getSectionUpdateForDropTarget(
      eventTarget,
      item
    );

    // Perform the sort
    const sortUpdates = foundry.utils.SortingHelpers.performIntegerSort(item, {
      target,
      siblings,
    });
    const updateData = sortUpdates.map((u: any) => {
      const update = u.update;
      update._id = u.target.id;
      if (update._id === item.id) {
        foundry.utils.mergeObject(update, sectionUpdate);
      }
      return update;
    });

    // Perform the update
    Item.updateDocuments(updateData, {
      pack: this.item.pack,
      parent: this.item.actor,
    });
  }

  async _addDocument(args: {
    tabId: string;
    customSection?: string;
    creationItemTypes?: string[];
    data?: Record<string, any>;
  }) {
    let { type: datasetType, ...restDataset } = args.data ?? {};

    let customSection = restDataset[TidyFlags.section.prop];

    if (args.tabId === CONSTANTS.TAB_CONTAINER_CONTENTS) {
      return !isNil(datasetType, '') && isNil(customSection, '')
        ? await Container.createInventoryItem(this.item, datasetType)
        : await Container.promptCreateInventoryItem(this.item, customSection);
    }
  }

  /* -------------------------------------------- */

  /**
   * Determine the types of items that can be added depending on the current tab.
   * @param {string} tab  Currently viewed tab.
   * @returns {string[]}  Types of items to allow to create.
   */
  _addDocumentItemTypes(tab: string): string[] {
    switch (tab) {
      case CONSTANTS.TAB_CONTAINER_CONTENTS:
        return Inventory.getInventoryTypes();
      default:
        return [];
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
  }
}
