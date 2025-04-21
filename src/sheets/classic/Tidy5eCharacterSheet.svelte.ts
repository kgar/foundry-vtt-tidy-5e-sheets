import { FoundryAdapter } from '../../foundry/foundry-adapter';
import CharacterSheet from './character/CharacterSheet.svelte';
import { debug, warn } from 'src/utils/logging';
import { settings } from 'src/settings/settings.svelte';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import { CONSTANTS } from 'src/constants';
import {
  type CharacterSheetContext,
  type SheetStats,
  type Actor5e,
  type SheetTabCacheable,
  type SheetExpandedItemsCacheable,
  type SearchFilterCacheable,
  type LocationToSearchTextMap,
  type ExpandedItemIdToLocationsMap,
  type ExpandedItemData,
  type MessageBus,
  type Utilities,
  type ActiveEffect5e,
  type ActorInventoryTypes,
  type CharacterItemPartitions,
  type CharacterFeatureSection,
  type CharacterItemContext,
  type SpellbookSection,
  type EffectFavoriteSection,
  type FacilityOccupantContext,
  type FacilitySection,
  type ChosenFacilityContext,
  type TypedActivityFavoriteSection,
  type AttributePinContext,
} from 'src/types/types';
import {
  applySheetAttributesToWindow,
  applyTitleToWindow,
  blurUntabbableButtonsOnClick,
  maintainCustomContentInputFocus,
  applySheetConfigLockAttributeToApplication,
  applyThemeToApplication,
} from 'src/utils/applications.svelte';
import { mount, unmount } from 'svelte';
import type { Item5e, ItemChatData } from 'src/types/item.types';
import CharacterSheetClassicRuntime from 'src/runtime/actor/CharacterSheetClassicRuntime.svelte';
import {
  actorUsesActionFeature,
  getActorActionSections,
} from 'src/features/actions/actions.svelte';
import { isNil } from 'src/utils/data';
import { CustomContentRenderer } from '../CustomContentRenderer';
import { ActorPortraitRuntime } from 'src/runtime/ActorPortraitRuntime';
import { CustomActorTraitsRuntime } from 'src/runtime/actor-traits/CustomActorTraitsRuntime';
import { ItemTableToggleCacheService } from 'src/features/caching/ItemTableToggleCacheService';
import { ItemFilterService } from 'src/features/filtering/ItemFilterService.svelte';
import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import { AsyncMutex } from 'src/utils/mutex';
import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime.svelte';
import { Tidy5eBaseActorSheet } from './Tidy5eBaseActorSheet.svelte';
import { CharacterSheetSections } from 'src/features/sections/CharacterSheetSections';
import { SheetSections } from 'src/features/sections/SheetSections';
import { DocumentTabSectionConfigApplication } from 'src/applications/section-config/DocumentTabSectionConfigApplication.svelte';
import { BaseSheetCustomSectionMixin } from './mixins/BaseSheetCustomSectionMixin';
import { Inventory } from 'src/features/sections/Inventory';
import type {
  CharacterFavorite,
  FacilityOccupants,
  UnsortedCharacterFavorite,
} from 'src/foundry/dnd5e.types';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { Container } from 'src/features/containers/Container';
import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
import { ConditionsAndEffects } from 'src/features/conditions-and-effects/ConditionsAndEffects';
import type { ContextMenuEntry } from 'src/foundry/foundry.types';
import { Activities } from 'src/features/activities/activities';
import { CoarseReactivityProvider } from 'src/features/reactivity/CoarseReactivityProvider.svelte';
import AttachedInfoCard from 'src/components/info-card/AttachedInfoCard.svelte';
import { ExpansionTracker } from 'src/features/expand-collapse/ExpansionTracker.svelte';
import { AttributePins } from 'src/features/attribute-pins/AttributePins';
import type { AttributePinFlag } from 'src/foundry/TidyFlags.types';
import { ItemContext } from 'src/features/item/ItemContext';
import { Tidy5eActorSheetClassicBase } from './Tidy5eActorSheetClassicBase.svelte';

