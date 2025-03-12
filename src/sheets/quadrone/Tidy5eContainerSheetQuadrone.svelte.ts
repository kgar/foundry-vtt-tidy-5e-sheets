import { mount } from 'svelte';
import { CONSTANTS } from 'src/constants';
import ContainerSheet from './container/ContainerSheet.svelte';
import type {
  ApplicationClosingOptions,
  ApplicationConfiguration,
  ApplicationRenderOptions,
} from 'src/types/application.types';
import { DragAndDropMixin } from 'src/mixins/DragAndDropBaseMixin';
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
  MessageBus,
  Tab,
  SheetTabCacheable,
} from 'src/types/types';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import { ItemSheetRuntime } from 'src/runtime/item/ItemSheetRuntime';
import { Container } from 'src/features/containers/Container';
import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime.svelte';
import { TabManager } from 'src/runtime/tab/TabManager';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { settings } from 'src/settings/settings.svelte';
import ItemHeaderStart from './item/parts/ItemHeaderStart.svelte';
import { ExpansionTracker } from 'src/features/expand-collapse/ExpansionTracker.svelte';
import UserPreferencesService from 'src/features/user-preferences/UserPreferencesService';
import { TidyExtensibleDocumentSheetMixin } from 'src/mixins/TidyDocumentSheetMixin.svelte';
import type {
  SortGroup,
  SortGroupKeyQuadrone,
  SortMethodKeyQuadrone,
  SortMethodOption,
} from 'src/types/sort.types';
import { ItemSortRuntime } from 'src/runtime/item/ItemSortRuntime.svelte';

