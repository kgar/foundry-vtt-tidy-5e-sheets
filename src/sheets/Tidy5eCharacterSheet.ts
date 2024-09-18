import { FoundryAdapter } from '../foundry/foundry-adapter';
import CharacterSheet from './character/CharacterSheet.svelte';
import { debug, error } from 'src/utils/logging';
import { SettingsProvider, settingStore } from 'src/settings/settings';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import { CONSTANTS } from 'src/constants';
import { writable } from 'svelte/store';
import {
  type ItemCardStore,
  type CharacterSheetContext,
  type SheetStats,
  type Actor5e,
  type SheetTabCacheable,
  type SheetExpandedItemsCacheable,
  type SearchFilterCacheable,
  type LocationToSearchTextMap,
  type ExpandedItemIdToLocationsMap,
  type ExpandedItemData,
  type TidyResource,
  type MessageBusMessage,
  type MessageBus,
  type Utilities,
  type ActiveEffect5e,
  type ActorInventoryTypes,
  type CharacterItemPartitions,
  type CharacterFeatureSection,
  type CharacterItemContext,
  type SpellbookSection,
  type FavoriteSection,
  type EffectFavoriteSection,
  type SpellcastingInfo as SpellcastingInfo,
} from 'src/types/types';
import {
  applySheetAttributesToWindow,
  applyThemeDataAttributeToWindow,
  applyTitleToWindow,
  blurUntabbableButtonsOnClick,
  maintainCustomContentInputFocus,
} from 'src/utils/applications';
import type { SvelteComponent } from 'svelte';
import { getPercentage } from 'src/utils/numbers';
import type { Item5e, ItemChatData } from 'src/types/item.types';
import { CharacterSheetRuntime } from 'src/runtime/CharacterSheetRuntime';
import {
  actorUsesActionFeature,
  getActorActionSections,
} from 'src/features/actions/actions';
import { isNil } from 'src/utils/data';
import { CustomContentRenderer } from './CustomContentRenderer';
import { ActorPortraitRuntime } from 'src/runtime/ActorPortraitRuntime';
import { calculateSpellAttackAndDc } from 'src/utils/formula';
import { CustomActorTraitsRuntime } from 'src/runtime/actor-traits/CustomActorTraitsRuntime';
import { ItemTableToggleCacheService } from 'src/features/caching/ItemTableToggleCacheService';
import { ItemFilterService } from 'src/features/filtering/ItemFilterService';
import { StoreSubscriptionsService } from 'src/features/store/StoreSubscriptionsService';
import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import { AsyncMutex } from 'src/utils/mutex';
import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime';
import { Tidy5eBaseActorSheet } from './Tidy5eBaseActorSheet';
import { CharacterSheetSections } from 'src/features/sections/CharacterSheetSections';
import { SheetSections } from 'src/features/sections/SheetSections';
import { DocumentTabSectionConfigApplication } from 'src/applications/section-config/DocumentTabSectionConfigApplication';
import { BaseSheetCustomSectionMixin } from './mixins/BaseSheetCustomSectionMixin';
import { Inventory } from 'src/features/sections/Inventory';
import type {
  CharacterFavorite,
  UnsortedCharacterFavorite,
} from 'src/foundry/dnd5e.types';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { Container } from 'src/features/containers/Container';
import { InlineContainerToggleService } from 'src/features/containers/InlineContainerToggleService';
import { ConditionsAndEffects } from 'src/features/conditions-and-effects/ConditionsAndEffects';

