import { CONSTANTS } from 'src/constants';
import { Tidy5eActorSheetQuadroneBase } from './Tidy5eActorSheetQuadroneBase.svelte';
import type {
  Actor5e,
  ActorInventoryTypes,
  ActorSheetQuadroneContext,
  ActorTraitContext,
  FeatureSection,
  NpcHabitat,
  NpcItemContext,
  NpcSheetQuadroneContext,
  NpcSpellcastingContext,
  SpellcastingClassContext,
  TidyItemSectionBase,
} from 'src/types/types';
import type { CurrencyContext, Item5e } from 'src/types/item.types';
import type {
  ApplicationConfiguration,
  ApplicationRenderOptions,
} from 'src/types/application.types';
import { mount } from 'svelte';
import NpcSheet from './actor/NpcSheet.svelte';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import { ConditionsAndEffects } from 'src/features/conditions-and-effects/ConditionsAndEffects';
import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import { Inventory } from 'src/features/sections/Inventory';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { Container } from 'src/features/containers/Container';
import { NpcSheetQuadroneRuntime } from 'src/runtime/actor/NpcSheetQuadroneRuntime.svelte';
import TableRowActionsRuntime from 'src/runtime/tables/TableRowActionsRuntime.svelte';
import { SheetSections } from 'src/features/sections/SheetSections';
import type { TidyDocumentSheetRenderOptions } from 'src/mixins/TidyDocumentSheetMixin.svelte';
import { splitSemicolons } from 'src/utils/array';
import { getThemeV2 } from 'src/theme/theme';
import { getModifierData } from 'src/utils/formatting';
import UserPreferencesService from 'src/features/user-preferences/UserPreferencesService';
import { isNil } from 'src/utils/data';
import { ItemContext } from 'src/features/item/ItemContext';
import SectionActions from 'src/features/sections/SectionActions';
import { TidyHooks } from 'src/foundry/TidyHooks';

