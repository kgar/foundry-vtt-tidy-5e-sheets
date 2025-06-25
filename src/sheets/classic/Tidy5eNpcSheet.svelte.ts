import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type {
  NpcSheetContext,
  SearchFilterCacheable,
  LocationToSearchTextMap,
  SheetExpandedItemsCacheable,
  SheetStats,
  SheetTabCacheable,
  ExpandedItemIdToLocationsMap,
  ExpandedItemData,
  Utilities,
  ActiveEffect5e,
  NpcAbilitySection,
  ActorInventoryTypes,
  NpcHabitat,
  ActorSheetContextV1,
} from 'src/types/types';
import NpcSheet from './npc/NpcSheet.svelte';
import { CONSTANTS } from 'src/constants';
import { debug } from 'src/utils/logging';
import { settings, systemSettings } from 'src/settings/settings.svelte';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import { mount } from 'svelte';
import type { Item5e, ItemChatData } from 'src/types/item.types';
import { actorUsesActionFeature } from 'src/features/actions/actions.svelte';
import { CustomActorTraitsRuntime } from 'src/runtime/actor-traits/CustomActorTraitsRuntime';
import { ItemTableToggleCacheService } from 'src/features/caching/ItemTableToggleCacheService';
import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import { SheetSections } from 'src/features/sections/SheetSections';
import { NpcSheetSections } from 'src/features/sections/NpcSheetSections';
import { DocumentTabSectionConfigApplication } from 'src/applications/section-config/DocumentTabSectionConfigApplication.svelte';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { Inventory } from 'src/features/sections/Inventory';
import { Container } from 'src/features/containers/Container';
import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
import { ConditionsAndEffects } from 'src/features/conditions-and-effects/ConditionsAndEffects';
import { ItemUtils } from 'src/utils/ItemUtils';
import { Activities } from 'src/features/activities/activities';
import { ExpansionTracker } from 'src/features/expand-collapse/ExpansionTracker.svelte';
import { ItemContext } from 'src/features/item/ItemContext';
import { splitSemicolons } from 'src/utils/array';
import NpcSheetClassicRuntime from 'src/runtime/actor/NpcSheetClassicRuntime.svelte';
import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime.svelte';
import { Tidy5eActorSheetClassicV2Base } from './Tidy5eActorSheetClassicV2Base.svelte';
import type { ApplicationConfiguration } from 'src/types/application.types';