export class Tidy5eContainerSheetQuadrone
  extends TidyExtensibleDocumentSheetMixin(
    CONSTANTS.SHEET_TYPE_CONTAINER,
    DragAndDropMixin(
      SvelteApplicationMixin<
        ApplicationConfiguration | undefined,
        ContainerSheetQuadroneContext
      >(foundry.applications.sheets.ItemSheetV2)
    )
  )
  implements SheetTabCacheable
{
  currentTabId: string | undefined = undefined;
  searchFilters: LocationToSearchTextMap = new Map<string, string>();
  expandedItems: ExpandedItemIdToLocationsMap = new Map<string, Set<string>>();
  expandedItemData: ExpandedItemData = new Map<string, ItemChatData>();
  inlineToggleService = new InlineToggleService();
  itemFilterService: ItemFilterService;
  messageBus = $state<MessageBus>({ message: undefined });
  sectionExpansionTracker = new ExpansionTracker(
    true,
    CONSTANTS.LOCATION_SECTION
  );

  constructor(options?: ApplicationConfiguration | undefined) {
    super(options);

    this.itemFilterService = new ItemFilterService(
      {},
      this.item,
      ItemFilterRuntime.getDocumentFiltersQuadrone
    );

    this.currentTabId = CONSTANTS.TAB_CONTAINER_CONTENTS;
  }

  static DEFAULT_OPTIONS: Partial<
    ApplicationConfiguration & { dragDrop: Partial<DragDropConfiguration>[] }
  > = {
    classes: [
      CONSTANTS.MODULE_ID,
      'sheet',
      'item',
      CONSTANTS.ITEM_TYPE_CONTAINER,
      'app-v2',
      'quadrone',
    ],
    tag: 'form',
    window: {
      frame: true,
      positioned: true,
      resizable: true,
      controls: [],
    },
    position: {
      width: 620,
      height: 580,
    },
    actions: {},
    dragDrop: [{ dropSelector: 'form' }],
    submitOnClose: false,
  };

  _createComponent(node: HTMLElement): Record<string, any> {
    const context = new Map<any, any>([
      [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this._context],
      [CONSTANTS.SVELTE_CONTEXT.CURRENT_TAB_ID, this.currentTabId],
      [CONSTANTS.SVELTE_CONTEXT.MESSAGE_BUS, this.messageBus],
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
    ]);

    const component = mount(ContainerSheet, {
      target: node,
      context: context,
    });

    const html = globalThis.$(this.element);

    initTidy5eContextMenu(this, html);

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
    const rollData = this.item.getRollData();

    const enrichmentOptions = {
      secrets: this.item.isOwner,
      relativeTo: this.item,
      rollData: rollData,
    };

    const enriched = {
      description: await TextEditor.enrichHTML(
        this.item.system.description.value,
        enrichmentOptions
      ),
      unidentified: await TextEditor.enrichHTML(
        this.item.system.unidentified?.description,
        enrichmentOptions
      ),
      chat: await TextEditor.enrichHTML(
        this.item.system.description.chat,
        enrichmentOptions
      ),
    };

    const isIdentifiable = 'identified' in this.item.system;

    const systemSource = this.document.toObject().system;

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

    const containerPreferences = SheetPreferencesService.getByType(
      this.item.type
    );

    const contentsSortMethod =
      containerPreferences.tabs?.[CONSTANTS.TAB_CONTAINER_CONTENTS]?.sort ??
      'm';

    const alphaGroupMembers: SortMethodKeyQuadrone[] = ['a', 'd'];

    // TODO: This needs to be part of the sort group model, relating sort methods to specific groups.
    const contentsSortGroup: SortGroupKeyQuadrone =
      // priority is not supported on container sheets; but this logic should be consolidated generically to a centralized location for sorting
      contentsSortMethod === 'priority'
        ? 'priority'
        : alphaGroupMembers.includes(contentsSortMethod)
        ? 'a'
        : contentsSortMethod === 'equipped'
        ? 'equipped'
        : 'm';

    const editable = this.isEditable;

    const unlocked = FoundryAdapter.isSheetUnlocked(this.item) && editable;

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
      containerContents: await Container.getContainerContents(this.item),
      contentsSort: {
        group: contentsSortGroup,
        groups:
          ItemSortRuntime.getDocumentSortGroupsQuadrone(this.document)[
            CONSTANTS.TAB_CONTAINER_CONTENTS
          ] ?? [],
        method: contentsSortMethod,
        methods:
          ItemSortRuntime.getDocumentSortMethodsQuadrone(this.document)[
            CONSTANTS.TAB_CONTAINER_CONTENTS
          ] ?? [],
      },
      customContent: [],
      currencies,
      document: this.document,
      editable: editable,
      enriched: enriched,
      filterData: this.itemFilterService.getDocumentItemFilterData(),
      filterPins: ItemFilterRuntime.defaultFilterPinsQuadrone[this.item.type],
      identifiedName: FoundryAdapter.getIdentifiedName(this.item),
      isContainer: true,
      isIdentifiable: isIdentifiable,
      isIdentified: this.document.system.identified !== false,
      isPhysical: this.document.system.hasOwnProperty('quantity'),
      item: this.item,
      itemContext: await Container.getContainerItemContext(this.item),
      itemDescriptions: itemDescriptions,
      itemOverrides: new Set<string>(this._getItemOverrides()),
      items: Array.from(await this.item.system.contents),
      // @ts-expect-error
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
      source: systemSource,
      system: this.document.system,
      tabs: [],
      unlocked: unlocked,
      userPreferences: UserPreferencesService.get(),
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
    context.customContent = await ItemSheetRuntime.getContent(context);

    const eligibleCustomTabs = ItemSheetRuntime.getCustomItemTabs(context);

    const customTabs: Tab[] = await TabManager.prepareTabsForRender(
      context,
      eligibleCustomTabs
    );

    context.tabs =
      // TODO: Eliminate null forgiving operator and temp field when items are fully converted.
      ItemSheetRuntime.quadroneSheets[this.item.type]?.defaultTabs() ?? [];
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

  /** @inheritDoc */
  async _onDrop(
    event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement }
  ): Promise<unknown> {
    const data = TextEditor.getDragEventData(event);
    if (!['Item', 'Folder'].includes(data.type)) {
      return super._onDrop(event);
    }

    if (TidyHooks.dnd5eDropItemSheetData(this.item, this, data) === false) {
      return;
    }

    if (data.type === 'Folder') {
      return this._onDropFolder(event, data);
    }

    return this._onDropItem(event, data);
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
    data: any
  ): Promise<Item5e[] | boolean | void> {
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
    const toCreate = await dnd5e.documents.Item5e.createWithContents([item], {
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
      parent: this.item.actor,
      keepId: true,
    });
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
    const sortUpdates = SortingHelpers.performIntegerSort(item, {
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

  /* -------------------------------------------- */
  /* SheetTabCacheable
  /* -------------------------------------------- */

  onTabSelected(tabId: string) {
    this.currentTabId = tabId;
  }

  // TODO: Plug in or reimplement
  // - SheetExpandedItemsCacheable
  // - SearchFilterCacheable
}