export class Tidy5eCharacterSheet
  extends BaseSheetCustomSectionMixin(
    (object) => object.items,
    dnd5e.applications.actor.ActorSheet5eCharacter
  )
  implements
    SheetTabCacheable,
    SheetExpandedItemsCacheable,
    SearchFilterCacheable
{
  context = writable<CharacterSheetContext>();
  stats = writable<SheetStats>({
    lastSubmissionTime: null,
  });
  card = writable<ItemCardStore>();
  currentTabId: string;
  searchFilters: LocationToSearchTextMap = new Map<string, string>();
  expandedItems: ExpandedItemIdToLocationsMap = new Map<string, Set<string>>();
  expandedItemData: ExpandedItemData = new Map<string, ItemChatData>();
  inlineContainerToggleService = new InlineContainerToggleService();
  itemTableTogglesCache: ItemTableToggleCacheService;
  itemFilterService: ItemFilterService;
  subscriptionsService: StoreSubscriptionsService;
  messageBus: MessageBus = writable<MessageBusMessage | undefined>();

  /**
   * The cached concentration information for the character.
   * @type {{items: Set<Item5e>, effects: Set<ActiveEffect5e>}}
   * @internal
   */
  _concentration: { items: Set<Item5e>; effects: Set<ActiveEffect5e> } = {
    items: new Set(),
    effects: new Set(),
  };

  constructor(...args: any[]) {
    super(...args);

    this.subscriptionsService = new StoreSubscriptionsService();

    this.itemTableTogglesCache = new ItemTableToggleCacheService({
      userId: game.user.id,
      documentId: this.actor.id,
    });

    this.itemFilterService = new ItemFilterService({}, this.actor);

    this.currentTabId =
      SettingsProvider.settings.initialCharacterSheetTab.get();
  }

  get template() {
    return FoundryAdapter.getTemplate('empty-form-template.hbs');
  }

  static get defaultOptions() {
    return FoundryAdapter.mergeObject(super.defaultOptions, {
      classes: [
        CONSTANTS.MODULE_ID,
        'sheet',
        'actor',
        CONSTANTS.SHEET_TYPE_CHARACTER,
        CONSTANTS.SHEET_LAYOUT_CLASSIC,
        'app-v1',
      ],
      width: 740,
      height: 810,
      scrollY: ['[data-tidy-track-scroll-y]', '.scroll-container'],
    });
  }

  component: SvelteComponent | undefined;
  activateListeners(html: { get: (index: 0) => HTMLElement }) {
    // Document Apps Reactivity
    game.user.apps[this.id] = this;

    // Subscriptions
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

    this.component = new CharacterSheet({
      target: node,
      context: new Map<any, any>([
        [CONSTANTS.SVELTE_CONTEXT.APP_ID, this.appId],
        [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this.context],
        [CONSTANTS.SVELTE_CONTEXT.MESSAGE_BUS, this.messageBus],
        [CONSTANTS.SVELTE_CONTEXT.STATS, this.stats],
        [CONSTANTS.SVELTE_CONTEXT.CARD, this.card],
        [CONSTANTS.SVELTE_CONTEXT.CURRENT_TAB_ID, this.currentTabId],
        [
          CONSTANTS.SVELTE_CONTEXT.ON_TAB_SELECTED,
          this.onTabSelected.bind(this),
        ],
        [CONSTANTS.SVELTE_CONTEXT.SEARCH_FILTERS, new Map(this.searchFilters)],
        [
          CONSTANTS.SVELTE_CONTEXT.INLINE_CONTAINER_TOGGLE_SERVICE,
          this.inlineContainerToggleService,
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
        [CONSTANTS.SVELTE_CONTEXT.ON_SEARCH, this.onSearch.bind(this)],
        [
          CONSTANTS.SVELTE_CONTEXT.ON_ITEM_TOGGLED,
          this.onItemToggled.bind(this),
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
        [CONSTANTS.SVELTE_CONTEXT.LOCATION, ''],
        [CONSTANTS.SVELTE_CONTEXT.EXPANDED_ITEMS, new Map(this.expandedItems)],
        [
          CONSTANTS.SVELTE_CONTEXT.EXPANDED_ITEM_DATA,
          new Map(this.expandedItemData),
        ],
      ]),
    });

    initTidy5eContextMenu(this, html);
  }

  async getData(options = {}) {
    this._concentration = this.actor.concentration;

    const defaultDocumentContext = await super.getData(this.options);

    Tidy5eBaseActorSheet.applyCommonContext(defaultDocumentContext);

    const characterPreferences = SheetPreferencesService.getByType(
      this.actor.type
    );

    const attributesSortMode =
      characterPreferences.tabs?.[CONSTANTS.TAB_CHARACTER_ATTRIBUTES]?.sort ??
      'm';
    const inventorySortMode =
      characterPreferences.tabs?.[CONSTANTS.TAB_ACTOR_INVENTORY]?.sort ?? 'm';
    const spellbookSortMode =
      characterPreferences.tabs?.[CONSTANTS.TAB_CHARACTER_SPELLBOOK]?.sort ??
      'm';
    const featureSortMode =
      characterPreferences.tabs?.[CONSTANTS.TAB_CHARACTER_FEATURES]?.sort ??
      'm';
    const actionListSortMode =
      characterPreferences.tabs?.[CONSTANTS.TAB_ACTOR_ACTIONS]?.sort ?? 'm';

    const unlocked =
      FoundryAdapter.isActorSheetUnlocked(this.actor) &&
      defaultDocumentContext.editable;

    const tidyResources: TidyResource[] = defaultDocumentContext.resources.map(
      (r: any) => ({
        name: r.name,
        label: r.label,
        labelName: `system.resources.${r.name}.label`,
        placeholder: r.placeholder,
        value: r.value,
        valueName: `system.resources.${r.name}.value`,
        max: r.max,
        maxName: `system.resources.${r.name}.max`,
        sr: r.sr,
        srName: `system.resources.${r.name}.sr`,
        lr: r.lr,
        lrName: `system.resources.${r.name}.lr`,
        cssClasses: [],
        dataSet: {},
      })
    );

    TidyHooks.tidy5eSheetsPrepareResources(tidyResources, this.actor);

    // TODO: Make a builder for this
    // TODO: Extract to runtime?
    let utilities: Utilities<CharacterSheetContext> = {
      [CONSTANTS.TAB_CHARACTER_ATTRIBUTES]: {
        utilityToolbarCommands: [
          {
            title: FoundryAdapter.localize('SIDEBAR.SortModeAlpha'),
            iconClass: 'fa-solid fa-arrow-down-a-z fa-fw',
            execute: async () => {
              await SheetPreferencesService.setDocumentTypeTabPreference(
                this.actor.type,
                CONSTANTS.TAB_CHARACTER_ATTRIBUTES,
                'sort',
                'm'
              );
            },
            visible: attributesSortMode === 'a',
          },
          {
            title: FoundryAdapter.localize('SIDEBAR.SortModeManual'),
            iconClass: 'fa-solid fa-arrow-down-short-wide fa-fw',
            execute: async () => {
              await SheetPreferencesService.setDocumentTypeTabPreference(
                this.actor.type,
                CONSTANTS.TAB_CHARACTER_ATTRIBUTES,
                'sort',
                'a'
              );
            },
            visible: attributesSortMode === 'm',
          },
          {
            title: FoundryAdapter.localize('TIDY5E.Commands.ExpandAll'),
            iconClass: 'fas fa-angles-down',
            execute: () =>
              // TODO: Use app.messageBus
              this.messageBus.set({
                tabId: CONSTANTS.TAB_CHARACTER_ATTRIBUTES,
                message: CONSTANTS.MESSAGE_BUS_EXPAND_ALL,
              }),
          },
          {
            title: FoundryAdapter.localize('TIDY5E.Commands.CollapseAll'),
            iconClass: 'fas fa-angles-up',
            execute: () =>
              // TODO: Use app.messageBus
              this.messageBus.set({
                tabId: CONSTANTS.TAB_CHARACTER_ATTRIBUTES,
                message: CONSTANTS.MESSAGE_BUS_COLLAPSE_ALL,
              }),
          },
          {
            title: FoundryAdapter.localize(
              'TIDY5E.Utilities.ConfigureSections'
            ),
            iconClass: 'fas fa-cog',
            execute: ({ context }) => {
              new DocumentTabSectionConfigApplication({
                document: context.actor,
                // Provide a way to build the necessary config, perhaps within the application constructor. We've got all the info we need in order to perform the operation.
                sections: context.favorites,
                tabId: CONSTANTS.TAB_CHARACTER_ATTRIBUTES,
                tabTitle: CharacterSheetRuntime.getTabTitle(
                  CONSTANTS.TAB_CHARACTER_ATTRIBUTES
                ),
              }).render(true);
            },
          },
        ],
      },
      [CONSTANTS.TAB_ACTOR_INVENTORY]: {
        utilityToolbarCommands: [
          {
            title: FoundryAdapter.localize('SIDEBAR.SortModeAlpha'),
            iconClass: 'fa-solid fa-arrow-down-a-z fa-fw',
            execute: async () => {
              await SheetPreferencesService.setDocumentTypeTabPreference(
                this.actor.type,
                CONSTANTS.TAB_ACTOR_INVENTORY,
                'sort',
                'm'
              );
            },
            visible: inventorySortMode === 'a',
          },
          {
            title: FoundryAdapter.localize('SIDEBAR.SortModeManual'),
            iconClass: 'fa-solid fa-arrow-down-short-wide fa-fw',
            execute: async () => {
              await SheetPreferencesService.setDocumentTypeTabPreference(
                this.actor.type,
                CONSTANTS.TAB_ACTOR_INVENTORY,
                'sort',
                'a'
              );
            },
            visible: inventorySortMode === 'm',
          },
          {
            title: FoundryAdapter.localize(
              'TIDY5E.Commands.HideContainerPanel'
            ),
            iconClass: `fas fa-boxes-stacked fa-fw`,
            execute: () => {
              TidyFlags.showContainerPanel.unset(this.actor);
            },
            visible: !!TidyFlags.showContainerPanel.get(this.actor),
          },
          {
            title: FoundryAdapter.localize(
              'TIDY5E.Commands.ShowContainerPanel'
            ),
            iconClass: `fas fa-box fa-fw`,
            execute: () => {
              TidyFlags.showContainerPanel.set(this.actor, true);
            },
            visible: !TidyFlags.showContainerPanel.get(this.actor),
          },
          {
            title: FoundryAdapter.localize('TIDY5E.Commands.ExpandAll'),
            iconClass: 'fas fa-angles-down',
            execute: () =>
              // TODO: Use app.messageBus
              this.messageBus.set({
                tabId: CONSTANTS.TAB_ACTOR_INVENTORY,
                message: CONSTANTS.MESSAGE_BUS_EXPAND_ALL,
              }),
          },
          {
            title: FoundryAdapter.localize('TIDY5E.Commands.CollapseAll'),
            iconClass: 'fas fa-angles-up',
            execute: () =>
              // TODO: Use app.messageBus
              this.messageBus.set({
                tabId: CONSTANTS.TAB_ACTOR_INVENTORY,
                message: CONSTANTS.MESSAGE_BUS_COLLAPSE_ALL,
              }),
          },
          {
            title: FoundryAdapter.localize('TIDY5E.ListLayout'),
            iconClass: 'fas fa-th-list fa-fw toggle-list',
            visible: !TidyFlags.inventoryGrid.get(this.actor),
            execute: () => {
              TidyFlags.inventoryGrid.set(this.actor);
            },
          },
          {
            title: FoundryAdapter.localize('TIDY5E.GridLayout'),
            iconClass: 'fas fa-th-large fa-fw toggle-grid',
            visible: !!TidyFlags.inventoryGrid.get(this.actor),
            execute: () => {
              TidyFlags.inventoryGrid.unset(this.actor);
            },
          },
          {
            title: FoundryAdapter.localize(
              'TIDY5E.Utilities.ConfigureSections'
            ),
            iconClass: 'fas fa-cog',
            execute: ({ context }) => {
              new DocumentTabSectionConfigApplication({
                document: context.actor,
                sections: context.inventory,
                tabId: CONSTANTS.TAB_ACTOR_INVENTORY,
                tabTitle: CharacterSheetRuntime.getTabTitle(
                  CONSTANTS.TAB_ACTOR_INVENTORY
                ),
              }).render(true);
            },
          },
        ],
      },
      [CONSTANTS.TAB_CHARACTER_SPELLBOOK]: {
        utilityToolbarCommands: [
          {
            title: FoundryAdapter.localize('SIDEBAR.SortModeAlpha'),
            iconClass: 'fa-solid fa-arrow-down-a-z fa-fw',
            execute: async () => {
              await SheetPreferencesService.setDocumentTypeTabPreference(
                this.actor.type,
                CONSTANTS.TAB_CHARACTER_SPELLBOOK,
                'sort',
                'm'
              );
            },
            visible: spellbookSortMode === 'a',
          },
          {
            title: FoundryAdapter.localize('SIDEBAR.SortModeManual'),
            iconClass: 'fa-solid fa-arrow-down-short-wide fa-fw',
            execute: async () => {
              await SheetPreferencesService.setDocumentTypeTabPreference(
                this.actor.type,
                CONSTANTS.TAB_CHARACTER_SPELLBOOK,
                'sort',
                'a'
              );
            },
            visible: spellbookSortMode === 'm',
          },
          {
            title: 'Spell Pips',
            iconClass: 'fa-regular fa-circle-dot fa-fw',
            execute: async () => {
              await SheetPreferencesService.setDocumentTypePreference(
                this.actor.type,
                CONSTANTS.SPELL_SLOT_TRACKER_MODE_PREFERENCE,
                CONSTANTS.SPELL_SLOT_TRACKER_MODE_VALUE_MAX
              );
            },
            visible:
              (characterPreferences?.spellSlotTrackerMode ??
                CONSTANTS.SPELL_SLOT_TRACKER_MODE_PIPS) ===
              CONSTANTS.SPELL_SLOT_TRACKER_MODE_PIPS,
          },
          {
            title: 'Spell Value/Max',
            iconClass: 'fa-regular fa-square fa-fw',
            execute: async () => {
              await SheetPreferencesService.setDocumentTypePreference(
                this.actor.type,
                CONSTANTS.SPELL_SLOT_TRACKER_MODE_PREFERENCE,
                CONSTANTS.SPELL_SLOT_TRACKER_MODE_PIPS
              );
            },
            visible:
              characterPreferences?.spellSlotTrackerMode ===
              CONSTANTS.SPELL_SLOT_TRACKER_MODE_VALUE_MAX,
          },
          {
            title: FoundryAdapter.localize('TIDY5E.Commands.ExpandAll'),
            iconClass: 'fas fa-angles-down',
            execute: () =>
              // TODO: Use app.messageBus
              this.messageBus.set({
                tabId: CONSTANTS.TAB_CHARACTER_SPELLBOOK,
                message: CONSTANTS.MESSAGE_BUS_EXPAND_ALL,
              }),
          },
          {
            title: FoundryAdapter.localize('TIDY5E.Commands.CollapseAll'),
            iconClass: 'fas fa-angles-up',
            execute: () =>
              // TODO: Use app.messageBus
              this.messageBus.set({
                tabId: CONSTANTS.TAB_CHARACTER_SPELLBOOK,
                message: CONSTANTS.MESSAGE_BUS_COLLAPSE_ALL,
              }),
          },
          {
            title: FoundryAdapter.localize('TIDY5E.ListLayout'),
            iconClass: 'fas fa-th-list fa-fw toggle-list',
            visible: !TidyFlags.spellbookGrid.get(this.actor),
            execute: () => {
              TidyFlags.spellbookGrid.set(this.actor);
            },
          },
          {
            title: FoundryAdapter.localize('TIDY5E.GridLayout'),
            iconClass: 'fas fa-th-large fa-fw toggle-grid',
            visible: !!TidyFlags.spellbookGrid.get(this.actor),
            execute: () => {
              TidyFlags.spellbookGrid.unset(this.actor);
            },
          },
          {
            title: FoundryAdapter.localize(
              'TIDY5E.Utilities.ConfigureSections'
            ),
            iconClass: 'fas fa-cog',
            execute: ({ context }) => {
              new DocumentTabSectionConfigApplication({
                document: context.actor,
                sections: context.spellbook,
                tabId: CONSTANTS.TAB_CHARACTER_SPELLBOOK,
                tabTitle: CharacterSheetRuntime.getTabTitle(
                  CONSTANTS.TAB_CHARACTER_SPELLBOOK
                ),
              }).render(true);
            },
          },
        ],
      },
      [CONSTANTS.TAB_CHARACTER_FEATURES]: {
        utilityToolbarCommands: [
          {
            title: FoundryAdapter.localize('SIDEBAR.SortModeAlpha'),
            iconClass: 'fa-solid fa-arrow-down-a-z fa-fw',
            execute: async () => {
              await SheetPreferencesService.setDocumentTypeTabPreference(
                this.actor.type,
                CONSTANTS.TAB_CHARACTER_FEATURES,
                'sort',
                'm'
              );
            },
            visible: featureSortMode === 'a',
          },
          {
            title: FoundryAdapter.localize('SIDEBAR.SortModeManual'),
            iconClass: 'fa-solid fa-arrow-down-short-wide fa-fw',
            execute: async () => {
              await SheetPreferencesService.setDocumentTypeTabPreference(
                this.actor.type,
                CONSTANTS.TAB_CHARACTER_FEATURES,
                'sort',
                'a'
              );
            },
            visible: featureSortMode === 'm',
          },
          {
            title: FoundryAdapter.localize('TIDY5E.Commands.ExpandAll'),
            iconClass: 'fas fa-angles-down',
            execute: () =>
              // TODO: Use app.messageBus
              this.messageBus.set({
                tabId: CONSTANTS.TAB_CHARACTER_FEATURES,
                message: CONSTANTS.MESSAGE_BUS_EXPAND_ALL,
              }),
          },
          {
            title: FoundryAdapter.localize('TIDY5E.Commands.CollapseAll'),
            iconClass: 'fas fa-angles-up',
            execute: () =>
              // TODO: Use app.messageBus
              this.messageBus.set({
                tabId: CONSTANTS.TAB_CHARACTER_FEATURES,
                message: CONSTANTS.MESSAGE_BUS_COLLAPSE_ALL,
              }),
          },
          {
            title: FoundryAdapter.localize(
              'TIDY5E.Utilities.ConfigureSections'
            ),
            iconClass: 'fas fa-cog',
            execute: ({ context }) => {
              new DocumentTabSectionConfigApplication({
                document: context.actor,
                sections: context.features,
                tabId: CONSTANTS.TAB_CHARACTER_FEATURES,
                tabTitle: CharacterSheetRuntime.getTabTitle(
                  CONSTANTS.TAB_CHARACTER_FEATURES
                ),
              }).render(true);
            },
          },
        ],
      },
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
          {
            title: FoundryAdapter.localize(
              'TIDY5E.Utilities.ConfigureSections'
            ),
            iconClass: 'fas fa-cog',
            execute: ({ context }) => {
              new DocumentTabSectionConfigApplication({
                document: context.actor,
                sections: context.actions,
                tabId: CONSTANTS.TAB_ACTOR_ACTIONS,
                tabTitle: CharacterSheetRuntime.getTabTitle(
                  CONSTANTS.TAB_ACTOR_ACTIONS
                ),
              }).render(true);
            },
          },
        ],
      },
    };

    // Effects & Conditions
    let { conditions, effects: enhancedEffectSections } =
      await ConditionsAndEffects.getConditionsAndEffects(
        this.actor,
        this.object,
        defaultDocumentContext.effects
      );

    const context: CharacterSheetContext = {
      ...defaultDocumentContext,
      activateEditors: (node, options) =>
        FoundryAdapter.activateEditors(node, this, options?.bindSecrets),
      actions: await getActorActionSections(this.actor),
      actorClassesToImages: getActorClassesToImages(this.actor),
      actorPortraitCommands:
        ActorPortraitRuntime.getEnabledPortraitMenuCommands(this.actor),
      allowEffectsManagement: FoundryAdapter.allowCharacterEffectsManagement(
        this.actor
      ),
      allowMaxHpOverride:
        SettingsProvider.settings.allowHpMaxOverride.get() &&
        (!SettingsProvider.settings.lockHpMaxChanges.get() ||
          FoundryAdapter.userIsGm()),
      appearanceEnrichedHtml: await FoundryAdapter.enrichHtml(
        this.actor.system.details.appearance,
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          relativeTo: this.actor,
        }
      ),
      appId: this.appId,
      biographyEnrichedHtml: await FoundryAdapter.enrichHtml(
        this.actor.system.details.biography.value,
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          relativeTo: this.actor,
        }
      ),
      bondEnrichedHtml: await FoundryAdapter.enrichHtml(
        this.actor.system.details.bond,
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          relativeTo: this.actor,
        }
      ),
      conditions: conditions,
      containerPanelItems: await Inventory.getContainerPanelItems(
        defaultDocumentContext.items
      ),
      customActorTraits: CustomActorTraitsRuntime.getEnabledTraits(
        defaultDocumentContext
      ),
      customContent: await CharacterSheetRuntime.getContent(
        defaultDocumentContext
      ),
      editable: defaultDocumentContext.editable,
      effects: enhancedEffectSections,
      filterData: this.itemFilterService.getDocumentItemFilterData(),
      filterPins: ItemFilterRuntime.defaultFilterPins[this.actor.type],
      flawEnrichedHtml: await FoundryAdapter.enrichHtml(
        this.actor.system.details.flaw,
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          relativeTo: this.actor,
        }
      ),
      healthPercentage: getPercentage(
        this.actor?.system?.attributes?.hp?.value,
        this.actor?.system?.attributes?.hp?.max
      ),
      idealEnrichedHtml: await FoundryAdapter.enrichHtml(
        this.actor.system.details.ideal,
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          relativeTo: this.actor,
        }
      ),
      lockExpChanges: FoundryAdapter.shouldLockExpChanges(),
      lockHpMaxChanges: FoundryAdapter.shouldLockHpMaxChanges(),
      lockItemQuantity: FoundryAdapter.shouldLockItemQuantity(),
      lockLevelSelector: FoundryAdapter.shouldLockLevelSelector(),
      lockMoneyChanges: FoundryAdapter.shouldLockMoneyChanges(),
      lockSensitiveFields:
        (!unlocked && SettingsProvider.settings.useTotalSheetLock.get()) ||
        !defaultDocumentContext.editable,
      notes1EnrichedHtml: await FoundryAdapter.enrichHtml(
        TidyFlags.notes1.members.value.get(this.actor) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          relativeTo: this.actor,
        }
      ),
      notes2EnrichedHtml: await FoundryAdapter.enrichHtml(
        TidyFlags.notes2.members.value.get(this.actor) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          relativeTo: this.actor,
        }
      ),
      notes3EnrichedHtml: await FoundryAdapter.enrichHtml(
        TidyFlags.notes3.members.value.get(this.actor) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          relativeTo: this.actor,
        }
      ),
      notes4EnrichedHtml: await FoundryAdapter.enrichHtml(
        TidyFlags.notes4.members.value.get(this.actor) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          relativeTo: this.actor,
        }
      ),
      notesEnrichedHtml: await FoundryAdapter.enrichHtml(
        TidyFlags.notes.members.value.get(this.actor) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          relativeTo: this.actor,
        }
      ),
      originalContext: defaultDocumentContext,
      owner: this.actor.isOwner,
      showContainerPanel:
        TidyFlags.showContainerPanel.get(this.actor) === true &&
        Array.from(defaultDocumentContext.items).some(
          (i: Item5e) => i.type === CONSTANTS.ITEM_TYPE_CONTAINER
        ),
      showLimitedSheet: FoundryAdapter.showLimitedSheet(this.actor),
      spellSlotTrackerMode:
        characterPreferences.spellSlotTrackerMode ??
        CONSTANTS.SPELL_SLOT_TRACKER_MODE_PIPS,
      tabs: [],
      tidyResources: tidyResources,
      traitEnrichedHtml: await FoundryAdapter.enrichHtml(
        this.actor.system.details.trait,
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          relativeTo: this.actor,
        }
      ),
      unlocked: unlocked,
      useActionsFeature: actorUsesActionFeature(this.actor),
      useClassicControls:
        SettingsProvider.settings.useClassicControlsForCharacter.get(),
      useRoundedPortraitStyle: [
        CONSTANTS.CIRCULAR_PORTRAIT_OPTION_ALL as string,
        CONSTANTS.CIRCULAR_PORTRAIT_OPTION_CHARACTER as string,
      ].includes(SettingsProvider.settings.useCircularPortraitStyle.get()),
      utilities: utilities,
      viewableWarnings:
        defaultDocumentContext.warnings?.filter(
          (w: any) => !isNil(w.message?.trim(), '')
        ) ?? [],
    };

    if (context.system.details.xp.boonsEarned !== undefined) {
      const pluralRules = new Intl.PluralRules(game.i18n.lang);

      context.epicBoonsEarned = FoundryAdapter.localize(
        `DND5E.ExperiencePointsBoons.${pluralRules.select(
          this.actor.system.details.xp.boonsEarned ?? 0
        )}`,
        {
          number: dnd5e.utils.formatNumber(
            this.actor.system.details.xp.boonsEarned ?? 0,
            { signDisplay: 'always' }
          ),
        }
      );
    }

    for (const panelItem of context.containerPanelItems) {
      const ctx = context.itemContext[panelItem.container.id];
      ctx.containerContents = await Container.getContainerContents(
        panelItem.container
      );
    }

    let tabs = await CharacterSheetRuntime.getTabs(context);

    const selectedTabs = TidyFlags.selectedTabs.get(context.actor);

    if (selectedTabs?.length) {
      tabs = tabs
        .filter((t) => selectedTabs?.includes(t.id))
        .sort(
          (a, b) => selectedTabs.indexOf(a.id) - selectedTabs.indexOf(b.id)
        );
    } else {
      const defaultTabs =
        SettingsProvider.settings.defaultCharacterSheetTabs.get();
      tabs = tabs
        .filter((t) => defaultTabs?.includes(t.id))
        .sort((a, b) => defaultTabs.indexOf(a.id) - defaultTabs.indexOf(b.id));
    }

    context.tabs = tabs;

    TidyHooks.tidy5eSheetsPreConfigureSections(
      this,
      this.element.get(0),
      context
    );

    // Apply Section Configs
    // ------------------------------------------------------------

    let effectsSection: EffectFavoriteSection = {
      canCreate: false,
      dataset: {},
      effects: [],
      key: 'tidy.effects',
      label: 'DND5E.Effects',
      show: true,
    };
    const favoriteEffects = (
      this.actor.system.favorites as CharacterFavorite[]
    ).filter((f) => f.type === 'effect');

    // TODO: Do I need to remove active effects from favorites when they are no longer available on the sheet?
    // Or does the system do this?
    for (const favoriteEffect of favoriteEffects) {
      const effect = fromUuidSync(favoriteEffect.id, { relative: this.actor });

      if (!effect) {
        continue;
      }

      const data = await effect.getFavoriteData();

      if (data.suppressed) {
        data.subtitle = game.i18n.localize('DND5E.Suppressed');
      }

      effectsSection.effects.push({
        effectId: effect.id,
        effect: effect,
        id: favoriteEffect.id,
        img: data.img,
        sort: favoriteEffect.sort,
        subtitle: data.subtitle,
        suppressed: data.suppressed,
        title: data.title,
        toggle: { applicable: true, value: data.toggle },
      });
    }

    // Favorites
    context.favorites = CharacterSheetSections.mergeDuplicateFavoriteSections(
      context.favorites
    );

    if (effectsSection.effects.length) {
      (context.favorites as FavoriteSection[]).push({
        ...effectsSection,
        type: CONSTANTS.TAB_CHARACTER_EFFECTS,
      });
    }

    debug('Character Sheet context data', context);

    return context;
  }

  protected _prepareItems(context: CharacterSheetContext) {
    // Categorize items as inventory, spellbook, features, and classes
    const inventory: ActorInventoryTypes =
      Inventory.getDefaultInventorySections();
    const favoriteInventory: ActorInventoryTypes =
      Inventory.getDefaultInventorySections({
        canCreate: false,
      });

    const favoritesIdMap: Map<string, CharacterFavorite> =
      this._getFavoritesIdMap();

    // Partition items by category
    let {
      items,
      spells,
      feats,
      species,
      backgrounds,
      classes,
      subclasses,
      favorites,
    } = Array.from(this.actor.items).reduce(
      (
        obj: CharacterItemPartitions & { favorites: CharacterItemPartitions },
        item: Item5e
      ) => {
        const { quantity } = item.system;

        // Item details
        const ctx = (context.itemContext[item.id] ??= {});
        ctx.isStack = Number.isNumeric(quantity) && quantity !== 1;
        ctx.attunement = FoundryAdapter.getAttunementContext(item);

        // Item usage
        ctx.hasUses = item.hasLimitedUses;
        ctx.hasRecharge = item.hasRecharge;

        // Unidentified items
        ctx.concealDetails =
          !game.user.isGM && item.system.identified === false;

        // Item grouping
        const [originId] =
          item.getFlag('dnd5e', 'advancementOrigin')?.split('.') ?? [];
        const group = this.actor.items.get(originId);
        switch (group?.type) {
          case 'race':
            ctx.group = 'species';
            break;
          case 'background':
            ctx.group = 'background';
            break;
          case 'class':
            ctx.group = group.identifier;
            break;
          case 'subclass':
            ctx.group = group.class?.identifier ?? 'other';
            break;
          default:
            ctx.group = 'other';
        }

        // Individual item preparation
        this._prepareItem(item, ctx);

        const isWithinContainer = this.actor.items.has(item.system.container);

        // Classify items into types
        if (!isWithinContainer) {
          CharacterSheetSections.partitionItem(item, obj, inventory);
        }

        const favoritedItem = favoritesIdMap.get(
          item.getRelativeUUID(this.actor)
        );
        if (favoritedItem?.type === 'item') {
          ctx.favoriteId = favoritedItem.id;
          CharacterSheetSections.partitionItem(
            item,
            obj.favorites,
            favoriteInventory
          );
        }

        return obj;
      },
      {
        items: [] as Item5e[],
        spells: [] as Item5e[],
        feats: [] as Item5e[],
        species: [] as Item5e[],
        backgrounds: [] as Item5e[],
        classes: [] as Item5e[],
        subclasses: [] as Item5e[],
        favorites: {
          items: [] as Item5e[],
          spells: [] as Item5e[],
          feats: [] as Item5e[],
          species: [] as Item5e[],
          backgrounds: [] as Item5e[],
          classes: [] as Item5e[],
          subclasses: [] as Item5e[],
        },
      }
    );

    const inventoryTypes = Inventory.getDefaultInventoryTypes();
    // Organize items
    // Section the items by type
    for (let item of items) {
      const ctx = (context.itemContext[item.id] ??= {});
      ctx.totalWeight = item.system.totalWeight?.toNearest(0.1);
      Inventory.applyInventoryItemToSection(inventory, item, inventoryTypes, {
        canCreate: true,
      });
    }

    // Section favorite items by type
    for (let item of favorites.items) {
      const ctx = (context.itemContext[item.id] ??= {});
      ctx.totalWeight = item.system.totalWeight?.toNearest(0.1);
      Inventory.applyInventoryItemToSection(
        favoriteInventory,
        item,
        inventoryTypes,
        {
          canCreate: false,
        }
      );
    }

    context.spellcastingInfo = FoundryAdapter.getSpellcastingInfo(this.actor, spells);

    // Section spells
    // TODO: Take over `_prepareSpellbook` and
    // - have custom sectioning built right into the process
    // - set up `key` in the spellbook prep code, just like `prop`
    const spellbook = SheetSections.prepareTidySpellbook(
      context,
      spells,
      {
        canCreate: true,
      },
      this
    );

    // Section Favorite Spells
    const favoriteSpellbook = SheetSections.prepareTidySpellbook(
      context,
      favorites.spells,
      {
        canCreate: false,
      },
      this
    );

    // Process Special Feature Item Context
    classes = SheetSections.prepareClassItems(
      context,
      classes,
      subclasses,
      this.actor
    );

    // Put unmatched subclasses into features so they don't disappear
    for (const subclass of subclasses) {
      feats.push(subclass);
      const message = game.i18n.format('DND5E.SubclassMismatchWarn', {
        name: subclass.name,
        class: subclass.system.classIdentifier,
      });
      context.warnings.push({ message, type: 'warning' });
    }

    // Process Special Favorite Feature Item Context
    favorites.classes = SheetSections.prepareClassItems(
      context,
      favorites.classes,
      favorites.subclasses,
      this.actor
    );

    for (const subclass of favorites.subclasses) {
      favorites.feats.push(subclass);
    }

    // Section Features
    const features: Record<string, CharacterFeatureSection> =
      CharacterSheetSections.buildFeaturesSections(
        species,
        backgrounds,
        classes,
        feats,
        {
          canCreate: true,
        }
      );

    // Section favorite features
    const favoriteFeatures: Record<string, CharacterFeatureSection> =
      CharacterSheetSections.buildFeaturesSections(
        favorites.species,
        favorites.backgrounds,
        favorites.classes,
        favorites.feats,
        { canCreate: false }
      );

    // Apply sections to their section lists

    context.inventory = Object.values(inventory);

    context.spellbook = spellbook;

    context.features = Object.values(features);

    context.favorites = [
      ...Object.values(favoriteInventory)
        .filter((i) => i.items.length)
        .map((i) => ({
          ...i,
          type: CONSTANTS.TAB_ACTOR_INVENTORY,
        })),
      ...Object.values(favoriteFeatures)
        .filter((i) => i.items.length)
        .map((i) => ({
          ...i,
          type: CONSTANTS.TAB_CHARACTER_FEATURES,
        })),
      ...favoriteSpellbook
        .filter((s: SpellbookSection) => s.spells.length)
        .map((s: SpellbookSection) => ({
          ...s,
          type: CONSTANTS.TAB_CHARACTER_SPELLBOOK,
        })),
    ];
  }

  private _getFavoritesIdMap(): Map<string, CharacterFavorite> {
    return this.actor.system.favorites.reduce(
      (map: Map<string, CharacterFavorite>, f: CharacterFavorite) => {
        map.set(f.id, f);
        return map;
      },
      new Map<string, CharacterFavorite>()
    );
  }

  /**
   * A helper method to establish the displayed preparation state for an item.
   * @param {Item5e} item     Item being prepared for display.
   * @param {object} context  Context data for display.
   * @protected
   */
  protected _prepareItem(item: Item5e, context: CharacterItemContext) {
    if (item.type === CONSTANTS.ITEM_TYPE_SPELL) {
      const prep = item.system.preparation || {};
      const isAlways = prep.mode === 'always';
      const isPrepared = !!prep.prepared;
      context.toggleClass = isPrepared ? 'active' : '';
      if (isAlways) {
        context.toggleClass = 'fixed';
        context.toggleTitle = CONFIG.DND5E.spellPreparationModes.always.label;
      } else if (isPrepared) {
        context.toggleTitle = CONFIG.DND5E.spellPreparationModes.prepared.label;
      } else {
        context.toggleTitle = game.i18n.localize('DND5E.SpellUnprepared');
      }

      if (this._concentration.items.has(item)) {
        context.concentration = true;
      }
    } else {
      const isActive = !!item.system.equipped;
      context.toggleClass = isActive ? 'active' : '';
      context.toggleTitle = game.i18n.localize(
        isActive ? 'DND5E.Equipped' : 'DND5E.Unequipped'
      );
      context.canToggle = 'equipped' in item.system;
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

  onToggleAbilityProficiency(event: Event) {
    return this._onToggleAbilityProficiency(event);
  }

  onShortRest(event: Event) {
    return this._onShortRest(event);
  }

  onLongRest(event: Event) {
    return this._onLongRest(event);
  }

  async _onDropSingleItem(itemData: any) {
    // Create a Consumable spell scroll on the Inventory tab
    if (
      itemData.type === CONSTANTS.ITEM_TYPE_SPELL &&
      this.currentTabId === CONSTANTS.TAB_ACTOR_INVENTORY
    ) {
      const options: Record<string, unknown> = {};

      if (SettingsProvider.settings.includeFlagsInSpellScrollCreation.get()) {
        options.flags = itemData.flags;
      }

      const scroll = await dnd5e.documents.Item5e.createScrollFromSpell(
        itemData,
        options
      );

      return scroll.toObject();
    }

    return super._onDropSingleItem(itemData);
  }

  close(options: unknown = {}) {
    this._destroySvelteComponent();
    this.subscriptionsService.unsubscribeAll();
    delete game.user.apps[this.id];
    return super.close(options);
  }

  submit(): void {
    super.submit();
  }

  async _onSubmit(...args: any[]) {
    await super._onSubmit(...args);
    this.stats.update((stats) => {
      stats.lastSubmissionTime = new Date();
      return stats;
    });
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
    SheetSections.accountForExternalSections(
      ['actions', 'favorites', 'inventory', 'spellbook', 'features'],
      data
    );
    this.context.set(data);

    if (force) {
      const { width, height } =
        SheetPreferencesService.getByType(this.actor.type) ?? {};
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
        SettingsProvider.settings.colorScheme.get(),
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
    data: CharacterSheetContext;
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

  _disableFields(...args: any[]) {
    debug('Ignoring call to disable fields. Delegating to Tidy Sheets...');
  }

  _onResize(event: any) {
    super._onResize(event);
    const { width, height } = this.position;
    SheetPreferencesService.setDocumentTypePreference(
      this.actor.type,
      'width',
      width
    );
    SheetPreferencesService.setDocumentTypePreference(
      this.actor.type,
      'height',
      height
    );
  }

  async _onDrop(event: DragEvent & { target: HTMLElement }) {
    if (!event.target.closest('[data-tidy-favorites]'))
      return super._onDrop(event);
    const dragData = event.dataTransfer?.getData('text/plain');
    if (!dragData) return super._onDrop(event);
    let data;
    try {
      data = JSON.parse(dragData);
    } catch (e) {
      console.error(e);
      return;
    }

    let type = 'item' as const;
    let id = (await fromUuid(data.uuid)).getRelativeUUID(this.actor);

    return this._onDropFavorite(event, { type, id });
  }

  _prepareTraits(systemData: any) {
    const traits = super._prepareTraits(systemData);

    const selectedWeaponProfs = traits.traits?.weaponProf?.selected;
    for (let key of systemData.traits?.weaponProf?.mastery?.value ?? []) {
      if (!Object.hasOwn(selectedWeaponProfs, key)) {
        selectedWeaponProfs[key] =
          dnd5e.documents.Trait.keyLabel(key, { trait: 'weapon' }) ?? key;
      }
    }

    return traits;
  }

  /* -------------------------------------------- */
  /* Favorites
  /* -------------------------------------------- */

  /**
   * Handle an owned item or effect being dropped in the favorites area.
   * @param {PointerEvent} event         The triggering event.
   * @param {ActorFavorites5e} favorite  The favorite that was dropped.
   * @returns {Promise<Actor5e>|void}
   * @protected
   */
  async _onDropFavorite(
    event: DragEvent & { target: HTMLElement },
    favorite: UnsortedCharacterFavorite
  ) {
    if (this.actor.system.hasFavorite(favorite.id))
      return await this._onSortFavorites(event, favorite.id);
    // If we don't own the item, handle onDrop and then turn around and add it as a favorite?
    return await this.actor.system.addFavorite(favorite);
  }

  /**
   * Handle re-ordering the favorites list.
   * @param {DragEvent} event  The drop event.
   * @param {string} srcId     The identifier of the dropped favorite.
   * @returns {Promise<Actor5e>|void}
   * @protected
   */
  async _onSortFavorites(
    event: DragEvent & { target: HTMLElement },
    srcId: string
  ) {
    const targetId = event.target
      ?.closest('[data-favorite-id]')
      ?.getAttribute('data-favorite-id');
    if (!targetId) return;
    let source;
    let target;
    if (srcId === targetId) return;
    const siblings = this.actor.system.favorites.filter(
      (f: CharacterFavorite) => {
        if (f.id === targetId) target = f;
        else if (f.id === srcId) source = f;
        return f.id !== srcId;
      }
    );
    const updates = SortingHelpers.performIntegerSort(source, {
      target,
      siblings,
    });
    const favorites = this.actor.system.favorites.reduce(
      (map: Map<string, CharacterFavorite>, f: CharacterFavorite) =>
        map.set(f.id, { ...f }),
      new Map<string, CharacterFavorite>()
    );
    for (const { target, update } of updates) {
      const favorite = favorites.get(target.id);
      foundry.utils.mergeObject(favorite, update);
    }
    return await this.actor.update({
      'system.favorites': Array.from(favorites.values()),
    });
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

function getActorClassesToImages(actor: Actor5e): Record<string, string> {
  let actorClassesToImages: Record<string, string> = {};
  for (let item of actor.items) {
    if (item.type == CONSTANTS.ITEM_TYPE_CLASS) {
      let className = item.name.toLowerCase();
      let classImg = item.img;
      actorClassesToImages[className] = classImg;
    }
  }
  return actorClassesToImages;
}
