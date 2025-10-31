import { CONSTANTS } from 'src/constants';
import type {
  ApplicationConfiguration,
  ApplicationRenderOptions,
} from 'src/types/application.types';
import CharacterSheet from './actor/CharacterSheet.svelte';
import { mount } from 'svelte';
import type {
  ActiveEffect5e,
  Actor5e,
  ActorInventoryTypes,
  ActorSheetQuadroneContext,
  CharacterItemContext,
  CharacterItemPartitions,
  CharacterSheetQuadroneContext,
  CharacterSpeedSenseContext,
  ActorSpeedSenseEntryContext,
  ChosenFacilityContext,
  FacilityOccupantContext,
  FavoriteContextEntry,
  InspirationSource,
  FeatureSection,
  ActorTraitContext,
} from 'src/types/types';
import type { CurrencyContext, Item5e } from 'src/types/item.types';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import { CharacterSheetQuadroneRuntime } from 'src/runtime/actor/CharacterSheetQuadroneRuntime.svelte';
import { ConditionsAndEffects } from 'src/features/conditions-and-effects/ConditionsAndEffects';
import { Tidy5eActorSheetQuadroneBase } from './Tidy5eActorSheetQuadroneBase.svelte';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type {
  Activity5e,
  CharacterFavorite,
  FacilityOccupants,
} from 'src/foundry/dnd5e.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { isNil } from 'src/utils/data';
import type { TidyDocumentSheetRenderOptions } from 'src/mixins/TidyDocumentSheetMixin.svelte';
import { CharacterSheetSections } from 'src/features/sections/CharacterSheetSections';
import { SheetSections } from 'src/features/sections/SheetSections';
import { Inventory } from 'src/features/sections/Inventory';
import { Activities } from 'src/features/activities/activities';
import { ItemContext } from 'src/features/item/ItemContext';
import { Container } from 'src/features/containers/Container';
import TableRowActionsRuntime from 'src/runtime/tables/TableRowActionsRuntime.svelte';
import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import type { DropEffectValue } from 'src/mixins/DragAndDropBaseMixin';
import { clamp } from 'src/utils/numbers';
import { ActorInspirationRuntime } from 'src/runtime/actor/ActorInspirationRuntime.svelte';
import { SettingsProvider } from 'src/settings/settings.svelte';
import { error } from 'src/utils/logging';
import { CharacterSheetQuadroneSidebarRuntime } from 'src/runtime/actor/CharacterSheetQuadroneSidebarRuntime.svelte';
import { SheetTabConfigurationQuadroneApplication } from 'src/applications/tab-configuration/SheetTabConfigurationQuadroneApplication.svelte';
import { getActorTabContext } from 'src/applications/tab-configuration/tab-configuration-functions';
import type { RenderedSheetPart } from '../CustomContentRendererV2';

