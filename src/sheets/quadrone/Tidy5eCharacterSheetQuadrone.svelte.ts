import { CONSTANTS } from 'src/constants';
import { ImportSheetControl } from 'src/features/sheet-header-controls/ImportSheetControl';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import { Tidy5eActorSheetBaseMixin } from 'src/mixins/Tidy5eActorSheetBaseMixin';
import { TidyExtensibleDocumentSheetMixin } from 'src/mixins/TidyDocumentSheetMixin.svelte';
import type {
  ApplicationConfiguration,
  ApplicationRenderOptions,
} from 'src/types/application.types';
import type { GroupSheetClassicContext } from 'src/types/group.types';
import CharacterSheet from './actor/CharacterSheet.svelte';
import { mount } from 'svelte';
import type {
  Actor5e,
  CharacterSheetQuadroneContext,
  DocumentSheetQuadroneContext,
  ExpandedItemData,
  ExpandedItemIdToLocationsMap,
  LocationToSearchTextMap,
  MessageBus,
} from 'src/types/types';
import type { ItemChatData } from 'src/types/item.types';
import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
import { ItemFilterService } from 'src/features/filtering/ItemFilterService.svelte';
import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime.svelte';
import { ExpansionTracker } from 'src/features/expand-collapse/ExpansionTracker.svelte';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import CharacterSheetQuadroneRuntime, {
  TempDefaultCharacterQuadroneTabs,
} from 'src/runtime/actor/CharacterSheetQuadroneRuntime.svelte';

export class Tidy5eCharacterSheetQuadrone extends Tidy5eActorSheetBaseMixin(
  TidyExtensibleDocumentSheetMixin(
    CONSTANTS.SHEET_TYPE_GROUP,
    SvelteApplicationMixin<
      ApplicationConfiguration | undefined,
      GroupSheetClassicContext
    >(foundry.applications.sheets.ActorSheetV2)
  )
) {
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

  constructor(options?: Partial<ApplicationConfiguration> | undefined) {
    super(options);

    this.itemFilterService = new ItemFilterService(
      {},
      this.item,
      ItemFilterRuntime.getDocumentFiltersQuadrone
    );
  }

  static DEFAULT_OPTIONS: Partial<
    ApplicationConfiguration & { dragDrop: Partial<DragDropConfiguration>[] }
  > = {
    classes: [
      CONSTANTS.MODULE_ID,
      'sheet',
      'actor',
      CONSTANTS.SHEET_TYPE_CHARACTER,
      'app-v2',
      CONSTANTS.SHEET_LAYOUT_QUADRONE,
    ],
    tag: 'form',
    window: {
      frame: true,
      positioned: true,
      resizable: true,
      controls: [
        this.ACTOR_ACTIONS_AND_CONTROLS.configureToken.control,
        this.ACTOR_ACTIONS_AND_CONTROLS.showPortraitArtwork.control,
        this.ACTOR_ACTIONS_AND_CONTROLS.showTokenArtwork.control,
        this.ACTOR_ACTIONS_AND_CONTROLS.openTabSelection.control,
      ],
    },
    position: {
      // TODO: Confirm with hightouch
      width: 600,
      height: 700,
    },
    dragDrop: [
      {
        dragSelector: '[data-tidy-draggable]',
        dropSelector: null,
      },
    ],
    actions: {
      [ImportSheetControl.actionName]: async function (this: any) {
        await ImportSheetControl.importFromCompendium(this, this.document);
      },
      ...this.ACTOR_ACTIONS_AND_CONTROLS.configureToken.action,
      ...this.ACTOR_ACTIONS_AND_CONTROLS.showPortraitArtwork.action,
      ...this.ACTOR_ACTIONS_AND_CONTROLS.showTokenArtwork.action,
      ...this.ACTOR_ACTIONS_AND_CONTROLS.openTabSelection.action,
    },
    submitOnClose: true,
  };

  _createComponent(node: HTMLElement): Record<string, any> {
    const component = mount(CharacterSheet, {
      target: node,
      context: new Map<any, any>([
        [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this._context],
        [CONSTANTS.SVELTE_CONTEXT.CURRENT_TAB_ID, this.currentTabId],
        [CONSTANTS.SVELTE_CONTEXT.MESSAGE_BUS, this.messageBus],
        [
          CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
          this.inlineToggleService,
        ],
        [CONSTANTS.SVELTE_CONTEXT.ITEM_FILTER_SERVICE, this.itemFilterService],
        [CONSTANTS.SVELTE_CONTEXT.LOCATION, ''],
        [CONSTANTS.SVELTE_CONTEXT.MESSAGE_BUS, this.messageBus],
        [
          CONSTANTS.SVELTE_CONTEXT.ON_FILTER,
          this.itemFilterService.onFilter.bind(this.itemFilterService),
        ],
        [
          CONSTANTS.SVELTE_CONTEXT.ON_FILTER_CLEAR_ALL,
          this.itemFilterService.onFilterClearAll.bind(this.itemFilterService),
        ],
        [
          CONSTANTS.SVELTE_CONTEXT.SECTION_EXPANSION_TRACKER,
          this.sectionExpansionTracker,
        ],
      ]),
    });

    const html = globalThis.$(this.element);

    initTidy5eContextMenu(this, html, CONSTANTS.SHEET_LAYOUT_QUADRONE);

    return component;
  }

  _createAdditionalComponents(node: HTMLElement) {
    // TODO: Prepare header mode toggle and whatever else goes in the header.
    return [];
  }

  async _prepareContext(
    options: ApplicationRenderOptions
  ): Promise<CharacterSheetQuadroneContext> {
    const baseContext = (await super._prepareContext(
      options
    )) as DocumentSheetQuadroneContext<Actor5e>;

    const context: CharacterSheetQuadroneContext = {
      ...baseContext,
      actor: this.actor,
      customContent: [],
      tabs: [],
      token: this.token,
    };

    const defaultTabs: string[] = TempDefaultCharacterQuadroneTabs;
    let tabs = (await CharacterSheetQuadroneRuntime.getTabs(context))
      .filter((t) => defaultTabs?.includes(t.id))
      .sort((a, b) => defaultTabs.indexOf(a.id) - defaultTabs.indexOf(b.id));

    context.tabs = tabs;

    return context;
  }
}
