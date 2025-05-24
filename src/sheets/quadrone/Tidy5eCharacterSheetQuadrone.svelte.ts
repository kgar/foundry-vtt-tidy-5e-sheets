import { CONSTANTS } from 'src/constants';
import type {
  ApplicationConfiguration,
  ApplicationRenderOptions,
} from 'src/types/application.types';
import CharacterSheet from './actor/CharacterSheet.svelte';
import { mount } from 'svelte';
import type {
  ActorSheetQuadroneContext,
  ActorTraitContext,
  AttributePinContext,
  CharacterClassEntryContext,
  CharacterSheetQuadroneContext,
  CharacterSpeedSenseContext,
  CharacterSpeedSenseEntryContext,
  ChosenFacilityContext,
  CreatureTypeContext,
  ExpandedItemData,
  ExpandedItemIdToLocationsMap,
  FacilityOccupantContext,
  FavoriteContextEntry,
  LocationToSearchTextMap,
  MessageBus,
} from 'src/types/types';
import type { Item5e, ItemChatData } from 'src/types/item.types';
import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
import { ItemFilterService } from 'src/features/filtering/ItemFilterService.svelte';
import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime.svelte';
import { ExpansionTracker } from 'src/features/expand-collapse/ExpansionTracker.svelte';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import CharacterSheetQuadroneRuntime, {
  TempDefaultCharacterQuadroneTabs,
} from 'src/runtime/actor/CharacterSheetQuadroneRuntime.svelte';
import ActorHeaderStart from './actor/parts/ActorHeaderStart.svelte';
import { ConditionsAndEffects } from 'src/features/conditions-and-effects/ConditionsAndEffects';
import { Tidy5eActorSheetQuadroneBase } from './Tidy5eActorSheetQuadroneBase.svelte';
import { debug } from 'src/utils/logging';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type {
  CharacterFavorite,
  FacilityOccupants,
} from 'src/foundry/dnd5e.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { isNil } from 'src/utils/data';
import type { TidyDocumentSheetRenderOptions } from 'src/mixins/TidyDocumentSheetMixin.svelte';

