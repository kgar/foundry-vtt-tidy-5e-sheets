import { CONSTANTS } from 'src/constants';
import type {
  ActorSheetQuadroneContext,
  ExpandedItemData,
  ExpandedItemIdToLocationsMap,
  GroupSheetQuadroneContext,
  LocationToSearchTextMap,
  MessageBus,
} from 'src/types/types';
import type { ItemChatData } from 'src/types/item.types';
import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
import { ExpansionTracker } from 'src/features/expand-collapse/ExpansionTracker.svelte';
import type {
  ApplicationConfiguration,
  ApplicationRenderOptions,
} from 'src/types/application.types';
import GroupSheet from './actor/GroupSheet.svelte';
import { mount } from 'svelte';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
import {
  TidyExtensibleDocumentSheetMixin,
  type TidyDocumentSheetRenderOptions,
} from 'src/mixins/TidyDocumentSheetMixin.svelte';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import { ItemFilterService } from 'src/features/filtering/ItemFilterService.svelte';
import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime.svelte';
import { SheetTabConfigurationQuadroneApplication } from 'src/applications/tab-configuration/SheetTabConfigurationQuadroneApplication.svelte';
import { ThemeSettingsQuadroneApplication } from 'src/applications/theme/ThemeSettingsQuadroneApplication.svelte';

export class Tidy5eGroupSheetQuadrone extends TidyExtensibleDocumentSheetMixin(
  CONSTANTS.SHEET_TYPE_GROUP,
  SvelteApplicationMixin<
    ApplicationConfiguration | undefined,
    GroupSheetQuadroneContext
  >(foundry.applications.sheets.ActorSheetV2)
) {
  currentTabId: string;
  itemFilterService: ItemFilterService;
  messageBus = $state<MessageBus>({ message: undefined });
  searchFilters: LocationToSearchTextMap = new Map<string, string>();
  expandedItems: ExpandedItemIdToLocationsMap = new Map<string, Set<string>>();
  expandedItemData: ExpandedItemData = new Map<string, ItemChatData>();
  inlineToggleService = new InlineToggleService();
  sectionExpansionTracker: ExpansionTracker;

  constructor(options?: Partial<ApplicationConfiguration> | undefined) {
    super(options);

    this.currentTabId = CONSTANTS.TAB_GROUP_MEMBERS;

    this.sectionExpansionTracker = new ExpansionTracker(
      true,
      this.document,
      CONSTANTS.LOCATION_SECTION
    );

    this.itemFilterService = new ItemFilterService(
      {},
      this.actor,
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
      CONSTANTS.SHEET_TYPE_GROUP,
      CONSTANTS.SHEET_LAYOUT_QUADRONE,
    ],
    position: {
      width: 740,
      height: 810,
    },
    window: {
      controls: [
        {
          action: 'openTabConfiguration',
          icon: 'fas fa-file-invoice',
          label: 'TIDY5E.TabSelection.MenuOptionText',
          ownership: 'OWNER',
          visible: function (this: Tidy5eGroupSheetQuadrone) {
            return this.isEditable;
          },
        },
        {
          icon: 'fa-solid fa-swatchbook',
          label: 'TIDY5E.ThemeSettings.SheetMenu.name',
          action: 'themeSettings',
          ownership: 'OWNER',
          visible: function (this: Tidy5eGroupSheetQuadrone) {
            return this.isEditable;
          },
        },
      ],
      resizable: true,
      positioned: true,
      frame: true,
    },
    actions: {
      openTabConfiguration: async function (this: Tidy5eGroupSheetQuadrone) {
        new SheetTabConfigurationQuadroneApplication({
          document: this.document,
        }).render({ force: true });
      },
      showArtwork: async function (this: Tidy5eGroupSheetQuadrone) {
        const showTokenPortrait =
          this.actor.flags.dnd5e?.[CONSTANTS.SYSTEM_FLAG_SHOW_TOKEN_PORTRAIT];
        const token = this.actor.isToken
          ? this.actor.token
          : this.actor.prototypeToken;
        const img = showTokenPortrait ? token.texture.src : this.actor.img;
        new foundry.applications.apps.ImagePopout({
          src: img,
          uuid: this.actor.uuid,
          window: { title: this.actor.name },
        }).render({ force: true });
      },
      themeSettings: async function (this: Tidy5eGroupSheetQuadrone) {
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

  _createComponent(node: HTMLElement): Record<string, any> {
    if (this.actor.limited) {
      return this._createLimitedViewComponent(node);
    }

    const component = mount(GroupSheet, {
      target: node,
      context: new Map<any, any>([
        [
          CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
          this.inlineToggleService,
        ],
        [CONSTANTS.SVELTE_CONTEXT.ITEM_FILTER_SERVICE, this.itemFilterService],
        [CONSTANTS.SVELTE_CONTEXT.LOCATION, ''],
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
        [CONSTANTS.SVELTE_CONTEXT.POSITION_REF, this._position],

        [
          CONSTANTS.SVELTE_CONTEXT.ON_TAB_SELECTED,
          this.onTabSelected.bind(this),
        ],
        [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this._context],
        [CONSTANTS.SVELTE_CONTEXT.MESSAGE_BUS, this.messageBus],
      ]),
    });

    initTidy5eContextMenu(this, this.element, CONSTANTS.SHEET_LAYOUT_QUADRONE);

    return component;
  }

  async _prepareContext(
    options: ApplicationRenderOptions
  ): Promise<GroupSheetQuadroneContext> {
    // this._concentration = this.actor.concentration;

    const actorContext = (await super._prepareContext(
      options
    )) as ActorSheetQuadroneContext;

    const themeSettings = ThemeQuadrone.getSheetThemeSettings({
      doc: this.actor,
    });

    const context: GroupSheetQuadroneContext = {
      type: 'group',
      ...actorContext,
    };

    // etc.

    return context;
  }

  /* -------------------------------------------- */
  /*  Life-Cycle Handlers                         */
  /* -------------------------------------------- */

  async _renderFrame(options: TidyDocumentSheetRenderOptions) {
    const element = await super._renderFrame(options);

    element.querySelector('.window-header').classList.add('theme-dark');

    return element;
  }

  /* -------------------------------------------- */
  /* SheetTabCacheable
  /* -------------------------------------------- */

  onTabSelected(tabId: string) {
    this.currentTabId = tabId;
  }
}
