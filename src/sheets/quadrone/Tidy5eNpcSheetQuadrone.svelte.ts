import { CONSTANTS } from 'src/constants';
import { Tidy5eActorSheetQuadroneBase } from './Tidy5eActorSheetQuadroneBase.svelte';
import type {
  ActorInventoryTypes,
  ActorSheetQuadroneContext,
  ExpandedItemData,
  ExpandedItemIdToLocationsMap,
  LocationToSearchTextMap,
  NpcHabitat,
  NpcItemContext,
  NpcSheetQuadroneContext,
} from 'src/types/types';
import type {
  CurrencyContext,
  Item5e,
  ItemChatData,
} from 'src/types/item.types';
import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
import { ExpansionTracker } from 'src/features/expand-collapse/ExpansionTracker.svelte';
import type {
  ApplicationConfiguration,
  ApplicationRenderOptions,
} from 'src/types/application.types';
import { mount } from 'svelte';
import NpcSheet from './actor/NpcSheet.svelte';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import { ConditionsAndEffects } from 'src/features/conditions-and-effects/ConditionsAndEffects';
import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import { Inventory } from 'src/features/sections/Inventory';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { Container } from 'src/features/containers/Container';
import { NpcSheetQuadroneRuntime } from 'src/runtime/actor/NpcSheetQuadroneRuntime.svelte';
import TableRowActionsRuntime from 'src/runtime/tables/TableRowActionsRuntime.svelte';
import { SheetSections } from 'src/features/sections/SheetSections';
import type { TidyDocumentSheetRenderOptions } from 'src/mixins/TidyDocumentSheetMixin.svelte';
import { splitSemicolons } from 'src/utils/array';
import { SettingsProvider } from 'src/settings/settings.svelte';
import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';

