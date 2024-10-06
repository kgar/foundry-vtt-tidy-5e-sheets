import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type {
  ItemCardStore,
  NpcSheetContext,
  SearchFilterCacheable,
  LocationToSearchTextMap,
  SheetExpandedItemsCacheable,
  SheetStats,
  SheetTabCacheable,
  ExpandedItemIdToLocationsMap,
  ExpandedItemData,
  MessageBus,
  MessageBusMessage,
  Utilities,
  ActiveEffect5e,
  NpcAbilitySection,
  ActorInventoryTypes,
} from 'src/types/types';
import { writable } from 'svelte/store';
import NpcSheet from './npc/NpcSheet.svelte';
import { CONSTANTS } from 'src/constants';
import {
  applySheetAttributesToWindow,
  applyThemeDataAttributeToWindow,
  applyTitleToWindow,
  blurButtonsOnClick,
  maintainCustomContentInputFocus,
} from 'src/utils/applications';
import { debug, error } from 'src/utils/logging';
import { getCurrentSettings, SettingsProvider } from 'src/settings/settings';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import { getPercentage } from 'src/utils/numbers';
import type { SvelteComponent } from 'svelte';
import type { Item5e, ItemChatData } from 'src/types/item.types';
import { NpcSheetRuntime } from 'src/runtime/NpcSheetRuntime';
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
import { SheetSections } from 'src/features/sections/SheetSections';
import { NpcSheetSections } from 'src/features/sections/NpcSheetSections';
import { DocumentTabSectionConfigApplication } from 'src/applications/section-config/DocumentTabSectionConfigApplication';
import { BaseSheetCustomSectionMixin } from './mixins/BaseSheetCustomSectionMixin';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { Inventory } from 'src/features/sections/Inventory';
import { Container } from 'src/features/containers/Container';
import { InlineContainerToggleService } from 'src/features/containers/InlineContainerToggleService';
import { ConditionsAndEffects } from 'src/features/conditions-and-effects/ConditionsAndEffects';