export class Tidy5eCharacterSheetQuadrone extends Tidy5eActorSheetQuadroneBase(
  CONSTANTS.SHEET_TYPE_CHARACTER
) {
  currentTabId: string;
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

    this.currentTabId = CONSTANTS.TAB_CHARACTER_FAVORITES;
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

    initTidy5eContextMenu(this, this.element, CONSTANTS.SHEET_LAYOUT_QUADRONE);

    return component;
  }

  _createAdditionalComponents(node: HTMLElement) {
    const windowHeader = this.element.querySelector('.window-header');

    const headerStart = mount(ActorHeaderStart, {
      target: windowHeader,
      anchor: windowHeader.querySelector('.window-title'),
      context: new Map<string, any>([
        [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this._context],
      ]),
    });

    return [headerStart];
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
    let { conditions, effects: enhancedEffectSections } =
      await ConditionsAndEffects.getConditionsAndEffectsForActor(
        this.actor,
        this.object,
        actorContext.effects
      );

    actorContext.effects = enhancedEffectSections;

    const context: CharacterSheetQuadroneContext = {
      attributePins: await this._prepareAttributePins(actorContext),
      bastion: {
        description: await foundry.applications.ux.TextEditor.enrichHTML(
          this.actor.system.bastion.description,
          {
            secrets: this.actor.isOwner,
            rollData: actorContext.rollData,
            relativeTo: this.actor,
          }
        ),
      },
      conditions: conditions,
      creatureType: this._getCreatureType(),
      defenders: [],
      epicBoonsEarned: undefined,
      facilities: {
        basic: { chosen: [], available: [], value: 0, max: 0 },
        special: { chosen: [], available: [], value: 0, max: 0 },
      },
      favorites: await this._prepareFavorites(),
      senses: this._getSenses(),
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
      showDeathSaves: this._showDeathSaves,
      speeds: this._getMovementSpeeds(),
      tools: [],
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

    await this._prepareFacilities(context);

    context.skills = this._getSkillsToolsContext(context, 'skills');
    context.tools = this._getSkillsToolsContext(context, 'tools');

    context.customContent = await CharacterSheetQuadroneRuntime.getContent(
      context
    );

    const defaultTabs: string[] = TempDefaultCharacterQuadroneTabs;
    let tabs = (await CharacterSheetQuadroneRuntime.getTabs(context))
      .filter((t) => defaultTabs?.includes(t.id))
      .sort((a, b) => defaultTabs.indexOf(a.id) - defaultTabs.indexOf(b.id));

    context.tabs = tabs;

    return context;
  }

  _getClassesAndOrphanedSubclasses(): {
    classes: CharacterClassEntryContext[];
    orphanedSubclasses: Item5e[];
  } {
    const subclasses: Item5e[] = Object.values(this.actor.subclasses);
    const classes = Object.values(this.actor.classes)
      .map<CharacterClassEntryContext>((cls: Item5e) => {
        const maxLevelDelta =
          CONFIG.DND5E.maxLevel - this.actor.system.details.level;

        const spellcasting = cls.system.spellcasting
          ? {
              dc: cls.system.spellcasting.save,
              ability: (
                CONFIG.DND5E.abilities[cls.system.spellcasting.ability]
                  ?.abbreviation ?? cls.system.spellcasting.ability
              )?.toLocaleUpperCase(),
            }
          : undefined;

        const subclass = subclasses.findSplice(
          (s: Item5e) => s.system.classIdentifier === cls.identifier
        );

        let needsSubclass = false;
        if (!subclass) {
          const subclassAdvancement = cls.advancement.byType.Subclass?.[0];
          needsSubclass =
            subclassAdvancement &&
            subclassAdvancement.level <= cls.system.levels;
        }

        return {
          name: cls.name,
          levels: cls.system.levels,
          isOriginalClass: cls.system.isOriginalClass,
          spellcasting,
          item: cls,
          img: cls.img,
          availableLevels: Array.fromRange(CONFIG.DND5E.maxLevel + 1)
            .slice(1)
            .map((level) => {
              const delta = level - cls.system.levels;
              return { level, delta, disabled: delta > maxLevelDelta };
            }),
          uuid: cls.uuid,
          subclass,
          needsSubclass,
        };
      })
      .toSorted((left, right) => right.levels - left.levels);

    return { classes, orphanedSubclasses: subclasses };
  }

  _getCreatureType(): CreatureTypeContext {
    const { details } = this.actor.system;

    return {
      icon:
        CONFIG.DND5E.creatureTypes[details.type.value]?.icon ??
        'icons/svg/mystery-man.svg',
      title:
        details.type.value === 'custom'
          ? details.type.custom
          : CONFIG.DND5E.creatureTypes[details.type.value]?.label,
      reference: CONFIG.DND5E.creatureTypes[details.type.value]?.reference,
      subtitle: details.type.subtype,
    };
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
        entries.push({
          type: 'item',
          item: favorite,
          capacity:
            favorite.type === CONSTANTS.SHEET_TYPE_CONTAINER
              ? await favorite.system.computeCapacity()
              : null,
        });
        continue;
      } else if (type === 'effect') {
        entries.push({
          type: 'effect',
          effect: favorite,
        });
        continue;
      } else if (type === 'activity') {
        entries.push({
          type: 'activity',
          activity: favorite,
        });
        continue;
      } else if (type === 'slots') {
        const { value, max, level } = this.actor.system.spells[id] ?? {};
        const uses = { value, max, field: `system.spells.${id}.value` };

        const isLeveledSpell = /spell\d+/.test(id);
        let img = !isLeveledSpell
          ? CONFIG.DND5E.spellcastingTypes[id]?.img ||
            CONFIG.DND5E.spellcastingTypes.pact.img
          : CONFIG.DND5E.spellcastingTypes.leveled.img.replace('{id}', id);

        const plurals = new Intl.PluralRules(game.i18n.lang, {
          type: 'ordinal',
        });

        let name = !isLeveledSpell
          ? game.i18n.localize(`DND5E.SpellSlots${id.capitalize()}`)
          : game.i18n.format(`DND5E.SpellSlotsN.${plurals.select(level)}`, {
              n: level,
            });

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
            CONFIG.DND5E.tools[id]?.id
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

  /* -------------------------------------------- */

  _getSenses(): CharacterSpeedSenseContext {
    const senseConfig = this.actor.system.attributes.senses;

    const senses = Object.entries(CONFIG.DND5E.senses)
      .reduce<CharacterSpeedSenseEntryContext[]>((acc, [key, label]) => {
        const value = senseConfig[key];

        if (!value || value === 0) {
          return acc;
        }

        acc.push({
          key,
          label,
          value: Math.round(+value).toString(),
          units: senseConfig.units,
        });

        return acc;
      }, [])
      .toSorted((left, right) =>
        left.key === 'darkvision'
          ? -1
          : right.key === 'darkvision'
          ? 1
          : +right.value - +left.value
      );

    const main: CharacterSpeedSenseEntryContext[] = [];

    if (senses.at(0)?.key === 'darkvision') {
      main.push(senses.shift()!);
    }

    return {
      main: main,
      secondary: senses,
      traitEntries: [...main, ...senses],
    };
  }

  _getMovementSpeeds(): CharacterSpeedSenseContext {
    const movement = this.actor.system.attributes.movement;

    const speeds = Object.entries(CONFIG.DND5E.movementTypes)
      .reduce<CharacterSpeedSenseEntryContext[]>((acc, [key, label]) => {
        const value = movement[key];

        if (!value || value === 0) {
          return acc;
        }

        acc.push({
          key,
          label,
          value: Math.round(+value).toString(),
          units: movement.units,
        });

        return acc;
      }, [])
      .toSorted((left, right) =>
        left.key === 'walk'
          ? -1
          : right.key === 'walk'
          ? 1
          : +right.value - +left.value
      );

    if (speeds.length === 0) {
      const defaultWalkSpeed =
        this.document.system.details?.race?.system?.movement?.walk ?? null;

      speeds.push({
        key: 'walk',
        label: CONFIG.DND5E.movementTypes.walk,
        units: movement.units,
        value: defaultWalkSpeed ?? '0',
      });
    }

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

  async _prepareAttributePins(context: ActorSheetQuadroneContext) {
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

    return pins;
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
  /*  Sheet Actions                               */
  /* -------------------------------------------- */

  /**
   * Handle finding an available item of a given type.
   */
  async findItem(args: {
    event: Event;
    type: string;
    classIdentifier?: string;
    facilityType?: string;
  }) {
    const { event, classIdentifier, facilityType, type } = args;

    const filters: Record<string, any> = {
      locked: { types: new Set([type]) },
    };

    if (classIdentifier) {
      filters.locked.additional = { class: { [classIdentifier]: 1 } };
    }

    if (type === 'class') {
      const existingIdentifiers = new Set(Object.keys(this.actor.classes));
      filters.locked.arbitrary = [
        {
          o: 'NOT',
          v: { k: 'system.identifier', o: 'in', v: existingIdentifiers },
        },
      ];
    }

    if (type === 'facility' && facilityType) {
      const otherType = facilityType === 'basic' ? 'special' : 'basic';
      filters.locked.additional = {
        type: { [facilityType]: 1, [otherType]: -1 },
        level: { max: this.actor.system.details.level },
      };
    }

    let result = await dnd5e.applications.CompendiumBrowser.selectOne({
      filters,
    });

    if (result) {
      this._onDropItemCreate(
        game.items.fromCompendium(await fromUuid(result), { keepId: true }),
        event,
        'copy'
      );
    }
  }
}