export class Tidy5eNpcSheetQuadrone extends Tidy5eActorSheetQuadroneBase<NpcSheetQuadroneContext>(
  CONSTANTS.SHEET_TYPE_NPC
) {
  currentTabId: string;

  constructor(options?: Partial<ApplicationConfiguration> | undefined) {
    super(options);

    this.currentTabId = CONSTANTS.TAB_NPC_STATBLOCK;
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
      context: new Map<any, any>(this._getActorSvelteContext()),
    });

    initTidy5eContextMenu(this, this.element, CONSTANTS.SHEET_LAYOUT_QUADRONE);

    return component;
  }

  _showDeathSaves: boolean = false;

  async _prepareContext(
    options: ApplicationRenderOptions
  ): Promise<NpcSheetQuadroneContext> {
    if (options?.soft && this._context?.data) {
      return this._context.data;
    }

    const actorContext = (await super._prepareContext(
      options
    )) as ActorSheetQuadroneContext;

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

    const preferences = UserSheetPreferencesService.getByType(this.actor.type);

    const userPreferences = UserPreferencesService.get();

    const currencies: CurrencyContext[] = [];
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

    const background = this.actor.itemTypes.background[0];
    const species = this.actor.itemTypes.race[0];

    const important = Tidy5eNpcSheetQuadrone.isImportantNpc(this.actor);

    const context: NpcSheetQuadroneContext = {
      abilities: this._prepareAbilities(actorContext),
      background: background
        ? {
            id: background.id,
            img: background.img,
            name: background.name,
          }
        : undefined,
      containerPanelItems: await Inventory.getContainerPanelItems(
        actorContext.items
      ),
      conditions: conditions,
      currencies,
      effects: enhancedEffectSections,
      enriched: {
        appearance: await foundry.applications.ux.TextEditor.enrichHTML(
          TidyFlags.appearance.get(this.actor) ?? '',
          enrichmentArgs
        ),
        biography: await foundry.applications.ux.TextEditor.enrichHTML(
          this.actor.system.details.biography.value,
          enrichmentArgs
        ),
        publicBiography: await foundry.applications.ux.TextEditor.enrichHTML(
          this.actor.system.details.biography.public,
          enrichmentArgs
        ),
        bond: await foundry.applications.ux.TextEditor.enrichHTML(
          this.actor.system.details.bond,
          enrichmentArgs
        ),
        flaw: await foundry.applications.ux.TextEditor.enrichHTML(
          this.actor.system.details.flaw,
          enrichmentArgs
        ),
        ideal: await foundry.applications.ux.TextEditor.enrichHTML(
          this.actor.system.details.ideal,
          enrichmentArgs
        ),
        trait: await foundry.applications.ux.TextEditor.enrichHTML(
          TidyFlags.trait.get(this.actor) ?? '',
          enrichmentArgs
        ),
      },
      features: [],
      habitats: [],
      important,
      includeSpellbookInStatblockTab:
        TidyFlags.includeSpellbookInNpcStatblockTab.get(this.actor) ??
        userPreferences.includeSpellbookInNpcStatblockTab ??
        true,
      inventory: [],
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
      showLegendariesOnStatblockTab:
        TidyFlags.showLegendariesOnNpcStatblock.get(this.actor) ??
        userPreferences.showLegendariesOnNpcStatblock ??
        true,
      showLoyaltyTracker:
        important &&
        game.settings.get('dnd5e', 'loyaltyScore') &&
        game.user.isGM,
      specialTraits: this._getSpecialTraits(),
      species: species
        ? {
            id: species.id,
            img: species.img,
            name: species.name,
          }
        : undefined,
      speeds: super._getMovementSpeeds(),
      spellbook: [],
      spellcasting: this._prepareSpellcastingContext(actorContext.rollData),
      spellComponentLabels: FoundryAdapter.getSpellComponentLabels(),
      spellSlotTrackerMode:
        preferences.spellSlotTrackerMode ??
        CONSTANTS.SPELL_SLOT_TRACKER_MODE_VALUE_MAX,
      tools: [],
      traits: this._prepareTraits(),
      treasures: [],
      type: CONSTANTS.SHEET_TYPE_NPC,
      ...actorContext,
      ...this._getClassesAndOrphanedSubclasses(),
    };

    context.skills = this._getSkillsToolsContext(context, 'skills');
    context.tools = this._getSkillsToolsContext(context, 'tools');

    // Prepare owned items
    this._prepareItems(context);

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

    TidyHooks.tidy5eSheetsPrepareSheetContext(this.document, this, context);

    return context;
  }

  static isImportantNpc(actor: Actor5e) {
    return (
      (actor.type === CONSTANTS.SHEET_TYPE_NPC &&
        !foundry.utils.isEmpty(actor.classes)) ||
      actor.system.traits.important
    );
  }

  _prepareItems(context: NpcSheetQuadroneContext) {
    const items: Item5e[] = this.actor.items.filter((item: Item5e) => {
      // Suppress riders for disabled enchantments
      return item.dependentOrigin?.active !== false;
    });

    const isImportant = Tidy5eNpcSheetQuadrone.isImportantNpc(this.actor);

    const inventoryRowActions = TableRowActionsRuntime.getInventoryRowActions(
      context,
      { hasActionsTab: false }
    );

    const inventory: ActorInventoryTypes =
      Inventory.getDefaultInventorySections({
        rowActions: inventoryRowActions,
      });

    type NpcPartitions = {
      inventoryItems: Item5e[];
    };

    let { inventoryItems } = items.reduce(
      (obj: NpcPartitions, item: Item5e) => {
        const ctx = (context.itemContext[item.id] ??= {});

        // Individual item preparation
        this._prepareItem(item, ctx);

        const isWithinContainer = this.actor.items.has(item.system.container);

        if (!isWithinContainer && Inventory.isItemInventoryType(item)) {
          obj.inventoryItems.push(item);
        }

        return obj;
      },
      { inventoryItems: [] as Item5e[] }
    );

    const statblockRowActions =
      TableRowActionsRuntime.getStatblockRowActions(context);

    const createNewStatblockSection = (
      label: string,
      id: string,
      customSectionName?: string
    ): FeatureSection => {
      const dataset: Record<string, any> = {
        type: CONSTANTS.ITEM_TYPE_FEAT,
      };

      if (!isNil(customSectionName, '')) {
        dataset[TidyFlags.section.prop] = customSectionName;
      }

      return {
        type: CONSTANTS.SECTION_TYPE_FEATURE,
        label,
        items: [],
        key: id,
        show: true,
        rowActions: statblockRowActions,
        sectionActions: [],
        dataset: dataset,
        canCreate: true,
      };
    };

    const featureSections = Object.entries(
      CONFIG.DND5E.activityActivationTypes
    ).reduce<Record<string, FeatureSection>>((obj, [id, config], i) => {
      const label = config.header ?? config.label;

      if (!!config.passive) {
        return obj;
      }

      obj[id] ??= createNewStatblockSection(label, id);

      return obj;
    }, {});

    featureSections.passive = createNewStatblockSection(
      'DND5E.Features',
      'passive'
    );

    featureSections.items = createNewStatblockSection('DND5E.Items', 'items');

    const inventoryTypes = Inventory.getInventoryTypes();
    const inventoryTypesSet = new Set(inventoryTypes);

    // TODO: We could loop less by doing all of this in the single pass over items.
    items.forEach((item: Item5e) => {
      if (
        !inventoryTypesSet.has(item.type) &&
        item.type !== CONSTANTS.ITEM_TYPE_FEAT
      ) {
        return;
      }

      const customSectionName = TidyFlags.section.get(item);

      if (customSectionName) {
        const section = (featureSections[customSectionName] ??=
          createNewStatblockSection(
            FoundryAdapter.localize(customSectionName),
            customSectionName,
            customSectionName
          ));

        section.items.push(item);
        return;
      }

      const activationType =
        item.system.activities?.contents[0]?.activation.type;

      const isPassive =
        item.system.properties?.has('trait') ||
        CONFIG.DND5E.activityActivationTypes[activationType]?.passive;

      const section =
        isPassive && !inventoryTypesSet.has(item.type)
          ? 'passive'
          : !activationType && inventoryTypesSet.has(item.type)
          ? 'items'
          : activationType || 'passive';

      if (isImportant && section === 'items') {
        // Important NPCs are anticipated to have potentially a large number of items.
        // Exclude non-actionable inventory items from the Important NPC's statblock tab.
        return;
      }

      featureSections[section]?.items.push(item);
    });

    // Remove any default sections that did not receive an item.
    for (let key of Object.keys(featureSections)) {
      const section = featureSections[key];
      if (!section?.items?.length) {
        delete featureSections[key];
      }
    }

    SheetSections.getFilteredGlobalSectionsToShowWhenEmpty(
      this.actor,
      CONSTANTS.TAB_NPC_STATBLOCK
    ).forEach((sectionName) => {
      featureSections[sectionName] ??= createNewStatblockSection(
        sectionName,
        sectionName
      );
    });

    // Organize items
    // Section the items by type
    for (let item of inventoryItems) {
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
        rowActions: TableRowActionsRuntime.getSpellRowActions(context, {
          hasActionsTab: false,
        }),
      }
    );

    const applyStandardItemHeaderActions = (section: TidyItemSectionBase) => {
      section.sectionActions = SectionActions.getStandardItemHeaderActions(
        this.actor,
        this.actor.isOwner,
        context.unlocked,
        section
      );
    };

    context.inventory = Object.values(inventory);

    // TODO: Could header action prep be organized better?
    context.inventory.forEach(applyStandardItemHeaderActions);

    context.spellbook = spellbook;

    context.spellbook.forEach((section) => {
      section.sectionActions = SectionActions.getSpellbookItemHeaderActions(
        this.actor,
        this.actor.isOwner,
        context.unlocked,
        section
      );
    });

    context.features = Object.values(featureSections);

    context.features.forEach(applyStandardItemHeaderActions);
  }

  protected _prepareItem(item: Item5e, ctx: NpcItemContext) {
    ctx.attunement = FoundryAdapter.getAttunementContext(item);

    if (item.type === CONSTANTS.ITEM_TYPE_SPELL) {
      const linked = item.system.linkedActivity?.item;

      if (this._concentration.items.has(item)) {
        ctx.concentration = true;
      }

      const vsmcr = game.i18n
        .getListFormatter({ style: 'narrow' })
        .format(item.labels.components.all.map((a: any) => a.abbr));

      ctx.subtitle = [
        linked
          ? linked.name
          : this.actor.classes[item.system.sourceClass]?.name,
        vsmcr,
      ].filterJoin(' &bull; ');
    }

    // Save
    ctx.save = ItemContext.getItemSaveContext(item);

    // To Hit
    ctx.toHit = ItemContext.getToHit(item);
  }

  protected _prepareSpellcastingContext(
    rollData: any
  ): (SpellcastingClassContext | NpcSpellcastingContext)[] {
    const classSpellcasting = this._prepareSpellcastingClassContext();

    if (classSpellcasting.length) {
      return classSpellcasting;
    }

    const { abilities, attributes, bonuses } = this.actor.system;
    const msak = dnd5e.utils.simplifyBonus(bonuses.msak.attack, rollData);
    const rsak = dnd5e.utils.simplifyBonus(bonuses.rsak.attack, rollData);
    const ability = attributes.spellcasting;
    const spellAbility = abilities[ability];
    const abilityModValue = spellAbility?.mod ?? 0;
    const abilityMod = getModifierData(abilityModValue);
    const attackBonus = msak === rsak ? msak : 0;
    const attackMod = getModifierData(
      abilityModValue + attributes.prof + attackBonus
    );

    const abilityConfig = CONFIG.DND5E.abilities[ability];
    const npcSpellcasting: NpcSpellcastingContext = {
      type: 'npc',
      name: game.i18n.format('DND5E.SpellcastingClass', {
        class: game.i18n.format('DND5E.NPC.Label'),
      }),
      ability: {
        key: ability,
        mod: abilityMod,
        label: abilityConfig?.label ?? ability,
        abbreviation: abilityConfig?.abbreviation ?? ability,
      },
      attack: {
        mod: attackMod,
      },
      level: attributes.spell.level,
      save: spellAbility?.dc ?? 0,
    };

    return [npcSpellcasting];
  }

  protected _getSheetPinTabIdsForItem(item: Item5e): string[] {
    const tabIds: string[] = [CONSTANTS.TAB_NPC_STATBLOCK];

    const originTab = Inventory.isItemInventoryType(item)
      ? CONSTANTS.TAB_ACTOR_INVENTORY
      : item.type === CONSTANTS.ITEM_TYPE_SPELL
      ? CONSTANTS.TAB_ACTOR_SPELLBOOK
      : null;

    if (originTab) {
      tabIds.push(originTab);
    }

    return tabIds;
  }

  protected _getSpecialTraits(): ActorTraitContext[] {
    const traits = super._getSpecialTraits();

    if (this.document.system.traits.important) {
      traits.unshift({
        label: this.document.system.schema.fields.traits.fields.important.label,
      });
    }

    return traits;
  }

  /* -------------------------------------------- */
  /*  Life-Cycle Handlers                         */
  /* -------------------------------------------- */

  async _renderFrame(options: TidyDocumentSheetRenderOptions) {
    const element = await super._renderFrame(options);

    const theme = getThemeV2(this.actor);
    element.querySelector('.window-header').classList.add(`theme-${theme}`);

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

  async rollFormula() {
    try {
      const roll = await this.document.rollNPCHitPoints();

      const updates: Record<string, any> = {
        'system.attributes.hp.max': roll.total,
      };

      if (
        this.actor.system.attributes.hp.value ===
        this.actor.system.attributes.hp.max
      ) {
        updates['actor.system.attributes.hp.value'] = roll.total;
      }

      this.actor.update(updates);
    } catch (error) {
      ui.notifications.error('DND5E.HPFormulaError', { localize: true });
      throw error;
    }
  }

  applyAverageHP() {
    let formula = this.actor.system.attributes.hp.formula;
    const average = FoundryAdapter.calculateAverageFromFormula(formula);

    return this.actor.update({
      ['system.attributes.hp.value']: average,
      ['system.attributes.hp.max']: average,
    });
  }
}
