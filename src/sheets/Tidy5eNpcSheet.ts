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
  SpellbookSection,
} from 'src/types/types';
import { writable } from 'svelte/store';
import NpcSheet from './npc/NpcSheet.svelte';
import { CONSTANTS } from 'src/constants';
import {
  applySheetAttributesToWindow,
  applyTitleToWindow,
  blurUntabbableButtonsOnClick,
  maintainCustomContentInputFocus,
} from 'src/utils/applications';
import { debug, error } from 'src/utils/logging';
import { SettingsProvider, settingStore } from 'src/settings/settings';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import { getPercentage, isLessThanOneIsOne } from 'src/utils/numbers';
import NpcShortRestDialog from 'src/dialogs/NpcShortRestDialog';
import type { SvelteComponent } from 'svelte';
import type { Item5e, ItemChatData } from 'src/types/item.types';
import { NpcSheetRuntime } from 'src/runtime/NpcSheetRuntime';
import {
  actorUsesActionFeature,
  getActorActions,
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
import { SheetPreferencesRuntime } from 'src/runtime/user-preferences/SheetPreferencesRuntime';
import { Tidy5eBaseActorSheet } from './Tidy5eBaseActorSheet';
import { SheetSections } from 'src/features/sections/SheetSections';
import { NpcSheetSections } from 'src/features/sections/NpcSheetSections';
import { TidyFlags } from 'src/api';

export class Tidy5eNpcSheet
  extends dnd5e.applications.actor.ActorSheet5eNPC
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
      classes: ['tidy5e-sheet', 'sheet', 'actor', CONSTANTS.SHEET_TYPE_NPC],
      width: 740,
      height: 810,
      scrollY: ['[data-tidy-track-scroll-y]', '.scroll-container'],
    });
  }

  component: SvelteComponent | undefined;
  activateListeners(html: { get: (index: 0) => HTMLElement }) {
    let first = true;
    this.subscriptionsService.registerSubscriptions(
      this.itemFilterService.filterData$.subscribe(() => {
        if (first) return;
        this.render();
      }),
      settingStore.subscribe(() => {
        if (first) return;
        this.render();
      }),
      this.messageBus.subscribe((m) => {
        debug('Message bus message received', {
          app: this,
          actor: this.actor,
          message: m,
        });
      }),
      SheetPreferencesRuntime.getStore().subscribe(() => {
        if (first) return;
        this.render();
      })
    );
    first = false;

    const node = html.get(0);
    this.card.set({ sheet: node, item: null, itemCardContentTemplate: null });

    this.component = new NpcSheet({
      target: node,
      context: new Map<any, any>([
        ['context', this.context],
        ['messageBus', this.messageBus],
        ['stats', this.stats],
        ['card', this.card],
        ['currentTabId', this.currentTabId],
        ['onTabSelected', this.onTabSelected.bind(this)],
        ['onItemToggled', this.onItemToggled.bind(this)],
        ['searchFilters', new Map(this.searchFilters)],
        [
          'onFilter',
          this.itemFilterService.onFilter.bind(this.itemFilterService),
        ],
        [
          'onFilterClearAll',
          this.itemFilterService.onFilterClearAll.bind(this.itemFilterService),
        ],
        ['onSearch', this.onSearch.bind(this)],
        ['location', ''],
        ['expandedItems', new Map(this.expandedItems)],
        ['expandedItemData', new Map(this.expandedItemData)],
        [
          'itemTableToggles',
          new Map(this.itemTableTogglesCache.itemTableToggles),
        ],
        [
          'onItemTableToggle',
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

    const unlocked =
      FoundryAdapter.isActorSheetUnlocked(this.actor) &&
      defaultDocumentContext.editable;

    const lockSensitiveFields =
      (!unlocked && SettingsProvider.settings.useTotalSheetLock.get()) ||
      !defaultDocumentContext.editable;

    let maxPreparedSpellsTotal = 0;
    try {
      const formula =
        FoundryAdapter.tryGetFlag(
          this.actor,
          'maxPreparedSpells'
        )?.toString() ?? '';

      if (formula?.trim() !== '') {
        const roll = await Roll.create(
          formula,
          this.actor.getRollData()
        ).evaluate({ async: true });
        maxPreparedSpellsTotal = roll.total;
      }
    } catch (e) {
      error('Unable to calculate max prepared spells', false, e);
    }

    const showLegendaryToolbarFlagValue = FoundryAdapter.tryGetFlag(
      this.actor,
      'show-legendary-toolbar'
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
              await FoundryAdapter.setFlag(
                this.actor,
                'show-legendary-toolbar',
                true
              );
            },
            visible: !showLegendaryToolbar,
          },
          {
            title: FoundryAdapter.localize(
              'TIDY5E.Commands.HideLegendaryToolbar'
            ),
            iconClass: 'ra ra-monster-skull',
            execute: async () => {
              await FoundryAdapter.setFlag(
                this.actor,
                'show-legendary-toolbar',
                false
              );
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
            visible: !FoundryAdapter.tryGetFlag(this.actor, 'spellbook-grid'),
            execute: () => {
              FoundryAdapter.setFlag(this.actor, 'spellbook-grid', true);
            },
          },
          {
            title: FoundryAdapter.localize('TIDY5E.GridLayout'),
            iconClass: 'fas fa-th-large fa-fw toggle-grid',
            visible: !!FoundryAdapter.tryGetFlag(this.actor, 'spellbook-grid'),
            execute: () => {
              FoundryAdapter.unsetFlag(this.actor, 'spellbook-grid');
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
        ],
      },
    };

    const context: NpcSheetContext = {
      ...defaultDocumentContext,
      actions: getActorActions(this.actor, this.itemFilterService),
      activateEditors: (node, options) =>
        FoundryAdapter.activateEditors(node, this, options?.bindSecrets),
      actorPortraitCommands:
        ActorPortraitRuntime.getEnabledPortraitMenuCommands(this.actor),
      allowEffectsManagement: true,
      appearanceEnrichedHtml: await FoundryAdapter.enrichHtml(
        FoundryAdapter.getProperty<string>(
          this.actor,
          `flags.${CONSTANTS.MODULE_ID}.appearance`
        ) ?? '',
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
        FoundryAdapter.getProperty<string>(
          this.actor,
          `flags.${CONSTANTS.MODULE_ID}.bond`
        ) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      customActorTraits: CustomActorTraitsRuntime.getEnabledTraits(
        defaultDocumentContext
      ),
      customContent: await NpcSheetRuntime.getContent(defaultDocumentContext),
      useClassicControls:
        SettingsProvider.settings.useClassicControlsForNpc.get(),
      encumbrance: this.actor.system.attributes.encumbrance,
      editable: defaultDocumentContext.editable,
      filterData: this.itemFilterService.getDocumentItemFilterData(),
      filterPins: ItemFilterRuntime.defaultFilterPins[this.actor.type],
      flawEnrichedHtml: await FoundryAdapter.enrichHtml(
        FoundryAdapter.getProperty<string>(
          this.actor,
          `flags.${CONSTANTS.MODULE_ID}.flaw`
        ) ?? '',
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
        FoundryAdapter.getProperty<string>(
          this.actor,
          `flags.${CONSTANTS.MODULE_ID}.ideal`
        ) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
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
        FoundryAdapter.getProperty<string>(
          this.actor,
          `flags.${CONSTANTS.MODULE_ID}.notes1.value`
        ) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      notes2EnrichedHtml: await FoundryAdapter.enrichHtml(
        FoundryAdapter.getProperty<string>(
          this.actor,
          `flags.${CONSTANTS.MODULE_ID}.notes2.value`
        ) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      notes3EnrichedHtml: await FoundryAdapter.enrichHtml(
        FoundryAdapter.getProperty<string>(
          this.actor,
          `flags.${CONSTANTS.MODULE_ID}.notes3.value`
        ) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      notes4EnrichedHtml: await FoundryAdapter.enrichHtml(
        FoundryAdapter.getProperty<string>(
          this.actor,
          `flags.${CONSTANTS.MODULE_ID}.notes4.value`
        ) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          async: true,
          relativeTo: this.actor,
        }
      ),
      notesEnrichedHtml: await FoundryAdapter.enrichHtml(
        FoundryAdapter.getProperty<string>(
          this.actor,
          `flags.${CONSTANTS.MODULE_ID}.notes.value`
        ) ?? '',
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
      shortRest: this._onShortRest.bind(this),
      showLimitedSheet: FoundryAdapter.showLimitedSheet(this.actor),
      spellCalculations: calculateSpellAttackAndDc(this.actor),
      spellSlotTrackerMode:
        npcPreferences.spellSlotTrackerMode ??
        CONSTANTS.SPELL_SLOT_TRACKER_MODE_PIPS,
      tabs: [],
      tokenState: this.#getTokenState(),
      traitEnrichedHtml: await FoundryAdapter.enrichHtml(
        FoundryAdapter.getProperty<string>(
          this.actor,
          `flags.${CONSTANTS.MODULE_ID}.trait`
        ) ?? '',
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

    let tabs = await NpcSheetRuntime.getTabs(context);

    const selectedTabs = FoundryAdapter.tryGetFlag<string[]>(
      context.actor,
      'selected-tabs'
    );

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

    debug('NPC Sheet context data', context);

    return context;
  }

  protected _prepareItems(context: NpcSheetContext) {
    // Categorize Items as Features and Spells
    const features: Record<string, NpcAbilitySection> = {
      weapons: {
        label: game.i18n.localize('DND5E.AttackPl'),
        items: [],
        hasActions: true,
        dataset: { type: 'weapon', 'weapon-type': 'natural' },
        canCreate: true,
        key: 'weapons',
      },
      actions: {
        label: game.i18n.localize('DND5E.ActionPl'),
        items: [],
        hasActions: true,
        dataset: { type: 'feat', 'activation.type': 'action' },
        canCreate: true,
        key: 'actions',
      },
      passive: {
        label: game.i18n.localize('DND5E.Features'),
        items: [],
        dataset: { type: 'feat' },
        canCreate: true,
        key: 'passive',
      },
      equipment: {
        label: game.i18n.localize('DND5E.Inventory'),
        items: [],
        dataset: { type: 'loot' },
        canCreate: true,
        key: 'equipment',
      },
    };

    // Start by classifying items into groups for rendering
    let [spells, other] = context.items.reduce(
      (arr, item) => {
        const { quantity, uses, recharge, target } = item.system;
        const ctx = (context.itemContext[item.id] ??= {});
        ctx.isStack = Number.isNumeric(quantity) && quantity !== 1;
        ctx.hasUses = uses && uses.max > 0;
        ctx.isOnCooldown =
          recharge && !!recharge.value && recharge.charged === false;
        ctx.isDepleted = item.isOnCooldown && uses.per && uses.value > 0;
        ctx.hasTarget = !!target && !['none', ''].includes(target.type);
        ctx.canToggle = false;
        if (item.type === 'spell') {
          if (this._concentration.items.has(item)) {
            ctx.concentration = true;
          }
          arr[0].push(item);
        } else {
          arr[1].push(item);
        }
        return arr;
      },
      [[], []]
    );

    const showSpellbookTab =
      SettingsProvider.settings.showSpellbookTabNpc.get();

    const spellbookTabId = showSpellbookTab
      ? CONSTANTS.TAB_NPC_SPELLBOOK
      : CONSTANTS.TAB_NPC_ABILITIES;

    const npcPreferences = SheetPreferencesService.getByType(this.actor.type);

    const abilitiesSortMode =
      npcPreferences.tabs?.[CONSTANTS.TAB_NPC_ABILITIES]?.sort ?? 'm';

    const spellbookSortMode =
      npcPreferences.tabs?.[spellbookTabId]?.sort ?? 'm';

    // Organize Abilities Sections
    // Filter Abilities section contents
    other = this.itemFilterService.filter(other, CONSTANTS.TAB_NPC_ABILITIES);

    // Sort Abilities section contents
    if (abilitiesSortMode === 'a') {
      other = other.toSorted((a: Item5e, b: Item5e) =>
        a.name.localeCompare(b.name)
      );
    }

    // Organize Spellbook
    // Filter spells
    spells = this.itemFilterService.filter(spells, spellbookTabId);

    // Sort spells
    if (spellbookSortMode === 'a') {
      spells = spells.toSorted((a: Item5e, b: Item5e) =>
        a.name.localeCompare(b.name)
      );
    }

    // Section spells
    // TODO: Take over `_prepareSpellbook` and put in `SheetSections`; have custom sectioning built right into the process.
    const customSectionSpells = spells.filter((s: Item5e) =>
      SheetSections.tryGetCustomSection(s)
    );
    spells = spells.filter(
      (s: Item5e) => !SheetSections.tryGetCustomSection(s)
    );
    const spellbook = [
      ...this._prepareSpellbook(context, spells).map((s: SpellbookSection) => ({
        ...s,
        key: s.prop,
      })),
      ...SheetSections.generateCustomSpellbookSections(customSectionSpells, {
        canCreate: true,
      }),
    ];

    // Organize Features
    for (let item of other) {
      // Handle custom section, if present
      if (SheetSections.tryGetCustomSection(item)) {
        NpcSheetSections.applyAbilityToSection(features, item, {
          canCreate: true,
        });
      } else if (item.type === 'weapon') features.weapons.items.push(item);
      else if (item.type === 'feat') {
        if (item.system.activation.type) features.actions.items.push(item);
        else features.passive.items.push(item);
      } else features.equipment.items.push(item);
    }

    // Assign, sort sections, and return
    const actorSectionOrder = TidyFlags.actorSectionOrder.get(this.actor);

    context.features = SheetSections.sortKeyedSections(
      Object.values(features),
      actorSectionOrder?.[CONSTANTS.TAB_NPC_ABILITIES]
    );
    context.spellbook = SheetSections.sortKeyedSections(
      spellbook,
      actorSectionOrder?.[CONSTANTS.TAB_NPC_SPELLBOOK]
    );
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

  async _onDropSingleItem(...args: any[]) {
    return super._onDropSingleItem(...args);
  }

  private _renderMutex = new AsyncMutex();
  async _render(force?: boolean, options = {}) {
    await this._renderMutex.lock(async () => {
      await this._renderSheet(force, options);
    });
  }

  private async _renderSheet(force?: boolean, options = {}) {
    await this.setExpandedItemData();
    const data = await this.getData();
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
        this.actor.type,
        SettingsProvider.settings.colorScheme.get(),
        this.element.get(0)
      );
      await this.renderCustomContent({ data, isFullRender: true });
      Hooks.callAll(
        'tidy5e-sheet.renderActorSheet',
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
      blurUntabbableButtonsOnClick(this.element);
      return;
    }

    await maintainCustomContentInputFocus(this, async () => {
      applyTitleToWindow(this.title, this.element.get(0));
      await this.renderCustomContent({ data, isFullRender: false });
      Hooks.callAll(
        'tidy5e-sheet.renderActorSheet',
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
   * Take a short rest, calling the relevant function on the Actor instance
   * @param {Event} event   The triggering click event
   * @private
   */
  async _onShortRest(event: Event) {
    event.preventDefault();
    await this._onSubmit(event);
    if (SettingsProvider.settings.showNpcRestInChat.get()) {
      let obj = {
        dialog: true,
        chat: false,
      };
      return this.shortRest(obj);
    }
    return this.shortRest();
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

  /**
   * Take a short rest, possibly spending hit dice and recovering resources, item uses, and pact slots.
   * @param {RestConfiguration} [config]  Configuration options for a short rest.
   * @returns {Promise<RestResult>}       A Promise which resolves once the short rest workflow has completed.
   */
  async shortRest(config: any = {}) {
    config = FoundryAdapter.mergeObject(
      {
        dialog: true,
        chat: SettingsProvider.settings.showNpcRestInChat.get(),
        newDay: false,
        autoHD: false,
        autoHDThreshold: 3,
      },
      config
    );

    /**
     * A hook event that fires before a short rest is started.
     * @function dnd5e.preShortRest
     * @memberof hookEvents
     * @param {Actor5e} actor             The actor that is being rested.
     * @param {RestConfiguration} config  Configuration options for the rest.
     * @returns {boolean}                 Explicitly return `false` to prevent the rest from being started.
     */
    if (Hooks.call('dnd5e.preShortRest', this.actor, config) === false) {
      return;
    }

    // Take note of the initial hit points and number of hit dice the Actor has
    const hd0 = isLessThanOneIsOne(this.actor.system.details.cr); // this.actor.system.attributes.hd;
    const hp0 = this.actor.system.attributes.hp.value;

    // Display a Dialog for rolling hit dice
    if (config.dialog) {
      try {
        const result = await NpcShortRestDialog.shortRestDialog({
          actor: this.actor,
          canRoll: hd0 > 0,
        });

        if (result.confirmed) {
          config.newDay = result.newDay === true;
          // Return the rest result
          const dhd = hd0; // this.system.attributes.hd - hd0;
          const dhp = this.actor.system.attributes.hp.value - hp0;

          const rollData = this.actor.getRollData();
          const roll_value = await FoundryAdapter.roll(
            isLessThanOneIsOne(dhd).toString() + 'd6',
            rollData
          );
          const value = roll_value.total;
          let newHpValue =
            this.actor.system.attributes.hp.value + Number(value ?? 0);
          if (newHpValue > this.actor.system.attributes.hp.max) {
            newHpValue = this.actor.system.attributes.hp.max;
          }
          await this.actor.update({ 'system.attributes.hp.value': newHpValue });

          return this.actor._rest(config.chat, config.newDay, false, dhd, dhp);
        }
      } catch (err) {
        error(
          'An error occurred while attempting a short rest for the NPC. See devtool console for more information.',
          true,
          err
        );
        return;
      }
    } else if (config.autoHD) {
      // Automatically spend hit dice
      await this.autoSpendHitDice({ threshold: config.autoHDThreshold });
    }
  }

  close(options: unknown = {}) {
    this._destroySvelteComponent();
    this.subscriptionsService.unsubscribeAll();
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
