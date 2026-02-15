import { CONSTANTS } from 'src/constants';
import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
import { ItemFilterService } from 'src/features/filtering/ItemFilterService.svelte';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type {
  ApplicationConfiguration,
  ApplicationRenderOptions,
} from 'src/types/application.types';
import type {
  ContainerSheetClassicContext,
  Item5e,
  ItemChatData,
  ItemDescription,
} from 'src/types/item.types';
import type {
  LocationToSearchTextMap,
  ExpandedItemIdToLocationsMap,
  ExpandedItemData,
  Utilities,
  Tab,
} from 'src/types/types';
import { mount } from 'svelte';
import ContainerSheet from './item/ContainerSheet.svelte';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { Container } from 'src/features/containers/Container';
import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime.svelte';
import { ItemSheetRuntime } from 'src/runtime/item/ItemSheetRuntime';
import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import { DocumentTabSectionConfigApplication } from 'src/applications/section-config/DocumentTabSectionConfigApplication.svelte';
import { TabManager } from 'src/runtime/tab/TabManager';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { settings } from 'src/settings/settings.svelte';
import { ExpansionTracker } from 'src/features/expand-collapse/ExpansionTracker.svelte';
import { TidyExtensibleDocumentSheetMixin } from 'src/mixins/TidyDocumentSheetMixin.svelte';