export class Tidy5eNpcSheetQuadrone extends Tidy5eActorSheetQuadroneBase(
  CONSTANTS.SHEET_TYPE_NPC
) {
  currentTabId: string;
  searchFilters: LocationToSearchTextMap = new Map<string, string>();
  expandedItems: ExpandedItemIdToLocationsMap = new Map<string, Set<string>>();
  expandedItemData: ExpandedItemData = new Map<string, ItemChatData>();
  inlineToggleService = new InlineToggleService();
  sectionExpansionTracker: ExpansionTracker;

  constructor(options?: Partial<ApplicationConfiguration> | undefined) {
    super(options);

    this.currentTabId = CONSTANTS.TAB_NPC_STATBLOCK;

    this.sectionExpansionTracker = new ExpansionTracker(
      true,
      this.document,
      CONSTANTS.LOCATION_SECTION
    );
  }

  static DEFAULT_OPTIONS: Partial<
    ApplicationConfiguration & { dragDrop: Partial<DragDropConfiguration>[] }
  > = {
      position: {
        width: 740,
        height: 810,
      },
    };

  _createComponent(node: HTMLElement): Record<string, any> {
    if (this.actor.limited) {
      return this._createLimitedViewComponent(node);
    }

    const component = mount(NpcSheet, {
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
        ...this._getActorSvelteContext(),
      ]),
    });

    initTidy5eContextMenu(this, this.element, CONSTANTS.SHEET_LAYOUT_QUADRONE);

    return component;
  }

  _showDeathSaves: boolean = false;

  async _prepareContext(
    options: ApplicationRenderOptions
  ): Promise<NpcSheetQuadroneContext> {
    // this._concentration = this.actor.concentration;

    const actorContext = (await super._prepareContext(
      options
    )) as ActorSheetQuadroneContext;

    const themeSettings = ThemeQuadrone.getSheetThemeSettings({
      doc: this.actor,
    });

    // Effects & Conditions
    let baseEffects =
      dnd5e.applications.components.EffectsElement.prepareCategories(
        this.actor.allApplicableEffects()
      );
    let { conditions, effects: enhancedEffectSections } =
      await ConditionsAndEffects.getConditionsAndEffectsForActorQuadrone(
        actorContext,
        this.object,
        baseEffects
      );

    const currencies: CurrencyContext[] = [];

    const preferences = SheetPreferencesService.getByType(this.actor.type);

    Object.keys(CONFIG.DND5E.currencies).forEach((key) =>
      currencies.push({
        key: key,
        value: this.actor.system.currency[key] as number,
        abbr:
          CONFIG.DND5E.currencies[key as keyof typeof CONFIG.DND5E.currencies]
            ?.abbreviation ?? key,
      })
    );

    const enrichmentArgs = {
      secrets: this.actor.isOwner,
      rollData: actorContext.rollData,
      relativeTo: this.actor,
    };
    const showToken =
      this.actor.flags.dnd5e?.[CONSTANTS.SYSTEM_FLAG_SHOW_TOKEN_PORTRAIT] ===
      true || themeSettings.portraitShape === 'token';
    const effectiveToken = this.actor.isToken
      ? this.actor.token
      : this.actor.prototypeToken;

    const context: NpcSheetQuadroneContext = {
      containerPanelItems: await Inventory.getContainerPanelItems(
        actorContext.items
      ),
      conditions: conditions,
      currencies,
      effects: enhancedEffectSections,
      enriched: {
        biography: await foundry.applications.ux.TextEditor.enrichHTML(
          this.actor.system.details.biography.value,
          enrichmentArgs
        ),
      },
      features: [],
      habitats: [],
      inventory: [],
      portrait: {
        shape: showToken ? 'token' : themeSettings.portraitShape ?? 'round',
        src: showToken
          ? effectiveToken?.texture.src ?? this.actor.img
          : this.actor.img,
        path: showToken ? 'prototypeToken.texture.src' : 'img',
      },
      showContainerPanel: TidyFlags.showContainerPanel.get(this.actor) == true,
      showDeathSaves: this._showDeathSaves,
      senses: super._getSenses(),
      size: {
        key: this.actor.system.traits.size,
        label:
          CONFIG.DND5E.actorSizes[this.actor.system.traits.size]?.label ??
          this.actor.system.traits.size,
        abbr:
          CONFIG.DND5E.actorSizes[this.actor.system.traits.size]
            ?.abbreviation ?? '—',
        mod: this.actor.system.attributes.encumbrance.mod,
      },
      skills: [],
      showLairTracker:
        actorContext.unlocked ||
        (actorContext.modernRules && this.actor.system.resources.lair.value) ||
        (!actorContext.modernRules &&
          this.actor.system.resources.lair.initiative),
      showLegendaryActions:
        actorContext.unlocked || this.actor.system.resources.legact.max,
      showLegendaryResistances:
        actorContext.unlocked || this.actor.system.resources.legres.max,
      showLoyaltyTracker:
        this.actor.system.traits.important &&
        game.settings.get('dnd5e', 'loyaltyScore'),
      speeds: super._getMovementSpeeds(),
      spellbook: [],
      spellComponentLabels: FoundryAdapter.getSpellComponentLabels(),
      spellSlotTrackerMode:
        preferences.spellSlotTrackerMode ??
        CONSTANTS.SPELL_SLOT_TRACKER_MODE_VALUE_MAX,
      tools: [],
      treasures: [],
      type: CONSTANTS.SHEET_TYPE_NPC,
      ...actorContext,
    };

    context.skills = this._getSkillsToolsContext(context, 'skills');
    context.tools = this._getSkillsToolsContext(context, 'tools');

    for (const panelItem of context.containerPanelItems) {
      const ctx = context.itemContext[panelItem.container.id];
      ctx.containerContents = await Container.getContainerContents(
        panelItem.container,
        {
          hasActor: true,
          unlocked: actorContext.unlocked,
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
      context.habitats = habitat.value
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
      context.treasures = details.treasure.value
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

    context.speeds = this._getMovementSpeeds();

    context.customContent = await NpcSheetQuadroneRuntime.getContent(context);

    context.tabs = await NpcSheetQuadroneRuntime.getTabs(context);

    return context;
  }

  _prepareItems(context: NpcSheetQuadroneContext) {
    const inventoryRowActions =
      TableRowActionsRuntime.getInventoryRowActions(context);

    const inventory: ActorInventoryTypes =
      Inventory.getDefaultInventorySections({
        rowActions: inventoryRowActions,
      });

    type NpcPartitions = {
      items: Item5e[];
    };

    // TODO: Populate any item context.
    let { items } = Array.from(this.actor.items).reduce(
      (obj: NpcPartitions, item: Item5e) => {
        const ctx = (context.itemContext[item.id] ??= {});

        // Individual item preparation
        this._prepareItem(item, ctx);

        const isWithinContainer = this.actor.items.has(item.system.container);

        if (!isWithinContainer && Inventory.isItemInventoryType(item)) {
          obj.items.push(item);
        }

        return obj;
      },
      { items: [] as Item5e[] }
    );

    const inventoryTypes = Inventory.getInventoryTypes();
    // Organize items
    // Section the items by type
    for (let item of items) {
      const ctx = (context.itemContext[item.id] ??= {});
      ctx.totalWeight = item.system.totalWeight?.toNearest(0.1);
      Inventory.applyInventoryItemToSection(inventory, item, inventoryTypes, {
        canCreate: true,
        rowActions: inventoryRowActions,
      });
    }

    SheetSections.getFilteredGlobalSectionsToShowWhenEmpty(
      context.actor,
      CONSTANTS.TAB_ACTOR_INVENTORY
    ).forEach((s) => {
      inventory[s] ??= Inventory.createInventorySection(s, inventoryTypes, {
        canCreate: true,
        rowActions: inventoryRowActions,
      });
    });

    const spellbook = SheetSections.prepareTidySpellbook(
      context,
      CONSTANTS.TAB_ACTOR_SPELLBOOK,
      this.actor.itemTypes.spell,
      {
        canCreate: true,
        rowActions: TableRowActionsRuntime.getSpellRowActions(context),
      }
    );

    // Apply sections to their section lists

    context.inventory = Object.values(inventory);

    context.spellbook = spellbook;

    // TODO: Finish
  }

  protected _prepareItem(item: Item5e, context: NpcItemContext) {
    // TODO
  }

  /* -------------------------------------------- */
  /*  Life-Cycle Handlers                         */
  /* -------------------------------------------- */

  async _renderFrame(options: TidyDocumentSheetRenderOptions) {
    const element = await super._renderFrame(options);

    element.querySelector('.window-header').classList.add('theme-dark');

    return element;
  }

  async _preRender(
    context: NpcSheetQuadroneContext,
    options: TidyDocumentSheetRenderOptions
  ) {
    await super._preRender(context, options);

    // Show death tray at 0 HP
    const renderContext = options.renderContext ?? options.action;
    const renderData = options.renderData ?? options.data;
    const isUpdate =
      renderContext === 'update' || renderContext === 'updateActor';
    const hp = foundry.utils.getProperty(
      renderData ?? {},
      'system.attributes.hp.value'
    );

    if (isUpdate && hp === 0) {
      this._showDeathSaves = context.showDeathSaves = true;
    }
  }

  toggleDeathSaves(force?: boolean) {
    this._showDeathSaves = force ?? !this._showDeathSaves;
    this.render();
  }
}
