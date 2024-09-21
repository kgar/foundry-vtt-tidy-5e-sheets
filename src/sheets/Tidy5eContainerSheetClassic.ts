import { CONSTANTS } from 'src/constants';
import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService';
import { ItemFilterService } from 'src/features/filtering/ItemFilterService';
import { DragAndDropMixin } from 'src/mixins/DragAndDropBaseMixin';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin';
import type {
  ApplicationConfiguration,
  ApplicationRenderOptions,
} from 'src/types/application.types';
import type {
  ContainerSheetClassicContext,
  ItemChatData,
  ItemDescription,
} from 'src/types/item.types';
import type {
  LocationToSearchTextMap,
  ExpandedItemIdToLocationsMap,
  ExpandedItemData,
  ItemCardStore,
  MessageBus,
  MessageBusMessage,
  Utilities,
  Tab,
} from 'src/types/types';
import type { SvelteComponent } from 'svelte';
import { writable } from 'svelte/store';
import ContainerSheet from './item/ContainerSheet.svelte';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { Container } from 'src/features/containers/Container';
import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime';
import { ItemSheetRuntime } from 'src/runtime/item/ItemSheetRuntime';
import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import { DocumentTabSectionConfigApplication } from 'src/applications/section-config/DocumentTabSectionConfigApplication';
import { TabManager } from 'src/runtime/tab/TabManager';
import { TidyHooks } from 'src/foundry/TidyHooks';

export class Tidy5eContainerSheetClassic extends DragAndDropMixin(
  SvelteApplicationMixin<ContainerSheetClassicContext>(
    foundry.applications.sheets.ItemSheetV2
  )
) {
  currentTabId: string | undefined = undefined;
  searchFilters: LocationToSearchTextMap = new Map<string, string>();
  expandedItems: ExpandedItemIdToLocationsMap = new Map<string, Set<string>>();
  expandedItemData: ExpandedItemData = new Map<string, ItemChatData>();
  inlineToggleService = new InlineToggleService();
  card = writable<ItemCardStore>();
  itemFilterService: ItemFilterService;
  messageBus: MessageBus = writable<MessageBusMessage | undefined>();

  constructor(...args: any[]) {
    super(...args);

    this.itemFilterService = new ItemFilterService({}, this.item);
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
      CONSTANTS.SHEET_LAYOUT_CLASSIC,
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
    actions: {},
    dragDrop: [{ dropSelector: 'form' }],
  };

  _createComponent(node: HTMLElement): SvelteComponent<any, any, any> {
    this.card.set({ sheet: node, item: null, itemCardContentTemplate: null });

    const context = new Map<any, any>([
      [CONSTANTS.SVELTE_CONTEXT.CARD, this.card],
      [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this._store],
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
    ]);

    const component = new ContainerSheet({
      target: node,
      context: context,
    });

    const html = $(this.element);

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

    return component;
  }

  async _prepareContext(
    options: ApplicationRenderOptions
  ): Promise<ContainerSheetClassicContext> {
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

    const itemDescriptions: ItemDescription[] = [];

    itemDescriptions.push({
      content: enriched.description,
      field: 'system.description.value',
      label: FoundryAdapter.localize('DND5E.Description'),
    });

    if (isIdentifiable && FoundryAdapter.userIsGm()) {
      itemDescriptions.push({
        content: enriched.unidentified,
        field: 'system.unidentified.description',
        label: FoundryAdapter.localize('DND5E.DescriptionUnidentified'),
      });
    }

    itemDescriptions.push({
      content: enriched.chat,
      field: 'system.description.chat',
      label: FoundryAdapter.localize('DND5E.DescriptionChat'),
    });

    const containerPreferences = SheetPreferencesService.getByType(
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

    const context: ContainerSheetClassicContext = {
      capacity: await this.item.system.computeCapacity(),
      concealDetails:
        !game.user.isGM && this.document.system.identified === false,
      config: CONFIG.DND5E,
      containerContents: await Container.getContainerContents(this.item),
      customContent: [],
      document: this.document,
      editable: this.isEditable,
      enriched: enriched,
      filterData: this.itemFilterService.getDocumentItemFilterData(),
      filterPins: ItemFilterRuntime.defaultFilterPins[this.item.type],
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
      owner: this.item.isOwner,
      properties: {
        active: [],
        object: {},
        options: [],
      },
      rollData: rollData,
      source: this.document.toObject().system,
      system: this.document.system,
      tabs: [],
      utilities: utilities,
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

    context.tabs = ItemSheetRuntime.sheets[this.item.type]?.defaultTabs() ?? [];
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

  // TODO: Determine if `setExpandedItemData()` is needed
  // TODO: Determine if `_saveViewState()` is needed
  // TODO: Determine if `_onDropSingleItem()` is needed
  //   async _onDropSingleItem(...args: any[]) {
  //     return super._onDropSingleItem(...args);
  //   }

  // TODO: Determine if feasible to handle `removeConfigureSettingsButtonWhenLockedForNonGm()` in svelte mixin

  // TODO: Do we need
  // - SheetTabCacheable
  // - SheetExpandedItemsCacheable
  // - SearchFilterCacheable
}