export class Tidy5eContainerSheetClassic extends TidyExtensibleDocumentSheetMixin(
  CONSTANTS.SHEET_TYPE_CONTAINER,
  SvelteApplicationMixin<
    ApplicationConfiguration | undefined,
    ContainerSheetClassicContext
  >(foundry.applications.sheets.ItemSheetV2)
) {
  currentTabId: string | undefined = undefined;
  searchFilters: LocationToSearchTextMap = new Map<string, string>();
  expandedItems: ExpandedItemIdToLocationsMap = new Map<string, Set<string>>();
  expandedItemData: ExpandedItemData = new Map<string, ItemChatData>();
  inlineToggleService = new InlineToggleService();
  itemFilterService: ItemFilterService;
  sectionExpansionTracker: ExpansionTracker;

  constructor(options?: Partial<ApplicationConfiguration> | undefined) {
    super(options);

    this._fixedMode = CONSTANTS.SHEET_MODE_EDIT;

    this.itemFilterService = new ItemFilterService({}, this.item);

    this.sectionExpansionTracker = new ExpansionTracker(
      true,
      this.document,
      CONSTANTS.LOCATION_SECTION
    );
  }

  static DEFAULT_OPTIONS: Partial<
    ApplicationConfiguration & { dragDrop: Partial<DragDropConfiguration>[] }
  > = {
    classes: [
      CONSTANTS.MODULE_ID,
      'sheet',
      'item',
      CONSTANTS.ITEM_TYPE_CONTAINER,
      CONSTANTS.SHEET_LAYOUT_CLASSIC,
      'tidy-form',
    ],
    tag: 'form',
    window: {
      frame: true,
      positioned: true,
      resizable: true,
      controls: [],
    },
    position: {
      width: 560,
      height: 600,
    },
    actions: {
      showIcon: async function (this: Tidy5eContainerSheetClassic) {
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
    ]);

    const component = mount(ContainerSheet, {
      target: node,
      context: context,
    });

    initTidy5eContextMenu(this, this.element, CONSTANTS.SHEET_LAYOUT_CLASSIC);

    return component;
  }

  async _prepareContext(
    options: ApplicationRenderOptions
  ): Promise<ContainerSheetClassicContext> {
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

    const systemSource = this.document.toObject().system;

    const isIdentifiable = 'identified' in this.item.system;

    const itemDescriptions: ItemDescription[] = [];

    itemDescriptions.push({
      enriched: enriched.description,
      content: systemSource.description.value,
      field: 'system.description.value',
      label: FoundryAdapter.localize('DND5E.Description'),
    });

    if (isIdentifiable && FoundryAdapter.userIsGm()) {
      itemDescriptions.push({
        enriched: enriched.unidentified,
        content: systemSource.unidentified.description,
        field: 'system.unidentified.description',
        label: FoundryAdapter.localize('DND5E.DescriptionUnidentified'),
      });
    }

    itemDescriptions.push({
      enriched: enriched.chat,
      content: systemSource.description.chat,
      field: 'system.description.chat',
      label: FoundryAdapter.localize('DND5E.DescriptionChat'),
    });

    const containerPreferences = UserSheetPreferencesService.getByType(
      this.item.type
    );

    const contentsSortMode =
      containerPreferences.tabs?.[CONSTANTS.TAB_CONTAINER_CONTENTS]?.sort ??
      'm';

    // Utilities
    let utilities: Utilities<ContainerSheetClassicContext> = {
      [CONSTANTS.TAB_CONTAINER_CONTENTS]: {
        utilityToolbarCommands: [
          {
            id: 'sort-mode-alpha',
            title: FoundryAdapter.localize('SIDEBAR.SortModeAlpha'),
            iconClass: 'fa-solid fa-arrow-down-a-z fa-fw',
            execute: async () => {
              await UserSheetPreferencesService.setDocumentTypeTabPreference(
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
            id: 'sort-mode-manual',
            title: FoundryAdapter.localize('SIDEBAR.SortModeManual'),
            iconClass: 'fa-solid fa-arrow-down-short-wide fa-fw',
            execute: async () => {
              await UserSheetPreferencesService.setDocumentTypeTabPreference(
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
            id: 'configure-sections',
            title: FoundryAdapter.localize(
              'TIDY5E.Utilities.ConfigureSections'
            ),
            iconClass: 'fas fa-cog',
            execute: ({ context, sections }) => {
              new DocumentTabSectionConfigApplication(
                {
                  // Provide a way to build the necessary config, perhaps within the application constructor. We've got all the info we need in order to perform the operation.
                  sections: sections,
                  tabId: CONSTANTS.TAB_CONTAINER_CONTENTS,
                  tabTitle: ItemSheetRuntime.getTabTitle(
                    CONSTANTS.TAB_CONTAINER_CONTENTS
                  ),
                },
                {
                  document: context.item,
                }
              ).render(true);
            },
          },
        ],
      },
    };

    documentSheetContext.source = systemSource;

    const context: ContainerSheetClassicContext = {
      capacity: await this.item.system.computeCapacity(),
      concealDetails:
        !game.user.isGM && this.document.system.identified === false,
      config: CONFIG.DND5E,
      containerContents: await Container.getContainerContents(this.item, {
        hasActor: !!this.item.actor,
        unlocked: documentSheetContext.unlocked,
      }),
      customContent: [],
      enriched: enriched,
      filterData: this.itemFilterService.getFilterData(),
      filterPins: ItemFilterRuntime.defaultFilterPins[this.item.type],
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
      itemOverrides: new Set<string>(this._getItemOverrides()),
      items: Array.from(await this.item.system.contents),
      itemType: game.i18n.localize(CONFIG.Item.typeLabels[this.item.type]),
      labels: this.document.labels,
      lockItemQuantity: FoundryAdapter.shouldLockItemQuantity(),
      lockMoneyChanges: FoundryAdapter.shouldLockMoneyChanges(),
      modernRules: FoundryAdapter.checkIfModernRules(this.item),
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
      utilities: utilities,
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
            arr: ContainerSheetClassicContext['properties']['options'],
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
            a: ContainerSheetClassicContext['properties']['options'][0],
            b: ContainerSheetClassicContext['properties']['options'][0]
          ) => a.label.localeCompare(b.label, game.i18n.lang)
        ),
    };

    // Tabs
    context.customContent = await ItemSheetRuntime.getContent(context);

    const eligibleCustomTabs = ItemSheetRuntime.getCustomItemTabs(context);

    const customTabs: Tab[] = await TabManager.prepareTabsForRender(
      context,
      eligibleCustomTabs
    );

    context.tabs =
      ItemSheetRuntime.classicSheets[this.item.type]?.defaultTabs() ?? [];
    context.tabs.push(...customTabs);

    TidyHooks.tidy5eSheetsPreConfigureSections(this, this.element, context);

    return context;
  }

  /**
   * Retrieve the list of fields that are currently modified by Active Effects on the Item.
   */
  _getItemOverrides(): string[] {
    const overrides = Object.keys(
      foundry.utils.flattenObject(this.item.overrides ?? {})
    );
    this.item.system.getItemOverrides?.(overrides);
    if ('properties' in this.item.system) {
      dnd5e.documents.ActiveEffect5e.addOverriddenChoices(
        this.item,
        'system.properties',
        'system.properties',
        overrides
      );
    }
    if (
      'damage' in this.item.system &&
      foundry.utils.getProperty(this.item.overrides, 'system.damage.parts')
    ) {
      overrides.push('damage-control');
      Array.fromRange(this.item.system.damage.parts.length).forEach((index) =>
        overrides.push(
          `system.damage.parts.${index}.0`,
          `system.damage.parts.${index}.1`
        )
      );
    }
    return overrides;
  }

  /* -------------------------------------------- */
  /*  Drag and Drop                               */
  /* -------------------------------------------- */

  /** @inheritDoc */
  async _onDrop(
    event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement }
  ): Promise<unknown> {
    const data = foundry.applications.ux.TextEditor.getDragEventData(event);
    if (!['Item', 'Folder'].includes(data.type)) {
      return await super._onDrop(event);
    }

    if (TidyHooks.dnd5eDropItemSheetData(this.item, this, data) === false) {
      return;
    }

    if (data.type === 'Folder') {
      return await this._onDropFolder(event, data);
    }

    return await this._onDropItem(event, data);
  }

  /* -------------------------------------------- */

  async _onDropFolder(
    event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement },
    data: any
  ): Promise<Item5e[]> {
    const folder = await Folder.implementation.fromDropData(data);
    if (!this.item.isOwner || folder.type !== 'Item') return [];

    let recursiveWarning = false;
    const parentContainers = await this.item.system.allContainers();
    const containers = new Set();

    let items = await Promise.all(
      folder.contents.map(async (item: any) => {
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
      transformAll: (itemData: any, options: any) =>
        this._onDropSingleItem(itemData, { ...options, event }),
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
    data: any
  ): Promise<Item5e[] | boolean | void> {
    const behavior = this._dropBehavior(event, data);
    const item = await Item.implementation.fromDropData(data);

    if (!this.item.isOwner || !item || behavior === 'none') {
      return false;
    }

    // If item already exists in this container, just adjust its sorting
    if (behavior === 'move' && item.system.container === this.item.id) {
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
    if (
      behavior === 'move' &&
      item.actor === this.item.actor &&
      item.pack === this.item.pack
    ) {
      return item.update({
        folder: this.item.folder,
        'system.container': this.item.id,
      });
    }

    // Otherwise, create a new item & contents in this context
    const toCreate = await dnd5e.documents.Item5e.createWithContents([item], {
      container: this.item,
      transformAll: (itemData: any, options: any) =>
        this._onDropSingleItem(itemData, { ...options, event }),
    });
    if (this.item.folder) {
      toCreate.forEach((d: any) => (d.folder = this.item.folder.id));
    }

    const created = dnd5e.documents.Item5e.createDocuments(toCreate, {
      pack: this.item.pack,
      parent: this.item.actor,
      keepId: true,
    });

    if (behavior === 'move') {
      item.delete({ deleteContents: true });
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
    const dropTarget = event.target.closest<HTMLElement>('[data-item-id]');
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

    // Perform the sort
    const sortUpdates = foundry.utils.performIntegerSort(item, {
      target,
      siblings,
    });
    const updateData = sortUpdates.map((u: any) => {
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

  // TODO: Plug in or reimplement
  // - SheetTabCacheable
  // - SheetExpandedItemsCacheable
  // - SearchFilterCacheable
}