export class Tidy5eCharacterSheetQuadrone extends Tidy5eActorSheetQuadroneBase(
  CONSTANTS.SHEET_TYPE_CHARACTER
) {
  currentTabId: string;
  currentSidebarTabId: string;

  constructor(options?: Partial<ApplicationConfiguration> | undefined) {
    super(options);

    this.currentTabId = CONSTANTS.TAB_ACTOR_ACTIONS;
    this.currentSidebarTabId = CONSTANTS.TAB_CHARACTER_SIDEBAR_FAVORITES;
  }

  static DEFAULT_OPTIONS: Partial<
    ApplicationConfiguration & { dragDrop: Partial<DragDropConfiguration>[] }
  > = {
    position: {
      width: 740,
      height: 810,
    },
    actions: {
      openSidebarTabConfiguration: async function (
        this: Tidy5eCharacterSheetQuadrone
      ) {
        new SheetTabConfigurationQuadroneApplication({
          document: this.document,
          customTabConfigProvider: {
            getTabConfig: TidyFlags.sidebarTabConfiguration.get,
            setTabConfig: TidyFlags.sidebarTabConfiguration.set,
            getTabContext: (doc, setting) => {
              return getActorTabContext(
                CharacterSheetQuadroneSidebarRuntime,
                doc.documentName,
                setting,
                true,
                CONSTANTS.WORLD_TAB_CONFIG_KEY_CHARACTER_SIDEBAR
              );
            },
          },
          title: FoundryAdapter.localize('TIDY5E.TabConfiguration.Title', {
            documentName: FoundryAdapter.localize(
              'TIDY5E.Character.Sidebar.Title'
            ),
          }),
        }).render({ force: true });
      },
    },
  };

  _createComponent(node: HTMLElement): Record<string, any> {
    if (this.actor.limited) {
      return this._createLimitedViewComponent(node);
    }

    const component = mount(CharacterSheet, {
      target: node,
      context: new Map<any, any>(this._getActorSvelteContext()),
    });

    initTidy5eContextMenu(this, this.element, CONSTANTS.SHEET_LAYOUT_QUADRONE);

    return component;
  }

  _showDeathSaves: boolean = false;

  async _prepareContext(
    options: ApplicationRenderOptions
  ): Promise<CharacterSheetQuadroneContext> {
    this._concentration = this.actor.concentration;

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

    const currencies: CurrencyContext[] = [];

    const preferences = UserSheetPreferencesService.getByType(this.actor.type);

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

    let inspirationSource: InspirationSource | undefined =
      await Tidy5eCharacterSheetQuadrone.tryGetInspirationSource(this.actor);

    let background = this.actor.system.details.background;
    let species = this.actor.system.details.race;

    const context: CharacterSheetQuadroneContext = {
      abilities: this._prepareAbilities(actorContext),
      background: background
        ? {
            id: background.id,
            img: background.img,
            name: background.name,
          }
        : undefined,
      conditions: conditions,
      containerPanelItems: await Inventory.getContainerPanelItems(
        actorContext.items
      ),
      creatureType: this._getCreatureType(),
      currencies,
      defenders: [],
      // TODO: Consider deferring enrichment to tab rendering, so tab selection can preclude it.
      effects: enhancedEffectSections,
      enriched: {
        appearance: await foundry.applications.ux.TextEditor.enrichHTML(
          this.actor.system.details.appearance,
          enrichmentArgs
        ),
        bastion: await foundry.applications.ux.TextEditor.enrichHTML(
          this.actor.system.bastion.description,
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
          this.actor.system.details.trait,
          enrichmentArgs
        ),
        biography: await foundry.applications.ux.TextEditor.enrichHTML(
          this.actor.system.details.biography.value,
          enrichmentArgs
        ),
      },
      epicBoonsEarned: undefined,
      facilities: {
        basic: { chosen: [], available: [], value: 0, max: 0 },
        special: { chosen: [], available: [], value: 0, max: 0 },
      },
      favorites: await this._prepareFavorites(),
      features: [],
      initialSidebarTabId: this.currentSidebarTabId,
      inspirationSource,
      inventory: [],
      senses: this._getCharacterSenses(),
      sidebarTabs: [],
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
      showContainerPanel: TidyFlags.showContainerPanel.get(this.actor) == true,
      showDeathSaves: this._showDeathSaves,
      species: species
        ? {
            id: species.id,
            img: species.img,
            name: species.name,
          }
        : undefined,
      specialTraits: this._getSpecialTraits(),
      speeds: this._getCharacterMovementSpeeds(),
      spellbook: [],
      spellcasting: this._prepareSpellcastingClassContext(),
      spellComponentLabels: FoundryAdapter.getSpellComponentLabels(),
      spellSlotTrackerMode:
        preferences.spellSlotTrackerMode ??
        CONSTANTS.SPELL_SLOT_TRACKER_MODE_VALUE_MAX,
      tools: [],
      traits: this._prepareTraits(),
      type: CONSTANTS.SHEET_TYPE_CHARACTER,
      ...this._getClassesAndOrphanedSubclasses(),
      ...actorContext,
    };

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

    // Prepare owned items
    this._prepareItems(context);

    await this._prepareFacilities(context);

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

    context.customContent = await CharacterSheetQuadroneRuntime.getContent(
      context
    );

    context.sidebarTabs = await CharacterSheetQuadroneSidebarRuntime.getTabs(
      context
    );

    context.tabs = await CharacterSheetQuadroneRuntime.getTabs(context);

    return context;
  }

  private _getSpecialTraits(): ActorTraitContext[] {
    const dnd5eFlags = this.actor.flags.dnd5e;

    if (!dnd5eFlags) {
      return [];
    }

    const characterFlags = CONFIG.DND5E.characterFlags;

    return Object.entries(characterFlags)
      .filter(([name]) => name in dnd5eFlags && dnd5eFlags[name] !== false)
      .map(([key, val]) => {
        if ('type' in val && val.type === Number)
          return { label: val.name, value: dnd5eFlags[key] };
        return { label: val.name };
      });
  }

  public static async tryGetInspirationSource(
    actor: Actor5e
  ): Promise<InspirationSource | undefined> {
    let apiConfig = ActorInspirationRuntime.bankedInspirationConfig;

    if (!!apiConfig?.change && !!apiConfig?.getData) {
      try {
        let data = await apiConfig.getData(actor.sheet, actor);

        return {
          change: async (delta) => {
            await apiConfig.change!(actor.sheet, actor, delta);
            actor.render(); // calling render() on the document itself triggers all subscribing applications to re-render
          },
          value: data?.value ?? 0,
          max: data?.max ?? 0,
        };
      } catch (e) {
        error(
          'An error occurred while attempting to get data for custom inspiration',
          false,
          e
        );
      }
    }

    if (!SettingsProvider.settings.enableBankedInspiration.get()) {
      return;
    }

    let inspirationSourceId = TidyFlags.inspirationSource.get(actor);
    let inspirationSourceItem = actor.items.get(inspirationSourceId);

    let inspirationSource: InspirationSource | undefined;

    if (inspirationSourceItem?.system?.uses.max) {
      inspirationSource = {
        change: async (delta: number) => {
          let newValue = inspirationSourceItem.system.uses.value + delta;

          const max = inspirationSourceItem.system.uses.max;
          let uses = clamp(0, newValue, max);

          return await inspirationSourceItem.update({
            ['system.uses.spent']: max - uses,
          });
        },
        itemId: inspirationSourceItem.id,
        max: inspirationSourceItem.system.uses.max,
        value: inspirationSourceItem.system.uses.value,
      };
    }

    return inspirationSource;
  }

  /**
   * Prepare favorites for display.
   */
  async _prepareFavorites() {
    let entries: FavoriteContextEntry[] = [];

    let favorites = this.actor.system.favorites.sort(
      (a: CharacterFavorite, b: CharacterFavorite) => a.sort - b.sort
    ) as CharacterFavorite[];

    for (let { id, type } of favorites) {
      const favorite = await fromUuid(id, { relative: this.actor });
      if (
        !favorite &&
        (type === 'item' || type === 'effect' || type === 'activity')
      ) {
        continue;
      }

      if (type === 'item') {
        // Only include a supposed "item" type if the actor owns it
        this.actor.items.get(favorite.id) &&
          entries.push({
            id,
            type: 'item',
            item: favorite,
            capacity:
              favorite.type === CONSTANTS.SHEET_TYPE_CONTAINER
                ? await favorite.system.computeCapacity()
                : null,
          });
        continue;
      } else if (type === 'effect') {
        // Only include a supposed "effect" type if its document name matches
        // TODO: Find a performant way to tell if this actor should be able to see this effect
        favorite.documentName === CONSTANTS.DOCUMENT_NAME_ACTIVE_EFFECT &&
          entries.push({
            id,
            type: 'effect',
            effect: favorite,
          });
        continue;
      } else if (type === 'activity') {
        // Only include a supposed "activity" type the actor owns it
        this.actor.items.get(favorite.item.id) &&
          entries.push({
            id,
            type: 'activity',
            activity: favorite,
          });
        continue;
      } else if (type === 'slots') {
        const {
          value,
          max,
          level,
          type: method,
        } = this.actor.system.spells[id] ?? {};
        const uses = { value, max, field: `system.spells.${id}.value` };

        const model = CONFIG.DND5E.spellcasting[method];

        const plurals = new Intl.PluralRules(game.i18n.lang, {
          type: 'ordinal',
        });

        const hasNoModelOrIsSingleLevel = !model || model.isSingleLevel;

        let name = hasNoModelOrIsSingleLevel
          ? game.i18n.localize(`DND5E.SpellSlots${id.capitalize()}`)
          : game.i18n.format(`DND5E.SpellSlotsN.${plurals.select(level)}`, {
              n: level,
            });

        let img = hasNoModelOrIsSingleLevel
          ? model?.img || CONFIG.DND5E.spellcasting.pact.img
          : model.img.replace('{id}', id);

        entries.push({
          type: 'slots',
          id,
          uses,
          level,
          name,
          img,
        });
      } else if (['skill', 'tool'].includes(type)) {
        const data = this.actor.system[`${type}s`]?.[id];

        if (!data) {
          continue;
        }

        let img;
        let name;
        let reference;

        if (type === 'tool') {
          reference = dnd5e.documents.Trait.getBaseItemUUID(
            CONFIG.DND5E.tools[id]?.id ?? ''
          );
          ({ img, name: name } = dnd5e.documents.Trait.getBaseItem(reference, {
            indexOnly: true,
          }));
        } else if (type === 'skill') {
          ({ icon: img, label: name, reference } = CONFIG.DND5E.skills[id]);
        }

        entries.push({
          type,
          id,
          key: id,
          img: img,
          name,
          reference,
        });
      }
    }

    return entries;
  }

  _prepareItems(context: CharacterSheetQuadroneContext) {
    const inventoryRowActions = TableRowActionsRuntime.getInventoryRowActions(
      context,
      { hasActionsTab: true }
    );

    // Categorize items as inventory, spellbook, features, and classes
    const inventory: ActorInventoryTypes =
      Inventory.getDefaultInventorySections({
        rowActions: inventoryRowActions,
      });

    // Partition items by category
    let { backgrounds, classes, feats, items, species, spells, subclasses } =
      Array.from(this.actor.items).reduce(
        (obj: CharacterItemPartitions, item: Item5e) => {
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
          const originId = FoundryAdapter.getAdvancementOriginId(item);
          const originItem = this.actor.items.get(originId);
          switch (originItem?.type) {
            case CONSTANTS.ITEM_TYPE_RACE:
              ctx.group = 'species';
              break;
            case CONSTANTS.ITEM_TYPE_BACKGROUND:
              ctx.group = CONSTANTS.ITEM_TYPE_BACKGROUND;
              break;
            case CONSTANTS.ITEM_TYPE_CLASS:
              ctx.group = originItem.identifier;
              break;
            case CONSTANTS.ITEM_TYPE_SUBCLASS:
              ctx.group = originItem.class?.identifier ?? 'other';
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
        }
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

    // Section spells
    const spellbook = SheetSections.prepareTidySpellbook(
      context,
      CONSTANTS.TAB_ACTOR_SPELLBOOK,
      spells,
      {
        canCreate: true,
        rowActions: TableRowActionsRuntime.getSpellRowActions(context, {
          hasActionsTab: true,
        }),
      }
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

    // Section Features
    const features: FeatureSection[] =
      CharacterSheetSections.buildQuadroneFeatureSections(
        this.actor,
        context.unlocked,
        CONSTANTS.TAB_CHARACTER_FEATURES,
        feats,
        {
          canCreate: true,
          rowActions:
            TableRowActionsRuntime.getCharacterFeatureRowActions(context),
        }
      );

    // Apply sections to their section lists

    context.inventory = Object.values(inventory);

    context.spellbook = spellbook;

    context.features = Object.values(features);
  }

  /**
   * A helper method to establish the displayed preparation state for an item.
   * @param {Item5e} item     Item being prepared for display.
   * @param {object} context  Context data for display.
   * @protected
   */
  protected _prepareItem(item: Item5e, context: CharacterItemContext) {
    if (item.type === CONSTANTS.ITEM_TYPE_SPELL) {
      const linked = item.system.linkedActivity?.item;

      if (this._concentration.items.has(item)) {
        context.concentration = true;
      }

      const vsmcr = game.i18n.getListFormatter({ style: 'narrow' }).format(
        item.labels.components.all
          .filter((a: any) => !isNil(a?.abbr)) // a valid use case with Default Sheets is to exclude Abbreviation. Quadrone's design doesn't account for that, so we will exclude any components that don't supply an abbreviation.
          .map((a: any) => a.abbr)
      );

      context.subtitle = context.actionSubtitle = [
        linked
          ? linked.name
          : this.actor.classes[item.system.sourceClass]?.name,
        vsmcr,
      ].filterJoin(' &bull; ');
    } else if (Inventory.isItemInventoryType(item)) {
      const containerName = this.actor.items.get(item.system.container)?.name;
      context.actionSubtitle = [containerName].filterJoin(' &bull; ');
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

    context.linkedUses = Activities.getLinkedUses(item);
  }

  /* -------------------------------------------- */

  _getCharacterSenses(): CharacterSpeedSenseContext {
    const senses = super._getSenses();

    const main: ActorSpeedSenseEntryContext[] = [];

    if (senses.at(0)?.key === 'darkvision') {
      main.push(senses.shift()!);
    }

    return {
      main: main,
      secondary: senses,
      traitEntries: [...main, ...senses],
    };
  }

  _getCharacterMovementSpeeds(): CharacterSpeedSenseContext {
    const speeds = super._getMovementSpeeds();

    const main = speeds.slice(0, 2);
    const secondary = speeds.slice(2);
    return {
      main: main,
      secondary: secondary,
      traitEntries: [...main, ...secondary],
    };
  }

  /**
   * Prepare bastion facility data for display.
   */
  async _prepareFacilities(
    context: CharacterSheetQuadroneContext
  ): Promise<void> {
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

  protected _getSheetPinTabIdsForItem(sheetPin: Item5e): string[] {
    const tabIds: string[] = [CONSTANTS.TAB_ACTOR_ACTIONS];

    const originTab = Inventory.isItemInventoryType(sheetPin)
      ? CONSTANTS.TAB_ACTOR_INVENTORY
      : sheetPin.type === CONSTANTS.ITEM_TYPE_SPELL
      ? CONSTANTS.TAB_ACTOR_SPELLBOOK
      : sheetPin.type === CONSTANTS.ITEM_TYPE_FEAT
      ? CONSTANTS.TAB_CHARACTER_FEATURES
      : null;

    if (originTab) {
      tabIds.push(originTab);
    }

    return tabIds;
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
    context: CharacterSheetQuadroneContext,
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

  /* -------------------------------------------- */
  /*  Custom Content Rendering                    */
  /* -------------------------------------------- */

  async _getCustomContents(
    context: CharacterSheetQuadroneContext,
    options: TidyDocumentSheetRenderOptions
  ): Promise<RenderedSheetPart[]> {
    const renderedTabParts = context.sidebarTabs
      ? await this._customContentRenderer.renderTabContents(
          context.sidebarTabs,
          context,
          options
        )
      : [];

    return renderedTabParts;
  }

  /* -------------------------------------------- */
  /*  Drag and Drop                               */
  /* -------------------------------------------- */

  /** @override */
  _defaultDropBehavior(
    event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement },
    data: any
  ): DropEffectValue {
    if (
      data.dnd5e?.action === 'favorite' ||
      (['Activity', 'Item'].includes(data.type) &&
        event.target.closest('.favorites'))
    ) {
      return 'link';
    }

    return super._defaultDropBehavior(event, data);
  }

  _onDragStart(
    event: DragEvent & { target: HTMLElement; currentTarget: HTMLElement }
  ) {
    if (!event.dataTransfer) {
      return;
    }

    // Sorting Favorites
    const favoriteEl = event.target.closest('[data-favorite-id]');
    const favoriteId = favoriteEl?.getAttribute('data-favorite-id');
    const favorite = this.actor.system.favorites.find(
      (f: CharacterFavorite) => f.id === favoriteId
    ) as CharacterFavorite | undefined;

    if (favorite) {
      const favoriteSortDragData = {
        dnd5e: {
          action: 'favorite',
          type: favorite.type,
          id: favorite.id,
        },
      };

      event.dataTransfer.setData(
        'application/json',
        JSON.stringify(favoriteSortDragData)
      );

      event.dataTransfer.effectAllowed = 'link';

      return;
    }

    const { key } =
      event.target.closest<HTMLElement>('[data-key]')?.dataset ?? {};

    const isSlots = !!event.target.closest('[data-slots]');

    let type;
    if (!isNil(key) && key in CONFIG.DND5E.skills) {
      type = 'skill';
    } else if (!isNil(key) && key in CONFIG.DND5E.tools) {
      type = 'tool';
    } else if (isSlots) {
      type = 'slots';
    }
    if (!type) return super._onDragStart(event);

    // Add another deferred deactivation to catch the second pointerenter event that seems to be fired on Firefox.
    requestAnimationFrame(() => game.tooltip.deactivate());
    game.tooltip.deactivate();

    const dragData: Record<string, any> = {
      dnd5e: { action: 'favorite', type },
    };

    dragData.dnd5e.id = key;

    event.dataTransfer.setData('application/json', JSON.stringify(dragData));
    event.dataTransfer.effectAllowed = 'link';
  }

  async _onDrop(
    event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement }
  ) {
    if (!event.target.closest('.favorites')) {
      return await super._onDrop(event);
    }

    const dragData =
      event.dataTransfer!.getData('application/json') ||
      event.dataTransfer!.getData('text/plain');

    if (!dragData) {
      return await super._onDrop(event);
    }

    let data;

    try {
      data = JSON.parse(dragData);
    } catch (e) {
      console.error(e);
      return;
    }
    const { action, type, id } = data.dnd5e ?? {};

    // Add to Favorites
    if (action === 'favorite') {
      return await this._onDropFavorite(event, { type, id });
    }

    // Handle Activity drop
    if (data.type === 'Activity') {
      const activity = await fromUuid(data.uuid);
      if (activity) {
        return await this._onDropActivity(event, activity);
      }
    }

    return await super._onDrop(event);
  }

  /** @inheritDoc */
  async _onDropActor(
    event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement },
    document: Actor5e
  ) {
    if (!event.target.closest('.facility-occupants') || !document.uuid) {
      return await super._onDropActor(event, document);
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

    await this._onDropActorAddToFacility(facility, prop, document.uuid);
  }

  _onDropActorAddToFacility(facility: Item5e, prop: string, actorUuid: string) {
    const { max, value } = foundry.utils.getProperty(facility, prop);

    if (value.length + 1 > max) {
      return;
    }

    return facility.update({ [`${prop}.value`]: [...value, actorUuid] });
  }

  /**
   * Handle an owned item or effect being dropped in the favorites area.
   * @param {PointerEvent} event         The triggering event.
   * @param {ActorFavorites5e} favorite  The favorite that was dropped.
   * @returns {Promise<Actor5e>|void}
   * @protected
   */
  async _onDropFavorite(
    event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement },
    favorite: { type: string; id: string }
  ): Promise<Actor5e> | Promise<any> {
    // Sort if it's already a favorite
    if (this.actor.system.hasFavorite(favorite.id)) {
      return await this._onSortFavorites(event, favorite.id);
    }

    // Add and sort if it's a new favorite, so it drops right in the place where the user wanted it.
    await this.actor.system.addFavorite(favorite);
    return await this._onSortFavorites(event, favorite.id);
  }

  /**
   * Handle re-ordering the favorites list.
   * @param {DragEvent} event  The drop event.
   * @param {string} srcId     The identifier of the dropped favorite.
   * @returns {Promise<Actor5e>|void}
   * @protected
   */
  async _onSortFavorites(
    event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement },
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
    const updates = foundry.utils.SortingHelpers.performIntegerSort(source, {
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

  /** @inheritDoc */
  async _onDropActiveEffect(
    event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement },
    effect: ActiveEffect5e
  ) {
    if (!event.target.closest('.favorites') || effect.target !== this.actor) {
      return await super._onDropActiveEffect(event, effect);
    }
    const uuid = effect.getRelativeUUID(this.actor);
    return await this._onDropFavorite(event, { type: 'effect', id: uuid });
  }

  /**
   * Handle dropping an Activity onto the sheet.
   * @param {DragEvent} event    The originating drag event.
   * @param {Activity} activity  The dropped Activity document.
   * @returns {Promise<Actor5e|void>}
   * @protected
   */
  async _onDropActivity(
    event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement },
    document: Activity5e
  ): Promise<Actor5e | void> {
    if (!event.target.closest('.favorites') || document.actor !== this.actor) {
      return await super._onDropActivity(event, document);
    }

    const relativeUuid = `${document.item.getRelativeUUID(
      this.actor
    )}.Activity.${document.id}`;

    return await this._onDropFavorite(event, {
      type: 'activity',
      id: relativeUuid,
    });
  }

  async _onDropItem(
    event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement },
    document: Item5e
  ) {
    if (!event.target.closest('.favorites') || document.parent !== this.actor) {
      // Handle Feature Origin Transfer
      let targetOrigin = event.target.closest<HTMLElement>(
        '[data-tidy-section-key]'
      )?.dataset?.[CONSTANTS.SYSTEM_FLAG_PATH_ADVANCEMENT_ORIGIN];

      let sourceItemOrigin = FoundryAdapter.getProperty(
        document,
        CONSTANTS.SYSTEM_FLAG_PATH_ADVANCEMENT_ORIGIN
      );

      if (sourceItemOrigin !== targetOrigin && document.parent === this.actor) {
        !isNil(targetOrigin)
          ? await document.update({
              [CONSTANTS.SYSTEM_FLAG_PATH_ADVANCEMENT_ORIGIN]: targetOrigin,
            })
          : await document.unsetFlag(
              'dnd5e',
              CONSTANTS.SYSTEM_FLAG_ADVANCEMENT_ORIGIN
            );
      }

      return await super._onDropItem(event, document);
    }
    const uuid = document.getRelativeUUID(this.actor);
    return await this._onDropFavorite(event, { type: 'item', id: uuid });
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
}