export class Tidy5eNpcSheet
  extends Tidy5eActorSheetClassicV2Base<NpcSheetContext>(
    CONSTANTS.SHEET_TYPE_NPC
  )
  implements
    SheetTabCacheable,
    SheetExpandedItemsCacheable,
    SearchFilterCacheable
{
  stats = $state<SheetStats>({
    lastSubmissionTime: null,
  });
  currentTabId: string;
  searchFilters: LocationToSearchTextMap = new Map<string, string>();
  expandedItems: ExpandedItemIdToLocationsMap = new Map<string, Set<string>>();
  expandedItemData: ExpandedItemData = new Map<string, ItemChatData>();
  inlineToggleService = new InlineToggleService();
  itemTableTogglesCache: ItemTableToggleCacheService;
  sectionExpansionTracker = new ExpansionTracker(
    true,
    CONSTANTS.LOCATION_SECTION
  );
  classSpellbookFilter: string = '';

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

    this.itemTableTogglesCache = new ItemTableToggleCacheService({
      userId: game.user.id,
      documentId: this.actor.id,
    });

    this.currentTabId = settings.value.initialNpcSheetTab;
  }

  static DEFAULT_OPTIONS: Partial<ApplicationConfiguration> = {
    position: {
      width: 740,
      height: 810,
    },
  };

  _createComponent(node: HTMLElement): Record<string, any> {
    const component = mount(NpcSheet, {
      target: node,
      context: new Map<any, any>([
        [CONSTANTS.SVELTE_CONTEXT.APP_ID, this.appId],
        [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this._context],
        [CONSTANTS.SVELTE_CONTEXT.STATS, this.stats],
        [CONSTANTS.SVELTE_CONTEXT.CURRENT_TAB_ID, this.currentTabId],
        [
          CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
          this.inlineToggleService,
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
        [
          CONSTANTS.SVELTE_CONTEXT.SECTION_EXPANSION_TRACKER,
          this.sectionExpansionTracker,
        ],
      ]),
    });

    initTidy5eContextMenu(this, node, CONSTANTS.SHEET_LAYOUT_CLASSIC);

    return component;
  }

  async _prepareContext(options = {}) {
    this._concentration = this.actor.concentration;

    const defaultDocumentContext = await super._prepareContext(options);

    const npcPreferences = SheetPreferencesService.getByType(this.actor.type);

    const abilitiesSortMode =
      npcPreferences.tabs?.[CONSTANTS.TAB_NPC_ABILITIES]?.sort ?? 'm';

    const spellbookSortMode =
      npcPreferences.tabs?.[CONSTANTS.TAB_ACTOR_SPELLBOOK]?.sort ?? 'm';

    const actionListSortMode =
      npcPreferences.tabs?.[CONSTANTS.TAB_ACTOR_ACTIONS]?.sort ?? 'm';

    const inventorySortMode =
      npcPreferences.tabs?.[CONSTANTS.TAB_ACTOR_INVENTORY]?.sort ?? 'm';

    let utilities: Utilities<NpcSheetContext> = {
      [CONSTANTS.TAB_NPC_ABILITIES]: {
        utilityToolbarCommands: [
          {
            id: 'sort-mode-alpha',
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
            id: 'sort-mode-manual',
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
            id: 'spell-pips',
            title: FoundryAdapter.localize('TIDY5E.Utilities.SpellPips'),
            iconClass: 'fa-regular fa-circle-dot fa-fw',
            execute: async () => {
              await SheetPreferencesService.setDocumentTypePreference(
                this.actor.type,
                CONSTANTS.SPELL_SLOT_TRACKER_MODE_PREFERENCE,
                CONSTANTS.SPELL_SLOT_TRACKER_MODE_VALUE_MAX
              );
            },
            visible:
              !settings.value.showSpellbookTabNpc &&
              (npcPreferences?.spellSlotTrackerMode ??
                CONSTANTS.SPELL_SLOT_TRACKER_MODE_PIPS) ===
                CONSTANTS.SPELL_SLOT_TRACKER_MODE_PIPS,
          },
          {
            id: 'spell-value-max',
            title: FoundryAdapter.localize('TIDY5E.Utilities.SpellValueMax'),
            iconClass: 'fa-regular fa-square fa-fw',
            execute: async () => {
              await SheetPreferencesService.setDocumentTypePreference(
                this.actor.type,
                CONSTANTS.SPELL_SLOT_TRACKER_MODE_PREFERENCE,
                CONSTANTS.SPELL_SLOT_TRACKER_MODE_PIPS
              );
            },
            visible:
              !settings.value.showSpellbookTabNpc &&
              npcPreferences?.spellSlotTrackerMode ===
                CONSTANTS.SPELL_SLOT_TRACKER_MODE_VALUE_MAX,
          },
          {
            id: 'expand-all',
            title: FoundryAdapter.localize('TIDY5E.Commands.ExpandAll'),
            iconClass: 'fas fa-angles-down',
            execute: () =>
              this.sectionExpansionTracker.setAll(
                CONSTANTS.TAB_NPC_ABILITIES,
                true
              ),
          },
          {
            id: 'collapse-all',
            title: FoundryAdapter.localize('TIDY5E.Commands.CollapseAll'),
            iconClass: 'fas fa-angles-up',
            execute: () =>
              this.sectionExpansionTracker.setAll(
                CONSTANTS.TAB_NPC_ABILITIES,
                false
              ),
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
                  sections: sections,
                  tabId: CONSTANTS.TAB_NPC_ABILITIES,
                  tabTitle: NpcSheetClassicRuntime.getTabTitle(
                    CONSTANTS.TAB_NPC_ABILITIES
                  ),
                },
                {
                  document: context.actor,
                }
              ).render(true);
            },
          },
        ],
      },
      [CONSTANTS.TAB_ACTOR_SPELLBOOK]: {
        utilityToolbarCommands: [
          {
            id: 'sort-mode-alpha',
            title: FoundryAdapter.localize('SIDEBAR.SortModeAlpha'),
            iconClass: 'fa-solid fa-arrow-down-a-z fa-fw',
            execute: async () => {
              await SheetPreferencesService.setDocumentTypeTabPreference(
                this.actor.type,
                CONSTANTS.TAB_ACTOR_SPELLBOOK,
                'sort',
                'm'
              );
            },
            visible: spellbookSortMode === 'a',
          },
          {
            id: 'sort-mode-manual',
            title: FoundryAdapter.localize('SIDEBAR.SortModeManual'),
            iconClass: 'fa-solid fa-arrow-down-short-wide fa-fw',
            execute: async () => {
              await SheetPreferencesService.setDocumentTypeTabPreference(
                this.actor.type,
                CONSTANTS.TAB_ACTOR_SPELLBOOK,
                'sort',
                'a'
              );
            },
            visible: spellbookSortMode === 'm',
          },
          {
            id: 'spell-pips',
            title: FoundryAdapter.localize('TIDY5E.Utilities.SpellPips'),
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
            id: 'spell-value-max',
            title: FoundryAdapter.localize('TIDY5E.Utilities.SpellValueMax'),
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
            id: 'expand-all',
            title: FoundryAdapter.localize('TIDY5E.Commands.ExpandAll'),
            iconClass: 'fas fa-angles-down',
            execute: () =>
              this.sectionExpansionTracker.setAll(
                CONSTANTS.TAB_ACTOR_SPELLBOOK,
                true
              ),
          },
          {
            id: 'collapse-all',
            title: FoundryAdapter.localize('TIDY5E.Commands.CollapseAll'),
            iconClass: 'fas fa-angles-up',
            execute: () =>
              this.sectionExpansionTracker.setAll(
                CONSTANTS.TAB_ACTOR_SPELLBOOK,
                false
              ),
          },
          {
            id: 'list-layout',
            title: FoundryAdapter.localize('TIDY5E.ListLayout'),
            iconClass: 'fas fa-th-list fa-fw toggle-list',
            visible: !TidyFlags.spellbookGrid.get(this.actor),
            execute: () => {
              TidyFlags.spellbookGrid.set(this.actor);
            },
          },
          {
            id: 'grid-layout',
            title: FoundryAdapter.localize('TIDY5E.GridLayout'),
            iconClass: 'fas fa-th-large fa-fw toggle-grid',
            visible: !!TidyFlags.spellbookGrid.get(this.actor),
            execute: () => {
              TidyFlags.spellbookGrid.unset(this.actor);
            },
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
                  sections: sections,
                  tabId: CONSTANTS.TAB_ACTOR_SPELLBOOK,
                  tabTitle: NpcSheetClassicRuntime.getTabTitle(
                    CONSTANTS.TAB_ACTOR_SPELLBOOK
                  ),
                },
                {
                  document: context.actor,
                }
              ).render(true);
            },
          },
        ],
      },
      [CONSTANTS.TAB_ACTOR_ACTIONS]: {
        utilityToolbarCommands: [
          {
            id: 'sort-mode-alpha',
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
            id: 'action-list-default',
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
            id: 'expand-all',
            title: FoundryAdapter.localize('TIDY5E.Commands.ExpandAll'),
            iconClass: 'fas fa-angles-down',
            execute: () =>
              this.sectionExpansionTracker.setAll(
                CONSTANTS.TAB_ACTOR_ACTIONS,
                true
              ),
          },
          {
            id: 'collapse-all',
            title: FoundryAdapter.localize('TIDY5E.Commands.CollapseAll'),
            iconClass: 'fas fa-angles-up',
            execute: () =>
              this.sectionExpansionTracker.setAll(
                CONSTANTS.TAB_ACTOR_ACTIONS,
                false
              ),
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
                  sections: sections,
                  tabId: CONSTANTS.TAB_ACTOR_ACTIONS,
                  tabTitle: NpcSheetClassicRuntime.getTabTitle(
                    CONSTANTS.TAB_ACTOR_ACTIONS
                  ),
                },
                {
                  document: context.actor,
                }
              ).render(true);
            },
          },
        ],
      },
      [CONSTANTS.TAB_ACTOR_INVENTORY]: {
        utilityToolbarCommands: [
          {
            id: 'sort-mode-alpha',
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
            id: 'sort-mode-manual',
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
            id: 'hide-container-panel',
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
            id: 'show-container-panel',
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
            id: 'expand-all',
            title: FoundryAdapter.localize('TIDY5E.Commands.ExpandAll'),
            iconClass: 'fas fa-angles-down',
            execute: () =>
              this.sectionExpansionTracker.setAll(
                CONSTANTS.TAB_ACTOR_INVENTORY,
                true
              ),
          },
          {
            id: 'collapse-all',
            title: FoundryAdapter.localize('TIDY5E.Commands.CollapseAll'),
            iconClass: 'fas fa-angles-up',
            execute: () =>
              this.sectionExpansionTracker.setAll(
                CONSTANTS.TAB_ACTOR_INVENTORY,
                false
              ),
          },
          {
            id: 'list-layout',
            title: FoundryAdapter.localize('TIDY5E.ListLayout'),
            iconClass: 'fas fa-th-list fa-fw toggle-list',
            visible: !TidyFlags.inventoryGrid.get(this.actor),
            execute: () => {
              TidyFlags.inventoryGrid.set(this.actor);
            },
          },
          {
            id: 'grid-layout',
            title: FoundryAdapter.localize('TIDY5E.GridLayout'),
            iconClass: 'fas fa-th-large fa-fw toggle-grid',
            visible: !!TidyFlags.inventoryGrid.get(this.actor),
            execute: () => {
              TidyFlags.inventoryGrid.unset(this.actor);
            },
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
                  sections: sections,
                  tabId: CONSTANTS.TAB_ACTOR_INVENTORY,
                  tabTitle: NpcSheetClassicRuntime.getTabTitle(
                    CONSTANTS.TAB_ACTOR_INVENTORY
                  ),
                },
                {
                  document: context.actor,
                }
              ).render(true);
            },
          },
        ],
      },
    };

    // Effects & Conditions
    let { conditions, effects: enhancedEffectSections } =
      await ConditionsAndEffects.getConditionsAndEffectsForActor(
        this.actor,
        this.object,
        defaultDocumentContext.effects
      );

    const context: NpcSheetContext = {
      appearanceEnrichedHtml: await FoundryAdapter.enrichHtml(
        TidyFlags.appearance.get(this.actor) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          relativeTo: this.actor,
        }
      ),
      biographyEnrichedHtml: await FoundryAdapter.enrichHtml(
        FoundryAdapter.getProperty<string>(
          this.actor,
          `system.details.biography.value`
        ) ?? '',
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
      defaultSkills: new Set<string>(
        systemSettings.value.defaultSkills
      ),
      features: [],
      flawEnrichedHtml: await FoundryAdapter.enrichHtml(
        this.actor.system.details.flaw,
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          relativeTo: this.actor,
        }
      ),
      habitat: [],
      hasLegendaries: false,
      hideEmptySpellbook: false,
      idealEnrichedHtml: await FoundryAdapter.enrichHtml(
        this.actor.system.details.ideal,
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          relativeTo: this.actor,
        }
      ),
      inventory: [],
      languages: [],
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
      showContainerPanel:
        TidyFlags.showContainerPanel.get(this.actor) === true &&
        Array.from(defaultDocumentContext.items).some(
          (i: Item5e) => i.type === CONSTANTS.ITEM_TYPE_CONTAINER
        ),
      showLoyalty:
        this.actor.system.traits.important &&
        game.settings.get('dnd5e', 'loyaltyScore') &&
        game.user.isGM,
      showSpellbookTab: settings.value.showSpellbookTabNpc,
      spellcastingInfo: FoundryAdapter.getSpellcastingInfo(this.actor),
      spellbook: [],
      spellComponentLabels: FoundryAdapter.getSpellComponentLabels(),
      spellSlotTrackerMode:
        npcPreferences.spellSlotTrackerMode ??
        CONSTANTS.SPELL_SLOT_TRACKER_MODE_PIPS,
      traitEnrichedHtml: await FoundryAdapter.enrichHtml(
        TidyFlags.trait.get(this.actor) ?? '',
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          relativeTo: this.actor,
        }
      ),
      treasure: [],
      useActionsFeature: actorUsesActionFeature(this.actor),
      utilities: utilities,
      ...defaultDocumentContext,
    };

    context.filterData = this.itemFilterService.getFilterData();
    context.filterPins = ItemFilterRuntime.defaultFilterPins[this.actor.type];

    context.customActorTraits = CustomActorTraitsRuntime.getEnabledTraits(
      defaultDocumentContext
    );

    context.customContent = await NpcSheetClassicRuntime.getContent(context);

    context.effects = enhancedEffectSections;

    // TODO: push this onto the svelte component(s) where it is needed
    context.hideEmptySpellbook =
      context.lockSensitiveFields && context.spellbook.length === 0;

    context.useClassicControls = settings.value.useClassicControlsForNpc;

    context.labels.type = this.actor.system.details.type.label;

    // Legendary Panel
    context.hasLegendaries =
      this.actor.system.resources.legact.max ||
      this.actor.system.resources.legres.max ||
      (context.modernRules && this.actor.system.resources.lair.value) ||
      (!context.modernRules && this.actor.system.resources.lair.initiative);

    // Container Contents Panel
    for (const panelItem of context.containerPanelItems) {
      const ctx = context.itemContext[panelItem.container.id];
      ctx.containerContents = await Container.getContainerContents(
        panelItem.container,
        {
          hasActor: true,
          unlocked: context.unlocked,
        }
      );
    }

    let details = this.actor.system.details;

    // Habitat
    if (details?.habitat?.value.length || details?.habitat?.custom) {
      const { habitat } = details;
      const any = details.habitat.value.find(
        ({ type }: NpcHabitat) => type === CONSTANTS.HABITAT_TYPE_ANY
      );
      context.habitat = habitat.value
        .reduce((arr: { label: string }[], { type, subtype }: NpcHabitat) => {
          let { label } = CONFIG.DND5E.habitats[type] ?? {};
          if (label && (!any || type === CONSTANTS.HABITAT_TYPE_ANY)) {
            if (subtype)
              label = game.i18n.format('DND5E.Habitat.Subtype', {
                type: label,
                subtype,
              });
            arr.push({ label });
          }
          return arr;
        }, [])
        .concat(splitSemicolons(habitat.custom).map((label) => ({ label })))
        .sort((a: { label: string }, b: { label: string }) =>
          a.label.localeCompare(b.label, game.i18n.lang)
        );
    }

    // Treasure
    if (details?.treasure?.value.size) {
      const any = details.treasure.value.has(CONSTANTS.TREASURE_ANY);
      context.treasure = details.treasure.value
        .reduce((arr: { label: string }[], id: string) => {
          const { label } = CONFIG.DND5E.treasure[id] ?? {};
          if (label && (!any || id === CONSTANTS.TREASURE_ANY))
            arr.push({ label });
          return arr;
        }, [])
        .toSorted((a: { label: string }, b: { label: string }) =>
          a.label.localeCompare(b.label, game.i18n.lang)
        );
    }

    let tabs = await NpcSheetClassicRuntime.getTabs(context);

    const selectedTabs = TidyFlags.selectedTabs.get(context.actor);

    if (selectedTabs?.length) {
      tabs = tabs
        .filter((t) => selectedTabs?.includes(t.id))
        .sort(
          (a, b) => selectedTabs.indexOf(a.id) - selectedTabs.indexOf(b.id)
        );
    } else {
      const defaultTabs = settings.value.defaultNpcSheetTabs;
      tabs = tabs
        .filter((t) => defaultTabs?.includes(t.id))
        .sort((a, b) => defaultTabs.indexOf(a.id) - defaultTabs.indexOf(b.id));
    }

    context.tabs = tabs;

    TidyHooks.tidy5eSheetsPreConfigureSections(this, this.element, context);

    await this.setExpandedItemData();
    SheetSections.accountForExternalSections(
      ['features', 'spellbook'],
      context
    );

    debug('NPC Sheet context data', context);

    return context;
  }

  _prepareItems(context: NpcSheetContext) {
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
        rowActions: [], // for the UI Overhaul
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
        rowActions: [], // for the UI Overhaul
      },
      [CONSTANTS.NPC_ABILITY_SECTION_PASSIVE]: {
        label: game.i18n.localize('DND5E.Features'),
        items: [],
        dataset: { type: CONSTANTS.ITEM_TYPE_FEAT },
        canCreate: true,
        key: 'passive',
        show: true,
        hasUses: true,
        rowActions: [], // for the UI Overhaul
      },
      [CONSTANTS.NPC_ABILITY_SECTION_EQUIPMENT]: {
        label: game.i18n.localize('DND5E.Inventory'),
        items: [],
        dataset: { type: CONSTANTS.ITEM_TYPE_LOOT },
        canCreate: true,
        key: 'equipment',
        show: true,
        rowActions: [], // for the UI Overhaul
      },
      [CONSTANTS.NPC_ABILITY_SECTION_CLASSES]: {
        label: `${CONFIG.Item.typeLabels.class}Pl`,
        items: [],
        dataset: { type: CONSTANTS.ITEM_TYPE_CLASS },
        canCreate: true,
        key: 'classes',
        show: true,
        isClass: true,
        rowActions: [], // for the UI Overhaul
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
        const { quantity, uses } = item.system;
        const ctx = (context.itemContext[item.id] ??= {});

        // Activities
        ctx.activities = Activities.getVisibleActivities(
          item,
          item.system.activities
        )?.map(Activities.getActivityItemContext);

        Activities.applyLinkedUses(item, this.actor, ctx);

        ctx.attunement = FoundryAdapter.getAttunementContext(item);
        ctx.isStack = Number.isNumeric(quantity) && quantity !== 1;
        ctx.hasUses = uses && uses.max > 0;
        ctx.canToggle = 'equipped' in item.system;

        // Save
        ctx.save = ItemContext.getItemSaveContext(item);

        // To Hit
        ctx.toHit = ItemContext.getToHit(item);

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

    const inventoryTypesArray = Inventory.getInventoryTypes();
    const inventoryTypes = new Set(inventoryTypesArray);
    const inventory: ActorInventoryTypes =
      Inventory.getDefaultInventorySections();

    SheetSections.getFilteredGlobalSectionsToShowWhenEmpty(
      context.actor,
      CONSTANTS.TAB_ACTOR_INVENTORY
    ).forEach((s) => {
      inventory[s] ??= Inventory.createInventorySection(
        s,
        inventoryTypesArray,
        {
          canCreate: true,
        }
      );
    });

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
        if (ItemUtils.hasActivationType(item)) {
          features.actions.items.push(item);
        } else {
          // TODO: Partition classes/subclasses to their own area; this may have to happen in the original partition of the spells / other arrays.
          features.passive.items.push(item);
        }
      } else features.equipment.items.push(item);
    }

    SheetSections.getFilteredGlobalSectionsToShowWhenEmpty(
      this.actor,
      CONSTANTS.TAB_NPC_ABILITIES
    ).forEach((s) => {
      features[s] ??= NpcSheetSections.createFeatureSection(s, {
        canCreate: true,
      });
    });

    // Organize Spellbook
    // Section spells
    // TODO: Take over `_prepareSpellbook` and have custom sectioning built right in
    const spellbook = SheetSections.prepareTidySpellbook(
      context,
      CONSTANTS.TAB_ACTOR_SPELLBOOK,
      spells,
      {
        canCreate: true,
      }
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

  _prepareTraits(systemData: any) {
    const traits = super._prepareTraits(systemData);
    FoundryAdapter.prepareLanguageTrait(this.actor, traits);
    return traits;
  }

  /** @inheritDoc */
  async _prepareSpecialTraitsContext(context: ActorSheetContextV1) {
    context = await super._prepareSpecialTraitsContext(context);

    context.flags.sections.unshift({
      label: game.i18n.localize('DND5E.NPC.Label'),
      fields: [
        {
          field: this.document.system.schema.fields.traits.fields.important,
          name: 'system.traits.important',
          value: context.source.system.traits.important,
        },
      ],
    });

    return context;
  }

  onToggleAbilityProficiency(
    event: MouseEvent & { target: HTMLElement; currentTarget: HTMLElement }
  ) {
    return this._onToggleAbilityProficiency(event);
  }

  async _onDropSingleItem(
    itemData: any,
    event: DragEvent & { target: HTMLElement; currentTarget: HTMLElement }
  ) {
    // Create a Consumable spell scroll on the Inventory tab
    if (
      itemData.type === CONSTANTS.ITEM_TYPE_SPELL &&
      this.currentTabId === CONSTANTS.TAB_ACTOR_INVENTORY
    ) {
      const options: Record<string, unknown> = {};

      if (settings.value.includeFlagsInSpellScrollCreation) {
        options.flags = itemData.flags;
      }

      const scroll = await dnd5e.documents.Item5e.createScrollFromSpell(
        itemData,
        options
      );

      return scroll.toObject();
    }

    return super._onDropSingleItem(itemData, event);
  }

  _disableFields(...args: any[]) {
    debug('Ignoring call to disable fields. Delegating to Tidy Sheets...');
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

  /* -------------------------------------------- */
  /* Class Spellbook Filter
  /* -------------------------------------------- */

  setClassSpellbookFilter(value: string) {
    this.classSpellbookFilter = value;
    this.render();
  }
}