export class Tidy5eCharacterSheet
  extends Tidy5eActorSheetClassicBase
  implements
    SheetTabCacheable,
    SheetExpandedItemsCacheable,
    SearchFilterCacheable
{
  context = new CoarseReactivityProvider<CharacterSheetContext | undefined>(
    undefined
  );

  stats = $state<SheetStats>({
    lastSubmissionTime: null,
  });
  currentTabId: string;
  searchFilters: LocationToSearchTextMap = new Map<string, string>();
  expandedItems: ExpandedItemIdToLocationsMap = new Map<string, Set<string>>();
  expandedItemData: ExpandedItemData = new Map<string, ItemChatData>();
  inlineToggleService = new InlineToggleService();
  itemTableTogglesCache: ItemTableToggleCacheService;
  itemFilterService: ItemFilterService;
  messageBus = $state<MessageBus>({ message: undefined });
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

    this.itemFilterService = new ItemFilterService({}, this.actor);

    this.currentTabId = settings.value.initialCharacterSheetTab;
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
        'app-v1',
        CONSTANTS.SHEET_LAYOUT_CLASSIC,
      ],
      width: 740,
      height: 810,
      scrollY: ['[data-tidy-track-scroll-y]', '.scroll-container'],
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
    });
  }

  component: Record<string, any> | undefined;
  additionalComponents: Record<string, any>[] = [];
  _effectCleanup?: () => void;
  activateListeners(html: { get: (index: 0) => HTMLElement }) {
    // Document Apps Reactivity
    game.user.apps[this.id] = this;

    let first = true;

    this._effectCleanup = $effect.root(() => {
      $effect(() => {
        if (first) return;

        applySheetConfigLockAttributeToApplication(
          settings.value,
          this.element.get(0)
        );
        applyThemeToApplication(
          settings.value,
          this.element.get(0),
          this.actor
        );
        this.render();
      });

      $effect(() => {
        debug('Message bus message received', {
          app: this,
          actor: this.actor,
          message: this.messageBus,
        });
      });
    });

    first = false;

    const node = html.get(0);

    this.component = mount(CharacterSheet, {
      target: node,
      context: new Map<any, any>([
        [CONSTANTS.SVELTE_CONTEXT.APP_ID, this.appId],
        [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this.context],
        [CONSTANTS.SVELTE_CONTEXT.MESSAGE_BUS, this.messageBus],
        [CONSTANTS.SVELTE_CONTEXT.STATS, this.stats],
        [CONSTANTS.SVELTE_CONTEXT.CURRENT_TAB_ID, this.currentTabId],
        [
          CONSTANTS.SVELTE_CONTEXT.ON_TAB_SELECTED,
          this.onTabSelected.bind(this),
        ],
        [CONSTANTS.SVELTE_CONTEXT.SEARCH_FILTERS, new Map(this.searchFilters)],
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
        [
          CONSTANTS.SVELTE_CONTEXT.SECTION_EXPANSION_TRACKER,
          this.sectionExpansionTracker,
        ],
      ]),
    });

    const infoCard = mount(AttachedInfoCard, {
      target: node,
      props: {
        sheet: this,
      },
    });

    this.additionalComponents.push(infoCard);

    initTidy5eContextMenu(this, html, CONSTANTS.SHEET_LAYOUT_CLASSIC);
  }

  async getData(options = {}): Promise<CharacterSheetContext> {
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
      characterPreferences.tabs?.[CONSTANTS.TAB_ACTOR_SPELLBOOK]?.sort ?? 'm';
    const featureSortMode =
      characterPreferences.tabs?.[CONSTANTS.TAB_CHARACTER_FEATURES]?.sort ??
      'm';
    const actionListSortMode =
      characterPreferences.tabs?.[CONSTANTS.TAB_ACTOR_ACTIONS]?.sort ?? 'm';

    const unlocked =
      FoundryAdapter.isSheetUnlocked(this.actor) &&
      defaultDocumentContext.editable;

    // TODO: Make a builder for this
    // TODO: Extract to runtime?
    let utilities: Utilities<CharacterSheetContext> = {
      [CONSTANTS.TAB_CHARACTER_ATTRIBUTES]: {
        utilityToolbarCommands: [
          {
            id: 'sort-mode-alpha',
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
            id: 'sort-mode-manual',
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
            id: 'expand-all',
            title: FoundryAdapter.localize('TIDY5E.Commands.ExpandAll'),
            iconClass: 'fas fa-angles-down',
            execute: () =>
              this.sectionExpansionTracker.setAll(
                CONSTANTS.TAB_CHARACTER_ATTRIBUTES,
                true
              ),
          },
          {
            id: 'collapse-all',
            title: FoundryAdapter.localize('TIDY5E.Commands.CollapseAll'),
            iconClass: 'fas fa-angles-up',
            execute: () =>
              this.sectionExpansionTracker.setAll(
                CONSTANTS.TAB_CHARACTER_ATTRIBUTES,
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
              new DocumentTabSectionConfigApplication({
                document: context.actor,
                // Provide a way to build the necessary config, perhaps within the application constructor. We've got all the info we need in order to perform the operation.
                sections: sections,
                tabId: CONSTANTS.TAB_CHARACTER_ATTRIBUTES,
                tabTitle: CharacterSheetClassicRuntime.getTabTitle(
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
              new DocumentTabSectionConfigApplication({
                document: context.actor,
                sections: sections,
                tabId: CONSTANTS.TAB_ACTOR_INVENTORY,
                tabTitle: CharacterSheetClassicRuntime.getTabTitle(
                  CONSTANTS.TAB_ACTOR_INVENTORY
                ),
              }).render(true);
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
              (characterPreferences?.spellSlotTrackerMode ??
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
              characterPreferences?.spellSlotTrackerMode ===
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
              new DocumentTabSectionConfigApplication({
                document: context.actor,
                sections: sections,
                tabId: CONSTANTS.TAB_ACTOR_SPELLBOOK,
                tabTitle: CharacterSheetClassicRuntime.getTabTitle(
                  CONSTANTS.TAB_ACTOR_SPELLBOOK
                ),
              }).render(true);
            },
          },
        ],
      },
      [CONSTANTS.TAB_CHARACTER_FEATURES]: {
        utilityToolbarCommands: [
          {
            id: 'sort-mode-alpha',
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
            id: 'sort-mode-manual',
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
            id: 'expand-all',
            title: FoundryAdapter.localize('TIDY5E.Commands.ExpandAll'),
            iconClass: 'fas fa-angles-down',
            execute: () =>
              this.sectionExpansionTracker.setAll(
                CONSTANTS.TAB_CHARACTER_FEATURES,
                true
              ),
          },
          {
            id: 'collapse-all',
            title: FoundryAdapter.localize('TIDY5E.Commands.CollapseAll'),
            iconClass: 'fas fa-angles-up',
            execute: () =>
              this.sectionExpansionTracker.setAll(
                CONSTANTS.TAB_CHARACTER_FEATURES,
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
              new DocumentTabSectionConfigApplication({
                document: context.actor,
                sections: sections,
                tabId: CONSTANTS.TAB_CHARACTER_FEATURES,
                tabTitle: CharacterSheetClassicRuntime.getTabTitle(
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
              new DocumentTabSectionConfigApplication({
                document: context.actor,
                sections: sections,
                tabId: CONSTANTS.TAB_ACTOR_ACTIONS,
                tabTitle: CharacterSheetClassicRuntime.getTabTitle(
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
      await ConditionsAndEffects.getConditionsAndEffectsForActor(
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
        settings.value.allowHpMaxOverride &&
        (!settings.value.lockHpMaxChanges || FoundryAdapter.userIsGm()),
      appearanceEnrichedHtml: await FoundryAdapter.enrichHtml(
        this.actor.system.details.appearance,
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          relativeTo: this.actor,
        }
      ),
      appId: this.appId,
      attributePins: [],
      bastion: {
        description: await TextEditor.enrichHTML(
          this.actor.system.bastion.description,
          {
            secrets: this.actor.isOwner,
            rollData: defaultDocumentContext.rollData,
            relativeTo: this.actor,
          }
        ),
      },
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
      customContent: [],
      defenders: [],

      editable: defaultDocumentContext.editable,
      effects: enhancedEffectSections,
      epicBoonsEarned: undefined,
      facilities: {
        basic: { chosen: [], available: [], value: 0, max: 0 },
        special: { chosen: [], available: [], value: 0, max: 0 },
      },
      favorites: [],
      features: [],
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
      healthPercentage: this.actor.system.attributes.hp.pct.toNearest(0.1),
      hirelings: [],
      idealEnrichedHtml: await FoundryAdapter.enrichHtml(
        this.actor.system.details.ideal,
        {
          secrets: this.actor.isOwner,
          rollData: defaultDocumentContext.rollData,
          relativeTo: this.actor,
        }
      ),
      inventory: [],
      itemContext: {},
      languages: [],
      lockExpChanges: FoundryAdapter.shouldLockExpChanges(),
      lockHpMaxChanges: FoundryAdapter.shouldLockHpMaxChanges(),
      lockItemQuantity: FoundryAdapter.shouldLockItemQuantity(),
      lockLevelSelector: FoundryAdapter.shouldLockLevelSelector(),
      lockMoneyChanges: FoundryAdapter.shouldLockMoneyChanges(),
      lockSensitiveFields:
        (!unlocked && settings.value.useTotalSheetLock) ||
        !defaultDocumentContext.editable,
      modernRules: FoundryAdapter.checkIfModernRules(this.actor),
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
      owner: this.actor.isOwner,
      showContainerPanel:
        TidyFlags.showContainerPanel.get(this.actor) === true &&
        Array.from(defaultDocumentContext.items).some(
          (i: Item5e) => i.type === CONSTANTS.ITEM_TYPE_CONTAINER
        ),
      showLimitedSheet: FoundryAdapter.showLimitedSheet(this.actor),
      spellbook: [],
      spellcastingInfo: FoundryAdapter.getSpellcastingInfo(this.actor),
      spellComponentLabels: FoundryAdapter.getSpellComponentLabels(),
      spellSlotTrackerMode:
        characterPreferences.spellSlotTrackerMode ??
        CONSTANTS.SPELL_SLOT_TRACKER_MODE_PIPS,
      tabs: [],
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
      useClassicControls: settings.value.useClassicControlsForCharacter,
      useRoundedPortraitStyle: [
        CONSTANTS.CIRCULAR_PORTRAIT_OPTION_ALL as string,
        CONSTANTS.CIRCULAR_PORTRAIT_OPTION_CHARACTER as string,
      ].includes(settings.value.useCircularPortraitStyle),
      utilities: utilities,
      viewableWarnings:
        defaultDocumentContext.warnings?.filter(
          (w: any) => !isNil(w.message?.trim(), '')
        ) ?? [],
    };

    context.customContent = await CharacterSheetClassicRuntime.getContent(
      context
    );

    if (context.system.details.xp.boonsEarned !== undefined) {
      const pluralRules = new Intl.PluralRules(game.i18n.lang);

      context.epicBoonsEarned = FoundryAdapter.localize(
        `DND5E.ExperiencePoints.Boons.${pluralRules.select(
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

    await this._prepareFacilities(context);

    await this._prepareAttributePins(context);

    let tabs = await CharacterSheetClassicRuntime.getTabs(context);

    const selectedTabs = TidyFlags.selectedTabs.get(context.actor);

    if (selectedTabs?.length) {
      tabs = tabs
        .filter((t) => selectedTabs?.includes(t.id))
        .sort(
          (a, b) => selectedTabs.indexOf(a.id) - selectedTabs.indexOf(b.id)
        );
    } else {
      const defaultTabs = settings.value.defaultCharacterSheetTabs;
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
      key: 'tidy-favorite-effects',
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

    const activitiesSection: TypedActivityFavoriteSection = {
      activities: [],
      dataset: {},
      key: 'tidy-favorite-activities',
      label: 'DND5E.ACTIVITY.Title.other',
      show: true,
      type: CONSTANTS.FAVORITES_SECTION_TYPE_ACTIVITY,
    };

    const favoriteActivities = (
      this.actor.system.favorites as CharacterFavorite[]
    ).filter((f) => f.type === 'activity');

    for (const favoriteActivity of favoriteActivities) {
      const activity = fromUuidSync(favoriteActivity.id, {
        relative: this.actor,
      });

      if (!activity) {
        continue;
      }

      activitiesSection.activities.push(activity);
    }

    // Favorites
    context.favorites = CharacterSheetSections.mergeDuplicateFavoriteSections(
      context.favorites
    );

    if (effectsSection.effects.length) {
      context.favorites.push({
        ...effectsSection,
        type: CONSTANTS.FAVORITES_SECTION_TYPE_EFFECT,
      });
    }

    if (activitiesSection.activities.length) {
      context.favorites.push(activitiesSection);
    }

    debug('Character Sheet context data', context);

    return context;
  }

  _prepareItems(context: CharacterSheetContext) {
    this._prepareItemsLegacy(context);
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
      backgrounds,
      classes,
      favorites,
      feats,
      items,
      species,
      spells,
      subclasses,
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
        facilities: [] as Item5e[],
        feats: [] as Item5e[],
        species: [] as Item5e[],
        backgrounds: [] as Item5e[],
        classes: [] as Item5e[],
        subclasses: [] as Item5e[],
        favorites: {
          items: [] as Item5e[],
          spells: [] as Item5e[],
          facilities: [] as Item5e[],
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

    SheetSections.getFilteredGlobalSectionsToShowWhenEmpty(
      context.actor,
      CONSTANTS.TAB_ACTOR_INVENTORY
    ).forEach((s) => {
      inventory[s] ??= Inventory.createInventorySection(s, inventoryTypes, {
        canCreate: true,
      });
    });

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

    // Section spells
    // TODO: Take over `_prepareSpellbook` and
    // - have custom sectioning built right into the process
    // - set up `key` in the spellbook prep code, just like `prop`
    const spellbook = SheetSections.prepareTidySpellbook(
      context,
      CONSTANTS.TAB_ACTOR_SPELLBOOK,
      spells,
      {
        canCreate: true,
      },
      this
    );

    // Section Favorite Spells
    const favoriteSpellbook = SheetSections.prepareTidySpellbook(
      context,
      CONSTANTS.TAB_CHARACTER_ATTRIBUTES,
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
        this.actor,
        CONSTANTS.TAB_CHARACTER_FEATURES,
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
        this.actor,
        CONSTANTS.TAB_CHARACTER_ATTRIBUTES,
        favorites.species,
        favorites.backgrounds,
        favorites.classes,
        favorites.feats,
        { canCreate: false }
      );

    // Facility Favorites
    let bastionFacilitiesLabel = !isNil(context.system.bastion.name, '')
      ? context.system.bastion.name
      : 'TYPES.Item.facilityPl';

    let favoriteFacilities: FacilitySection[] = [
      {
        dataset: {},
        items: favorites.facilities,
        key: 'tidy-favorite-bastion-facilities',
        label: bastionFacilitiesLabel,
        show: true,
      },
    ];

    // Apply sections to their section lists

    context.inventory = Object.values(inventory);

    context.spellbook = spellbook;

    context.features = Object.values(features);

    context.favorites = [
      ...Object.values(favoriteInventory)
        .filter((i) => i.items.length)
        .map((i) => ({
          ...i,
          type: CONSTANTS.FAVORITES_SECTION_TYPE_INVENTORY,
        })),
      ...Object.values(favoriteFeatures)
        .filter((i) => i.items.length)
        .map((i) => ({
          ...i,
          type: CONSTANTS.FAVORITES_SECTION_TYPE_FEATURE,
        })),
      ...favoriteSpellbook
        .filter((s: SpellbookSection) => s.spells.length)
        .map((s: SpellbookSection) => ({
          ...s,
          type: CONSTANTS.FAVORITES_SECTION_TYPE_SPELLBOOK,
        })),
      ...favoriteFacilities
        .filter((i) => i.items.length)
        .map((i) => ({
          ...i,
          type: CONSTANTS.FAVORITES_SECTION_TYPE_FACILITY,
        })),
    ];
  }

  _prepareItemsLegacy(context) {
    // Categorize items as inventory, spellbook, features, and classes
    const inventory: Record<string, any> = {};
    const inventoryTypes = Object.entries(CONFIG.Item.dataModels)
      .filter(([, model]: [any, any]) => model.metadata?.inventoryItem)
      .sort(
        ([, lhs], [, rhs]) =>
          lhs.metadata.inventoryOrder - rhs.metadata.inventoryOrder
      );
    for (const [type] of inventoryTypes) {
      inventory[type] = {
        label: `${CONFIG.Item.typeLabels[type]}Pl`,
        items: [],
        dataset: { type },
      };
    }

    // Partition items by category
    let { items, spells, feats, races, backgrounds, classes, subclasses } =
      context.items.reduce(
        (obj, item) => {
          const { quantity } = item.system;

          // Item details
          const ctx = (context.itemContext[item.id] ??= {});
          ctx.isStack = Number.isNumeric(quantity) && quantity !== 1;
          if (item.system.attunement)
            ctx.attunement = item.system.attuned
              ? {
                  icon: 'fa-sun',
                  cls: 'attuned',
                  title: 'DND5E.AttunementAttuned',
                }
              : {
                  icon: 'fa-sun',
                  cls: 'not-attuned',
                  title: CONFIG.DND5E.attunementTypes[item.system.attunement],
                };

          // Prepare data needed to display expanded sections
          ctx.isExpanded = this._expanded.has(item.id);

          // Item usage
          ctx.hasRecharge = item.hasRecharge;
          ctx.hasUses = item.hasLimitedUses;

          // Unidentified items
          ctx.concealDetails =
            !game.user.isGM && item.system.identified === false;

          // Item grouping
          ctx.ungroup = 'passive';
          const [originId] =
            item.getFlag('dnd5e', 'advancementOrigin')?.split('.') ?? [];
          const group = this.actor.items.get(originId);
          switch (group?.type) {
            case 'race':
              ctx.group = 'race';
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
          this._prepareItemLegacy(item, ctx);

          // Classify items into types
          if (item.type === 'spell') obj.spells.push(item);
          else if (item.type === 'feat') obj.feats.push(item);
          else if (item.type === 'race') obj.races.push(item);
          else if (item.type === 'background') obj.backgrounds.push(item);
          else if (item.type === 'class') obj.classes.push(item);
          else if (item.type === 'subclass') obj.subclasses.push(item);
          else if (Object.keys(inventory).includes(item.type))
            obj.items.push(item);
          return obj;
        },
        {
          items: [],
          spells: [],
          feats: [],
          races: [],
          backgrounds: [],
          classes: [],
          subclasses: [],
        }
      );

    // Organize items
    for (let i of items) {
      const ctx = (context.itemContext[i.id] ??= {});
      ctx.totalWeight = i.system.totalWeight?.toNearest(0.1);
      inventory[i.type].items.push(i);
    }

    // Organize Spellbook and count the number of prepared spells (excluding always, at will, etc...)
    const spellbook = this._prepareSpellbook(context, spells);
    const nPrepared = spells.filter((spell: Item5e) => {
      const prep = spell.system.preparation;
      return (
        spell.system.level > 0 && prep.mode === 'prepared' && prep.prepared
      );
    }).length;

    // Sort classes and interleave matching subclasses, put unmatched subclasses into features so they don't disappear
    classes.sort((a, b) => b.system.levels - a.system.levels);
    const maxLevelDelta =
      CONFIG.DND5E.maxLevel - this.actor.system.details.level;
    classes = classes.reduce((arr, cls) => {
      const ctx = (context.itemContext[cls.id] ??= {});
      ctx.availableLevels = Array.fromRange(CONFIG.DND5E.maxLevel + 1)
        .slice(1)
        .map((level) => {
          const delta = level - cls.system.levels;
          let label = dnd5e.utils.formatNumber(level);
          if (delta)
            label = `${label} (${dnd5e.utils.formatNumber(delta, {
              signDisplay: 'always',
            })})`;
          return { value: delta, label, disabled: delta > maxLevelDelta };
        });
      ctx.prefixedImage = cls.img ? foundry.utils.getRoute(cls.img) : null;
      arr.push(cls);
      const identifier =
        cls.system.identifier || cls.name.slugify({ strict: true });
      const subclass = subclasses.findSplice(
        (s) => s.system.classIdentifier === identifier
      );
      if (subclass) arr.push(subclass);
      else {
        const subclassAdvancement = cls.advancement.byType.Subclass?.[0];
        if (
          subclassAdvancement &&
          subclassAdvancement.level <= cls.system.levels
        )
          ctx.needsSubclass = true;
      }
      return arr;
    }, []);
    for (const subclass of subclasses) {
      feats.push(subclass);
      const message = game.i18n.format('DND5E.SubclassMismatchWarn', {
        name: subclass.name,
        class: subclass.system.classIdentifier,
      });
      context.warnings.push({ message, type: 'warning' });
    }

    // Organize Features
    const features = {
      race: {
        label: CONFIG.Item.typeLabels.race,
        items: races,
        hasActions: false,
        dataset: { type: 'race' },
      },
      background: {
        label: CONFIG.Item.typeLabels.background,
        items: backgrounds,
        hasActions: false,
        dataset: { type: 'background' },
      },
      classes: {
        label: `${CONFIG.Item.typeLabels.class}Pl`,
        items: classes,
        hasActions: false,
        dataset: { type: 'class' },
        isClass: true,
      },
      active: {
        label: 'DND5E.FeatureActive',
        items: [],
        hasActions: true,
        dataset: { type: 'feat', 'activation.type': 'action' },
      },
      passive: {
        label: 'DND5E.FeaturePassive',
        items: [],
        hasActions: false,
        dataset: { type: 'feat' },
      },
    };
    for (const feat of feats) {
      if (
        feat.system.activities?.size &&
        !feat.system.properties?.has('trait')
      ) {
        features.active.items.push(feat);
        context.itemContext[feat.id].ungroup = 'active';
      } else features.passive.items.push(feat);
    }

    // Assign and return
    context.inventoryFilters = true;
    context.inventory = Object.values(inventory);
    context.spellbook = spellbook;
    context.preparedSpells = nPrepared;
    context.features = Object.values(features);
  }

    /**
   * A helper method to establish the displayed preparation state for an item.
   * @param {Item5e} item     Item being prepared for display.
   * @param {object} context  Context data for display.
   * @protected
   */
    _prepareItemLegacy(item, context) {
      if ( item.type === "spell" ) {
        const prep = item.system.preparation || {};
        const isAlways = prep.mode === "always";
        const isPrepared = !!prep.prepared;
        context.toggleClass = isPrepared ? "active" : "";
        if ( isAlways ) context.toggleClass = "fixed";
        if ( isAlways ) context.toggleTitle = CONFIG.DND5E.spellPreparationModes.always.label;
        else if ( isPrepared ) context.toggleTitle = CONFIG.DND5E.spellPreparationModes.prepared.label;
        else context.toggleTitle = game.i18n.localize("DND5E.SpellUnprepared");
      }
      else {
        const isActive = !!item.system.equipped;
        context.toggleClass = isActive ? "active" : "";
        context.toggleTitle = game.i18n.localize(isActive ? "DND5E.Equipped" : "DND5E.Unequipped");
        context.canToggle = "equipped" in item.system;
      }
    }

  /**
   * Prepare bastion facility data for display.
   */
  async _prepareFacilities(context: CharacterSheetContext): Promise<void> {
    const allDefenders = [];
    const basic = [];
    const special = [];

    // TODO: Consider batching compendium lookups. Most occupants are likely to all be from the same compendium.
    for (const facility of Object.values<any>(this.actor.itemTypes.facility)) {
      const { id, img, labels, name, system } = facility;
      const {
        building,
        craft,
        defenders,
        disabled,
        free,
        hirelings,
        level,
        order,
        progress,
        size,
        trade,
        type,
      } = system;
      const subtitle = [];

      if (!isNil(order, '')) {
        subtitle.push(CONFIG.DND5E.facilities.orders[order]?.label ?? order);
      }

      if (trade.stock.max) {
        subtitle.push(`${trade.stock.value ?? 0} &sol; ${trade.stock.max}`);
      }

      subtitle.push(
        building.built
          ? CONFIG.DND5E.facilities.sizes[size].label
          : FoundryAdapter.localize('DND5E.FACILITY.Build.Unbuilt')
      );

      if (!isNil(level)) {
        subtitle.push(
          FoundryAdapter.localize('DND5E.LevelNumber', { level: level })
        );
      }

      const chosenFacilityContext: ChosenFacilityContext = {
        building,
        craft: craft.item ? await fromUuid(craft.item) : null,
        creatures: await this._prepareFacilityOccupants(trade.creatures),
        defenders: await this._prepareFacilityOccupants(defenders),
        disabled,
        executing: CONFIG.DND5E.facilities.orders[progress.order]?.icon,
        facility: facility,
        free,
        hirelings: await this._prepareFacilityOccupants(hirelings),
        id,
        img: foundry.utils.getRoute(img),
        isSpecial: type.value === CONSTANTS.FACILITY_TYPE_SPECIAL,
        labels,
        name,
        progress,
        subtitle: subtitle.join(' &bull; '),
      };
      allDefenders.push(
        ...chosenFacilityContext.defenders
          .map(({ actor }) => {
            if (!actor) return null;
            const { img, name, uuid } = actor;
            return { img, name, uuid, facility: facility.id };
          })
          .filter((_) => _)
      );

      if (chosenFacilityContext.isSpecial) {
        special.push(chosenFacilityContext);
      } else {
        basic.push(chosenFacilityContext);
      }

      const itemContext = (context.itemContext[facility.id] ??= {});
      itemContext.chosen = chosenFacilityContext;
    }

    context.defenders = allDefenders;
    context.facilities = {
      basic: { chosen: basic, available: [], value: 0, max: 0 },
      special: { chosen: special, available: [], value: 0, max: 0 },
    };
    [CONSTANTS.FACILITY_TYPE_BASIC, CONSTANTS.FACILITY_TYPE_SPECIAL].forEach(
      (type) => {
        const facilities = context.facilities[type];
        const config = CONFIG.DND5E.facilities.advancement[type];
        let [, available] =
          Object.entries(config)
            .reverse()
            .find(([level]) => {
              return level <= this.actor.system.details.level;
            }) ?? [];
        facilities.value = facilities.chosen.filter(
          ({ free }) => type === CONSTANTS.FACILITY_TYPE_BASIC || !free
        ).length;
        facilities.max = available ?? 0;
        available = (available ?? 0) - facilities.value;
        facilities.available = Array.fromRange(Math.max(0, available)).map(
          () => {
            return { label: `DND5E.FACILITY.AvailableFacility.${type}.free` };
          }
        );
      }
    );

    if (!context.facilities.basic.available.length) {
      context.facilities.basic.available.push({
        label: 'DND5E.FACILITY.AvailableFacility.basic.build',
      });
    }
  }

  /**
   * Prepare facility occupants for display.
   */
  _prepareFacilityOccupants(
    occupants: FacilityOccupants
  ): Promise<FacilityOccupantContext[]> {
    const { max, value } = occupants;
    return Promise.all(
      Array.fromRange(max).map(async (i) => {
        const uuid = value[i];
        if (uuid) {
          const actor = await fromUuid(uuid);
          return {
            actor,
            uuid,
          }; // an actor can be removed from the system and still be associated here
        }
        return {
          actor: undefined,
          uuid: undefined,
        };
      })
    );
  }

  async _prepareAttributePins(context: CharacterSheetContext) {
    let flagPins = TidyFlags.attributePins
      .get(this.actor)
      .toSorted((a, b) => (a.sort || 0) - (b.sort || 0));

    let pins: AttributePinContext[] = [];

    for (let pin of flagPins) {
      let document = await fromUuid(pin.id, { relative: this.actor });

      if (document) {
        if (pin.type === 'item') {
          pins.push({
            ...pin,
            linkedUses: context.itemContext[document.id]?.linkedUses,
            document,
          });
        } else if (pin.type === 'activity') {
          pins.push({
            ...pin,
            document,
          });
        }
      } else {
        // Orphaned pins may exist until the next pin/unpin action, when the pins will be reset to valid pins only.
        debug(
          `Attribute pin item with ID ${pin.id} not found. Excluding from final render.`
        );
      }
    }

    context.attributePins = pins;
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

    // Save
    context.save = ItemContext.getItemSaveContext(item);

    // To Hit
    context.toHit = ItemContext.getToHit(item);

    // Activities
    context.activities = Activities.getVisibleActivities(
      item,
      item.system.activities
    )?.map(Activities.getActivityItemContext);

    Activities.applyLinkedUses(item, this.actor, context);
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

  onToggleAbilityProficiency(
    event: MouseEvent & { target: HTMLElement; currentTarget: HTMLElement }
  ) {
    return this._onToggleAbilityProficiency(event);
  }

  onShortRest(event: Event) {
    return this._onShortRest(event);
  }

  onLongRest(event: Event) {
    return this._onLongRest(event);
  }

  /** @inheritDoc */
  _canDragStart(selector: string) {
    return (
      ['[data-tidy-always-draggable]'].includes(selector) ||
      super._canDragStart(selector)
    );
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

  close(options: unknown = {}) {
    this._effectCleanup?.();
    this._destroySvelteComponent();
    delete game.user.apps[this.id];
    return super.close(options);
  }

  submit(): Promise<Tidy5eCharacterSheet> {
    return super.submit();
  }

  async _onSubmit(...args: any[]) {
    await super._onSubmit(...args);
    this.stats.lastSubmissionTime = new Date();
  }

  async _renderOuter() {
    const html = await super._renderOuter();
    if (!game.user.isGM && this.actor.limited) return html;
    const header = html[0].querySelector('.window-header');

    // Preparation warnings.
    const warnings = document.createElement('a');
    warnings.classList.add('preparation-warnings');
    warnings.dataset.tooltip = 'Warnings';
    warnings.setAttribute('aria-label', game.i18n.localize('Warnings'));
    warnings.innerHTML = '<i class="fas fa-triangle-exclamation"></i>';
    warnings.addEventListener('click', this._onOpenWarnings.bind(this));
    header
      .querySelector('.window-title')
      .insertAdjacentElement('afterend', warnings);

    return html;
  }

  /**
   * Handle opening the warnings dialog.
   * @param {PointerEvent} event  The triggering event.
   * @protected
   */
  _onOpenWarnings(event: MouseEvent) {
    event.stopImmediatePropagation();
    // @ts-expect-error
    const { top, left, height } = event.currentTarget!.getBoundingClientRect();
    const { clientWidth } = document.documentElement;
    const dialog = this.form.querySelector('dialog.warnings');
    Object.assign(dialog.style, {
      top: `${top + height}px`,
      left: `${Math.min(left - 16, clientWidth - 300)}px`,
    });
    dialog.showModal();
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

    const [warnings] = this.element.find(
      '.window-header .preparation-warnings'
    );
    warnings?.toggleAttribute(
      'hidden',
      !this.actor._preparationWarnings?.length
    );
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
      const content = this.form.closest('.window-content');
      this._dragDrop.forEach((d: any) => d.bind(content));
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
    this.context.data = data;

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

  deleteOccupant(facilityId: string, prop: string, index: number) {
    const facility = this.actor.items.get(facilityId);

    if (!facility || !prop || index === undefined) {
      return;
    }

    let { value } = foundry.utils.getProperty(facility, prop);

    value = value.filter((_: any, i: number) => i !== index);

    return facility.update({ [`${prop}.value`]: value });
  }

  _getHeaderButtons() {
    const buttons = super._getHeaderButtons();
    return FoundryAdapter.removeConfigureSettingsButtonWhenLockedForNonGm(
      buttons
    );
  }

  _destroySvelteComponent() {
    if (this.component) {
      unmount(this.component);
    }
    this.component = undefined;

    this.additionalComponents.forEach((c) => unmount(c));
    this.additionalComponents = [];
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
    if (!event.target.closest('[data-tidy-favorites], [data-pin-id]')) {
      return super._onDrop(event);
    }

    const dragData = event.dataTransfer?.getData('text/plain');

    if (!dragData) {
      return super._onDrop(event);
    }

    let data;
    try {
      data = JSON.parse(dragData);
    } catch (e) {
      console.error(e);
      return;
    }

    const doc = await fromUuid(data.uuid);
    let relativeUuid = AttributePins.getRelativeUUID(doc);

    if (event.target.closest('[data-pin-id]')) {
      return this._onDropPin(event, { id: relativeUuid, doc });
    }

    let type = 'item' as const;

    return this._onDropFavorite(event, { type, id: relativeUuid });
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

    FoundryAdapter.prepareLanguageTrait(this.actor, traits);

    return traits;
  }

  /** @inheritDoc */
  async _onDropActor(event: DragEvent & { target: HTMLElement }, data: any) {
    if (!event.target.closest('.facility-occupants') || !data.uuid) {
      return super._onDropActor(event, data);
    }

    const facilityId =
      event.target.closest<HTMLElement>('[data-facility-id]')?.dataset?.[
        'facilityId'
      ];

    const facility = this.actor.items.get(facilityId);

    if (!facility) {
      return;
    }

    const propDataset =
      event.target.closest<HTMLElement>('[data-prop]')?.dataset;

    const prop = propDataset?.['prop'];

    if (!prop) {
      return;
    }

    this._onDropActorAddToFacility(facility, prop, data.uuid);
  }

  _onDropActorAddToFacility(facility: Item5e, prop: string, actorUuid: string) {
    const { max, value } = foundry.utils.getProperty(facility, prop);

    if (value.length + 1 > max) {
      return;
    }

    return facility.update({ [`${prop}.value`]: [...value, actorUuid] });
  }

  /* -------------------------------------------- */
  /* Pins
  /* -------------------------------------------- */

  async _onDropPin(
    event: DragEvent & { target: HTMLElement },
    data: { id: string; doc: any }
  ) {
    // If not pinned, then pin it
    const currentPins = TidyFlags.attributePins.get(this.actor);

    const pinType: AttributePinFlag['type'] | undefined =
      data.doc.documentName === CONSTANTS.DOCUMENT_NAME_ITEM
        ? 'item'
        : data.doc.documentName === CONSTANTS.DOCUMENT_NAME_ACTIVITY
        ? 'activity'
        : undefined;

    if (!pinType) {
      return;
    }

    if (!currentPins.find((x) => x.id === data.id)) {
      AttributePins.pin(this.actor, pinType);
      return;
    }

    return await this._onSortPins(event, data.id);
  }

  async _onSortPins(event: DragEvent & { target: HTMLElement }, srcId: string) {
    const targetId = event.target
      ?.closest('[data-pin-id]')
      ?.getAttribute('data-pin-id');

    if (!targetId || srcId === targetId) {
      return;
    }

    let source;
    let target;

    const siblings = TidyFlags.attributePins
      .get(this.actor)
      .filter((f: AttributePinFlag) => {
        if (f.id === targetId) target = f;
        else if (f.id === srcId) source = f;
        return f.id !== srcId;
      });

    const updates = SortingHelpers.performIntegerSort(source, {
      target,
      siblings,
    });

    const pins = TidyFlags.attributePins
      .get(this.actor)
      .reduce(
        (map: Map<string, AttributePinFlag>, f: AttributePinFlag) =>
          map.set(f.id, { ...f }),
        new Map<string, AttributePinFlag>()
      );

    for (const { target, update } of updates) {
      const pin = pins.get(target.id);
      if (pin && update) {
        foundry.utils.mergeObject(pin, update);
      }
    }

    return await TidyFlags.attributePins.set(
      this.actor,
      Array.from(pins.values())
    );
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

  /* -------------------------------------------- */
  /* Class Spellbook Filter
  /* -------------------------------------------- */

  setClassSpellbookFilter(value: string) {
    this.classSpellbookFilter = value;
    this.render();
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