export class Tidy5eNpcSheet
  extends BaseSheetCustomSectionMixin(
    (object) => object.items,
    dnd5e.applications.actor.ActorSheet5eNPC
  )
  implements
    SheetTabCacheable,
    SheetExpandedItemsCacheable,
    SearchFilterCacheable
{
  context = writable<NpcSheetContext>();
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

    this.currentTabId = SettingsProvider.settings.initialNpcSheetTab.get();
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
        CONSTANTS.SHEET_TYPE_NPC,
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
      SettingsProvider.getSettingsChangedSubscription(this, () => {
        applyThemeDataAttributeToWindow(
          SettingsProvider.settings.colorScheme.get(),
          this.element.get(0)
        );
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

    this.component = new NpcSheet({
      target: node,
      context: new Map<any, any>([
        [CONSTANTS.SVELTE_CONTEXT.APP_ID, this.appId],
        [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this.context],
        [CONSTANTS.SVELTE_CONTEXT.MESSAGE_BUS, this.messageBus],
        [CONSTANTS.SVELTE_CONTEXT.STATS, this.stats],
        [CONSTANTS.SVELTE_CONTEXT.CARD, this.card],
        [CONSTANTS.SVELTE_CONTEXT.CURRENT_TAB_ID, this.currentTabId],
        [
          CONSTANTS.SVELTE_CONTEXT.INLINE_CONTAINER_TOGGLE_SERVICE,
          this.inlineContainerToggleService,
        ],
        [CONSTANTS.SVELTE_CONTEXT.ITEM_FILTER_SERVICE, this.itemFilterService],
        [
          CONSTANTS.SVELTE_CONTEXT.ON_TAB_SELECTED,
          this.onTabSelected.bind(this),
        ],
        [
          CONSTANTS.SVELTE_CONTEXT.ON_ITEM_TOGGLED,
          this.onItemToggled.bind(this),
        ],
        [CONSTANTS.SVELTE_CONTEXT.SEARCH_FILTERS, new Map(this.searchFilters)],
        [
          CONSTANTS.SVELTE_CONTEXT.ON_FILTER,
          this.itemFilterService.onFilter.bind(this.itemFilterService),
        ],
        [
          CONSTANTS.SVELTE_CONTEXT.ON_FILTER_CLEAR_ALL,
          this.itemFilterService.onFilterClearAll.bind(this.itemFilterService),
        ],
        [CONSTANTS.SVELTE_CONTEXT.ON_SEARCH, this.onSearch.bind(this)],
        [CONSTANTS.SVELTE_CONTEXT.LOCATION, ''],
        [CONSTANTS.SVELTE_CONTEXT.EXPANDED_ITEMS, new Map(this.expandedItems)],
        [
          CONSTANTS.SVELTE_CONTEXT.EXPANDED_ITEM_DATA,
          new Map(this.expandedItemData),
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
      ]),
    });

    initTidy5eContextMenu(this, html);
  }

  async getData(options = {}) {
    this._concentration = this.actor.concentration;

    const defaultDocumentContext = await super.getData(this.options);

    Tidy5eBaseActorSheet.applyCommonContext(defaultDocumentContext);

    const npcPreferences = SheetPreferencesService.getByType(this.actor.type);

    const abilitiesSortMode =
      npcPreferences.tabs?.[CONSTANTS.TAB_NPC_ABILITIES]?.sort ?? 'm';

    const spellbookSortMode =
      npcPreferences.tabs?.[CONSTANTS.TAB_NPC_SPELLBOOK]?.sort ?? 'm';

    const actionListSortMode =
      npcPreferences.tabs?.[CONSTANTS.TAB_ACTOR_ACTIONS]?.sort ?? 'm';

    const inventorySortMode =
      npcPreferences.tabs?.[CONSTANTS.TAB_ACTOR_INVENTORY]?.sort ?? 'm';

    const unlocked =
      FoundryAdapter.isActorSheetUnlocked(this.actor) &&
      defaultDocumentContext.editable;

    const lockSensitiveFields =
      (!unlocked && SettingsProvider.settings.useTotalSheetLock.get()) ||
      !defaultDocumentContext.editable;

    let maxPreparedSpellsTotal = 0;
    try {
      const formula = TidyFlags.maxPreparedSpells.get(this.actor) ?? '';

      if (formula?.trim() !== '') {
        const roll = await Roll.create(
          formula,
          this.actor.getRollData()
        ).evaluate();
        maxPreparedSpellsTotal = roll.total;
      }
    } catch (e) {
      error('Unable to calculate max prepared spells', false, e);
    }

    const showLegendaryToolbarFlagValue = TidyFlags.showLegendaryToolbar.get(
      this.actor
    );
    const res = this.actor.system.resources;
    const showLegendaryToolbar =
      showLegendaryToolbarFlagValue === true ||
      (showLegendaryToolbarFlagValue === undefined &&
        ((res.legact?.max ?? 0) > 0 ||
          (res.legres?.max ?? 0) > 0 ||
          res.lair?.value === true ||
          res.lair?.initiative !== null));

    let utilities: Utilities<NpcSheetContext> = {
      [CONSTANTS.TAB_NPC_ABILITIES]: {
        utilityToolbarCommands: [
          {
            title: FoundryAdapter.localize(
              'TIDY5E.Commands.ShowLegendaryToolbar'
            ),
            iconClass: 'ra ra-player',
            execute: async () => {
              await TidyFlags.showLegendaryToolbar.set(this.actor, true);
            },
            visible: !showLegendaryToolbar,
          },
          {
            title: FoundryAdapter.localize(
              'TIDY5E.Commands.HideLegendaryToolbar'
            ),
            iconClass: 'ra ra-monster-skull',
            execute: async () => {
              await TidyFlags.showLegendaryToolbar.set(this.actor, false);
            },
            visible: showLegendaryToolbar,
          },
          {
            title: FoundryAdapter.localize('SIDEBAR.SortModeAlpha'),
            iconClass: 'fa-solid fa-arrow-down-a-z fa-fw',
            execute: async () => {
              await SheetPreferencesService.setDocumentTypeTabPreference(
                this.actor.type,
                CONSTANTS.TAB_NPC_ABILITIES,
                'sort',
                'm'
              );
            },
            visible: abilitiesSortMode === 'a',
          },
          {
            title: FoundryAdapter.localize('SIDEBAR.SortModeManual'),
            iconClass: 'fa-solid fa-arrow-down-short-wide fa-fw',
            execute: async () => {
              await SheetPreferencesService.setDocumentTypeTabPreference(
                this.actor.type,
                CONSTANTS.TAB_NPC_ABILITIES,
                'sort',
                'a'
              );
            },
            visible: abilitiesSortMode === 'm',
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
              !SettingsProvider.settings.showSpellbookTabNpc.get() &&
              (npcPreferences?.spellSlotTrackerMode ??
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
              !SettingsProvider.settings.showSpellbookTabNpc.get() &&
              npcPreferences?.spellSlotTrackerMode ===
                CONSTANTS.SPELL_SLOT_TRACKER_MODE_VALUE_MAX,
          },
          {
            title: FoundryAdapter.localize('TIDY5E.Commands.ExpandAll'),
            iconClass: 'fas fa-angles-down',
            execute: () =>
              // TODO: Use app.messageBus
              this.messageBus.set({
                tabId: CONSTANTS.TAB_NPC_ABILITIES,
                message: CONSTANTS.MESSAGE_BUS_EXPAND_ALL,
              }),
          },
          {
            title: FoundryAdapter.localize('TIDY5E.Commands.CollapseAll'),
            iconClass: 'fas fa-angles-up',
            execute: () =>
              // TODO: Use app.messageBus
              this.messageBus.set({
                tabId: CONSTANTS.TAB_NPC_ABILITIES,
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
                tabId: CONSTANTS.TAB_NPC_ABILITIES,
                tabTitle: NpcSheetRuntime.getTabTitle(
                  CONSTANTS.TAB_NPC_ABILITIES
                ),
              }).render(true);
            },
          },
        ],
      },
      [CONSTANTS.TAB_NPC_SPELLBOOK]: {
        utilityToolbarCommands: [
          {
            title: FoundryAdapter.localize('SIDEBAR.SortModeAlpha'),
            iconClass: 'fa-solid fa-arrow-down-a-z fa-fw',
            execute: async () => {
              await SheetPreferencesService.setDocumentTypeTabPreference(
                this.actor.type,
                CONSTANTS.TAB_NPC_SPELLBOOK,
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
                CONSTANTS.TAB_NPC_SPELLBOOK,
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
              (npcPreferences?.spellSlotTrackerMode ??
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
              npcPreferences?.spellSlotTrackerMode ===
              CONSTANTS.SPELL_SLOT_TRACKER_MODE_VALUE_MAX,
          },
          {
            title: FoundryAdapter.localize('TIDY5E.Commands.ExpandAll'),
            iconClass: 'fas fa-angles-down',
            execute: () =>
              // TODO: Use app.messageBus
              this.messageBus.set({
                tabId: CONSTANTS.TAB_NPC_SPELLBOOK,
                message: CONSTANTS.MESSAGE_BUS_EXPAND_ALL,
              }),
          },
          {
            title: FoundryAdapter.localize('TIDY5E.Commands.CollapseAll'),
            iconClass: 'fas fa-angles-up',
            execute: () =>
              // TODO: Use app.messageBus
              this.messageBus.set({
                tabId: CONSTANTS.TAB_NPC_SPELLBOOK,
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
                tabId: CONSTANTS.TAB_NPC_SPELLBOOK,
                tabTitle: NpcSheetRuntime.getTabTitle(
                  CONSTANTS.TAB_NPC_SPELLBOOK
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
                tabTitle: NpcSheetRuntime.getTabTitle(
                  CONSTANTS.TAB_ACTOR_ACTIONS
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
                tabTitle: NpcSheetRuntime.getTabTitle(
                  CONSTANTS.TAB_ACTOR_INVENTORY
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

    const context: NpcSheetContext = {
      ...defaultDocumentContext,
      actions: await getActorActionSections(this.actor),
      activateEditors: (node, options) =>
        FoundryAdapter.activateEditors(node, this, options?.bindSecrets),
      actorPortraitCommands:
        ActorPortraitRuntime.getEnabledPortraitMenuCommands(this.actor),
      allowEffectsManagement: true,
      appearanceEnrichedHtml: await FoundryAdapter.enrichHtml(
        TidyFlags.appearance.get(this.actor) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      appId: this.appId,
      biographyEnrichedHtml: await FoundryAdapter.enrichHtml(
        FoundryAdapter.getProperty<string>(
          this.actor,
          `system.details.biography.value`
        ) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      bondEnrichedHtml: await FoundryAdapter.enrichHtml(
        this.actor.system.details.bond,
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          async: true,
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
      customContent: await NpcSheetRuntime.getContent(defaultDocumentContext),
      useClassicControls:
        SettingsProvider.settings.useClassicControlsForNpc.get(),
      effects: enhancedEffectSections,
      editable: defaultDocumentContext.editable,
      encumbrance: this.actor.system.attributes.encumbrance,
      filterData: this.itemFilterService.getDocumentItemFilterData(),
      filterPins: ItemFilterRuntime.defaultFilterPins[this.actor.type],
      flawEnrichedHtml: await FoundryAdapter.enrichHtml(
        this.actor.system.details.flaw,
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      hideEmptySpellbook:
        lockSensitiveFields && defaultDocumentContext.spellbook.length === 0,
      healthPercentage: getPercentage(
        this.actor?.system?.attributes?.hp?.value,
        this.actor?.system?.attributes?.hp?.max
      ),
      showSpellbookTab: SettingsProvider.settings.showSpellbookTabNpc.get(),
      idealEnrichedHtml: await FoundryAdapter.enrichHtml(
        this.actor.system.details.ideal,
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      showContainerPanel:
        TidyFlags.showContainerPanel.get(this.actor) === true &&
        Array.from(defaultDocumentContext.items).some(
          (i: Item5e) => i.type === CONSTANTS.ITEM_TYPE_CONTAINER
        ),
      showLegendaryToolbar: showLegendaryToolbar,
      lockSensitiveFields: lockSensitiveFields,
      longRest: this._onLongRest.bind(this),
      lockExpChanges: FoundryAdapter.shouldLockExpChanges(),
      lockHpMaxChanges: FoundryAdapter.shouldLockHpMaxChanges(),
      lockItemQuantity: FoundryAdapter.shouldLockItemQuantity(),
      lockLevelSelector: FoundryAdapter.shouldLockLevelSelector(),
      lockMoneyChanges: FoundryAdapter.shouldLockMoneyChanges(),
      maxPreparedSpellsTotal,
      notes1EnrichedHtml: await FoundryAdapter.enrichHtml(
        TidyFlags.notes1.members.value.get(this.actor) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      notes2EnrichedHtml: await FoundryAdapter.enrichHtml(
        TidyFlags.notes2.members.value.get(this.actor) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      notes3EnrichedHtml: await FoundryAdapter.enrichHtml(
        TidyFlags.notes3.members.value.get(this.actor) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      notes4EnrichedHtml: await FoundryAdapter.enrichHtml(
        TidyFlags.notes4.members.value.get(this.actor) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      notesEnrichedHtml: await FoundryAdapter.enrichHtml(
        TidyFlags.notes.members.value.get(this.actor) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      owner: this.actor.isOwner,
      preparedSpells: FoundryAdapter.countPreparedSpells(
        defaultDocumentContext.items
      ),
      settings: getCurrentSettings(),
      shortRest: this._onShortRest.bind(this),
      showLimitedSheet: FoundryAdapter.showLimitedSheet(this.actor),
      spellCalculations: calculateSpellAttackAndDc(this.actor),
      spellSlotTrackerMode:
        npcPreferences.spellSlotTrackerMode ??
        CONSTANTS.SPELL_SLOT_TRACKER_MODE_PIPS,
      tabs: [],
      tokenState: this.#getTokenState(),
      traitEnrichedHtml: await FoundryAdapter.enrichHtml(
        TidyFlags.trait.get(this.actor) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
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

    for (const panelItem of context.containerPanelItems) {
      const ctx = context.itemContext[panelItem.container.id];
      ctx.containerContents = await Container.getContainerContents(
        panelItem.container
      );
    }

    let tabs = await NpcSheetRuntime.getTabs(context);

    const selectedTabs = TidyFlags.selectedTabs.get(context.actor);

    if (selectedTabs?.length) {
      tabs = tabs
        .filter((t) => selectedTabs?.includes(t.id))
        .sort(
          (a, b) => selectedTabs.indexOf(a.id) - selectedTabs.indexOf(b.id)
        );
    } else {
      const defaultTabs = SettingsProvider.settings.defaultNpcSheetTabs.get();
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

    debug('NPC Sheet context data', context);

    return context;
  }

  protected _prepareItems(context: NpcSheetContext) {
    // Categorize Items as Features and Spells
    const features: Record<string, NpcAbilitySection> = {
      [CONSTANTS.NPC_ABILITY_SECTION_WEAPONS]: {
        label: game.i18n.localize('DND5E.AttackPl'),
        items: [],
        hasActions: true,
        dataset: {
          type: CONSTANTS.ITEM_TYPE_WEAPON,
          'system.weaponType': 'natural',
        },
        canCreate: true,
        key: 'weapons',
        show: true,
      },
      [CONSTANTS.NPC_ABILITY_SECTION_ACTIONS]: {
        label: game.i18n.localize('DND5E.ActionPl'),
        items: [],
        hasActions: true,
        dataset: {
          type: CONSTANTS.ITEM_TYPE_FEAT,
          'system.activation.type': 'action',
        },
        canCreate: true,
        key: 'actions',
        show: true,
      },
      [CONSTANTS.NPC_ABILITY_SECTION_PASSIVE]: {
        label: game.i18n.localize('DND5E.Features'),
        items: [],
        dataset: { type: CONSTANTS.ITEM_TYPE_FEAT },
        canCreate: true,
        key: 'passive',
        show: true,
      },
      [CONSTANTS.NPC_ABILITY_SECTION_EQUIPMENT]: {
        label: game.i18n.localize('DND5E.Inventory'),
        items: [],
        dataset: { type: CONSTANTS.ITEM_TYPE_LOOT },
        canCreate: true,
        key: 'equipment',
        show: true,
      },
      [CONSTANTS.NPC_ABILITY_SECTION_CLASSES]: {
        label: `${CONFIG.Item.typeLabels.class}Pl`,
        items: [],
        dataset: { type: CONSTANTS.ITEM_TYPE_CLASS },
        canCreate: true,
        key: 'classes',
        show: true,
        isClass: true,
      },
    };

    // Start by classifying items into groups for rendering
    let { spells, classes, subclasses, other } = context.items.reduce<{
      spells: Item5e[];
      classes: Item5e[];
      subclasses: Item5e[];
      other: Item5e[];
    }>(
      (features, item) => {
        const { quantity, uses, target } = item.system;
        const ctx = (context.itemContext[item.id] ??= {});
        ctx.attunement = FoundryAdapter.getAttunementContext(item);
        ctx.isStack = Number.isNumeric(quantity) && quantity !== 1;
        ctx.hasUses = uses && uses.max > 0;
        ctx.hasTarget = !!target && !['none', ''].includes(target.type);
        ctx.canToggle = 'equipped' in item.system;

        ctx.totalWeight = item.system.totalWeight?.toNearest(0.1);
        if (item.type === CONSTANTS.ITEM_TYPE_SPELL) {
          if (this._concentration.items.has(item)) {
            ctx.concentration = true;
          }
          features.spells.push(item);
        } else if (item.type === CONSTANTS.ITEM_TYPE_CLASS) {
          features.classes.push(item);
        } else if (item.type === CONSTANTS.ITEM_TYPE_SUBCLASS) {
          features.subclasses.push(item);
        } else {
          features.other.push(item);
        }
        return features;
      },
      { spells: [], subclasses: [], classes: [], other: [] }
    );

    classes = SheetSections.prepareClassItems(
      context,
      classes,
      subclasses,
      this.actor
    );

    for (const subclass of subclasses) {
      const message = game.i18n.format('DND5E.SubclassMismatchWarn', {
        name: subclass.name,
        class: subclass.system.classIdentifier,
      });
      context.warnings.push({ message, type: 'warning' });
    }

    other = [...other, ...subclasses];

    features.classes.items = classes;

    const inventoryTypesArray = Inventory.getDefaultInventoryTypes();
    const inventoryTypes = new Set(inventoryTypesArray);
    const inventory: ActorInventoryTypes =
      Inventory.getDefaultInventorySections();

    // Organize Features
    for (let item of other) {
      if (inventoryTypes.has(item.type)) {
        Inventory.applyInventoryItemToSection(
          inventory,
          item,
          inventoryTypesArray,
          {
            canCreate: true,
          }
        );
      }
      // Handle custom section, if present
      if (TidyFlags.section.get(item)) {
        NpcSheetSections.applyAbilityToSection(features, item, {
          canCreate: true,
        });
      } else if (item.type === CONSTANTS.ITEM_TYPE_WEAPON)
        features.weapons.items.push(item);
      else if (
        [
          CONSTANTS.ITEM_TYPE_BACKGROUND,
          CONSTANTS.ITEM_TYPE_CLASS,
          CONSTANTS.ITEM_TYPE_FEAT,
          CONSTANTS.ITEM_TYPE_RACE,
          CONSTANTS.ITEM_TYPE_SUBCLASS,
        ].includes(item.type)
      ) {
        if (item.system.activation?.type) {
          features.actions.items.push(item);
        } else {
          // TODO: Partition classes/subclasses to their own area; this may have to happen in the original partition of the spells / other arrays.
          features.passive.items.push(item);
        }
      } else features.equipment.items.push(item);
    }

    // Organize Spellbook
    // Section spells
    // TODO: Take over `_prepareSpellbook` and have custom sectioning built right in
    const spellbook = SheetSections.prepareTidySpellbook(
      context,
      spells,
      {
        canCreate: true,
      },
      this
    );

    context.features = Object.values(features);
    context.spellbook = spellbook;
    context.inventory = Object.values(inventory);
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

  #getTokenState(): 'linked' | 'unlinked' | null {
    const { token } = this;

    const showNpcActorLinkMarker =
      SettingsProvider.settings.showNpcActorLinkMarker.get();

    if (!token) {
      return null;
    }

    if (token.actorLink && showNpcActorLinkMarker == 'both') {
      return 'linked';
    }

    if (
      !token.actorLink &&
      (showNpcActorLinkMarker == 'unlinked' || showNpcActorLinkMarker == 'both')
    ) {
      return 'unlinked';
    }

    return null;
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
    SheetSections.accountForExternalSections(['features', 'spellbook'], data);
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
      if (!SettingsProvider.settings.useAccessibleKeyboardSupport.get()) {
        blurButtonsOnClick(this.element.get(0));
      }

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
    data: NpcSheetContext;
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

  /**
   * Take a short rest, calling the relevant function on the Actor instance.
   * @param {Event} event             The triggering click event.
   * @returns {Promise<RestResult>}  Result of the rest action.
   */
  async _onShortRest(event: Event) {
    event.preventDefault();
    await this._onSubmit(event);
    return this.actor.shortRest({
      chat: SettingsProvider.settings.showNpcRestInChat.get(),
    });
  }

  /**
   * Take a long rest, calling the relevant function on the Actor instance
   * @param {Event} event   The triggering click event
   * @private
   */
  async _onLongRest(event: Event) {
    event.preventDefault();
    await this._onSubmit(event);
    return this.actor.longRest({
      chat: SettingsProvider.settings.showNpcRestInChat.get(),
    });
  }

  async _onSubmit(...args: any[]) {
    await super._onSubmit(...args);
    this.stats.update((stats) => {
      stats.lastSubmissionTime = new Date();
      return stats;
    });
  }

  close(options: unknown = {}) {
    this._destroySvelteComponent();
    this.subscriptionsService.unsubscribeAll();
    delete game.user.apps[this.id];
    return super.close(options);
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
