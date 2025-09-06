import { CONSTANTS } from 'src/constants';
import type {
  Actor5e,
  ActorInventoryTypes,
  ActorSheetQuadroneContext,
  ExpandedItemData,
  ExpandedItemIdToLocationsMap,
  GroupMemberPortraitContext,
  GroupMemberQuadroneContext,
  GroupMemberSkillContext,
  GroupMembersQuadroneContext,
  GroupSheetQuadroneContext,
  GroupSkill,
  GroupTrait,
  GroupTraitBase,
  GroupTraits,
  LocationToSearchTextMap,
  MeasurableGroupTrait,
  TravelPaceConfigEntry,
} from 'src/types/types';
import type {
  CurrencyContext,
  Item5e,
  ItemChatData,
} from 'src/types/item.types';
import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
import { ExpansionTracker } from 'src/features/expand-collapse/ExpansionTracker.svelte';
import type {
  ApplicationClosingOptions,
  ApplicationConfiguration,
  ApplicationRenderOptions,
} from 'src/types/application.types';
import GroupSheet from './actor/GroupSheet.svelte';
import { mount } from 'svelte';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
import { type TidyDocumentSheetRenderOptions } from 'src/mixins/TidyDocumentSheetMixin.svelte';
import { Tidy5eActorSheetQuadroneBase } from './Tidy5eActorSheetQuadroneBase.svelte';
import { GroupSheetQuadroneRuntime } from 'src/runtime/actor/GroupSheetQuadroneRuntime.svelte';
import { Inventory } from 'src/features/sections/Inventory';
import { TidyFlags } from 'src/api';
import { SheetSections } from 'src/features/sections/SheetSections';
import TableRowActionsRuntime from 'src/runtime/tables/TableRowActionsRuntime.svelte';
import { Container } from 'src/features/containers/Container';
import type { Group5eMember, GroupMemberContext } from 'src/types/group.types';
import { Tidy5eCharacterSheetQuadrone } from './Tidy5eCharacterSheetQuadrone.svelte';
import { coalesce, getModifierData } from 'src/utils/formatting';
import type { SkillData } from 'src/foundry/dnd5e.types';
import { Tidy5eNpcSheetQuadrone } from './Tidy5eNpcSheetQuadrone.svelte';
import { isNil } from 'src/utils/data';
import type { Ref } from 'src/features/reactivity/reactivity.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { DropEffectValue } from 'src/mixins/DragAndDropBaseMixin';

export class Tidy5eGroupSheetQuadrone extends Tidy5eActorSheetQuadroneBase(
  CONSTANTS.SHEET_TYPE_GROUP
) {
  currentTabId: string;
  searchFilters: LocationToSearchTextMap = new Map<string, string>();
  expandedItems: ExpandedItemIdToLocationsMap = new Map<string, Set<string>>();
  expandedItemData: ExpandedItemData = new Map<string, ItemChatData>();
  inlineToggleService = new InlineToggleService();
  sectionExpansionTracker: ExpansionTracker;
  emphasizedMember: Ref<GroupMemberContext | undefined> = $state({
    value: undefined,
  });

  constructor(options?: Partial<ApplicationConfiguration> | undefined) {
    super(options);

    this.currentTabId = CONSTANTS.TAB_MEMBERS;

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
        [CONSTANTS.SVELTE_CONTEXT.EMPHASIZED_MEMBER_REF, this.emphasizedMember],
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

    const paces: TravelPaceConfigEntry[] = Object.entries(
      CONFIG.DND5E.travelPace
    )
      .toSorted((a, b) => a[1].multiplier - b[1].multiplier)
      .map(([key, config], index) => ({ key, config, index }));

    const currentPace =
      paces.find(
        (pace) => pace.key === this.actor.system.attributes.movement.pace
      ) ?? paces[0];

    const enrichmentArgs = {
      secrets: this.actor.isOwner,
      rollData: actorContext.rollData,
      relativeTo: this.actor,
    };

    const context: GroupSheetQuadroneContext = {
      containerPanelItems: await Inventory.getContainerPanelItems(
        actorContext.items
      ),
      currencies,
      enriched: {
        description: {
          full: await foundry.applications.ux.TextEditor.enrichHTML(
            this.actor.system.description.full,
            enrichmentArgs
          ),
          summary: await foundry.applications.ux.TextEditor.enrichHTML(
            this.actor.system.description.summary,
            enrichmentArgs
          ),
        },
      },
      inventory: [],
      sheet: this,
      showContainerPanel: TidyFlags.showContainerPanel.get(this.actor) == true,
      travel: {
        paces,
        currentPace,
        speed:
          currentPace.index === 0
            ? 1 // Slow
            : currentPace.index > 0 && currentPace.index >= paces.length - 1
            ? 3 // Fast
            : 2, // Normal
        units: {
          label:
            CONFIG.DND5E.movementUnits[
              this.actor.system.attributes.movement.units
            ]?.abbreviation ?? this.actor.system.attributes.movement.units,
        },
      },
      type: 'group',
      ...(await this._prepareMemberDependentContext()),
      ...actorContext,
    };

    // etc.

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

    context.tabs = await GroupSheetQuadroneRuntime.getTabs(context);

    return context;
  }

  _prepareItems(context: GroupSheetQuadroneContext) {
    const inventoryRowActions = TableRowActionsRuntime.getInventoryRowActions(
      context,
      { hasActionsTab: false, canEquip: false }
    );

    const inventory: ActorInventoryTypes =
      Inventory.getDefaultInventorySections({
        rowActions: inventoryRowActions,
      });

    let inventoryItems = Array.from(this.actor.items).reduce(
      (inventoryItems: Item5e[], item: Item5e) => {
        const ctx = (context.itemContext[item.id] ??= {});

        // Individual item preparation
        this._prepareItem(item, ctx);

        const isWithinContainer = this.actor.items.has(item.system.container);

        if (!isWithinContainer && Inventory.isItemInventoryType(item)) {
          inventoryItems.push(item);
        }

        return inventoryItems;
      },
      [] as Item5e[]
    );

    const inventoryTypes = Inventory.getInventoryTypes();
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

    context.inventory = Object.values(inventory);
  }

  protected _prepareItem(item: Item5e, ctx: GroupSheetQuadroneContext) {}

  async _prepareMemberDependentContext(): Promise<{
    members: GroupMembersQuadroneContext;
    skills: GroupSkill[];
    traits: GroupTraits;
  }> {
    let sections: GroupMembersQuadroneContext = {
      character: {
        members: [],
        label: 'TYPES.Actor.characterPl',
      },
      npc: {
        members: [],
        label: 'TYPES.Actor.npcPl',
      },
      vehicle: {
        members: [],
        label: 'TYPES.Actor.vehiclePl',
      },
      all: new Map<string, GroupMemberQuadroneContext>(),
    };

    let skills = new Map<string, GroupSkill>(
      Object.entries(CONFIG.DND5E.skills).map<[string, GroupSkill]>(
        ([key, skill]) => [
          key,
          {
            ability: skill.ability,
            high: {
              mod: 0,
              value: '0',
              sign: '+',
            },
            low: {
              mod: 0,
              value: '0',
              sign: '+',
            },
            identifiers: new Map<string, GroupMemberSkillContext>(),
            key,
            name: skill.label,
            proficient: false,
            reference: skill.reference,
          },
        ]
      )
    );

    let traits: GroupTraits = {
      languages: [],
      senses: [],
      specials: [],
      speeds: [],
      tools: [],
    };

    let languages = new Map<string, MeasurableGroupTrait<number>>();
    let senses = new Map<string, MeasurableGroupTrait<number>>();
    let specials = new Map<string, GroupTrait>();
    let speeds = new Map<string, MeasurableGroupTrait<number>>();
    let tools = new Map<string, GroupTrait>();

    for (let { actor } of this.actor.system.members) {
      if (!actor) {
        continue;
      }

      const section = sections[actor.type as SupportedActorType];

      if (!section) {
        continue;
      }

      const accentColor = coalesce(
        // Use the actor's accent color, if configured
        ThemeQuadrone.getSheetThemeSettings({
          doc: actor,
        }).accentColor,
        // Else, use the group sheet's accent color, with fallback to world default accent color
        ThemeQuadrone.getSheetThemeSettings({
          doc: this.actor,
          applyWorldThemeSetting: true,
        }).accentColor
      );

      const groupMemberContext = {
        accentColor: !isNil(accentColor, '') ? accentColor : undefined,
        actor,
        backgroundColor: !isNil(accentColor, '')
          ? `oklch(from ${accentColor} calc(l * 0.75) calc(c * 1.2) h)`
          : undefined,
        encumbrance: this._prepareMemberEncumbrance(actor),
        highlightColor: !isNil(accentColor, '')
          ? `oklch(from ${accentColor} calc(l * 1.4) 60% h)`
          : undefined,
        inspirationSource:
          actor.type === CONSTANTS.SHEET_TYPE_CHARACTER
            ? await Tidy5eCharacterSheetQuadrone.tryGetInspirationSource(actor)
            : undefined,
        portrait: await this._preparePortrait(actor),
        gold: FoundryAdapter.formatNumber(this.getGpSummary(actor)),
        goldAbbreviation: CONFIG.DND5E.currencies.gp?.abbreviation ?? '',
      };

      section.members.push(groupMemberContext);
      sections.all.set(actor.uuid, groupMemberContext);

      // Skills
      Object.entries<SkillData>(
        actor.system.skills ??
          {
            /* Vehicles don't have Skills */
          }
      ).forEach(([key, skill]) => {
        let groupSkill = skills.get(key);
        if (!groupSkill) {
          return;
        }

        const modData = getModifierData(skill.mod);

        if (skill.mod > groupSkill.high.mod) {
          groupSkill.high = {
            mod: skill.mod,
            ...modData,
          };
        }

        groupSkill.identifiers.set(actor.uuid, {
          mod: skill.mod,
          ...modData,
          proficient: skill.proficient,
          passive: skill.passive,
        });

        groupSkill.proficient ||= skill.proficient > 0;
      });

      // Languages
      this._prepareMemberLanguages(actor, languages);

      // Senses
      this._prepareMemberSenses(actor, senses);

      // Specials
      this._prepareMemberSpecials(actor, specials);

      // Speeds
      this._prepareMemberSpeeds(actor, speeds);

      // Tools
      this._prepareMemberTools(actor, tools);
    }

    let groupSkills = [...skills.values()].toSorted((a, b) =>
      a.name.localeCompare(b.name, game.i18n.lang)
    );

    traits.languages = [...languages.values()].toSorted((a, b) =>
      a.label.localeCompare(b.label, game.i18n.lang)
    );
    traits.senses = [...senses.values()].toSorted((a, b) =>
      a.label.localeCompare(b.label, game.i18n.lang)
    );
    traits.specials = [...specials.values()].toSorted((a, b) =>
      a.label.localeCompare(b.label, game.i18n.lang)
    );
    traits.speeds = [...speeds.values()].toSorted((a, b) =>
      a.label.localeCompare(b.label, game.i18n.lang)
    );
    traits.tools = [...tools.values()].toSorted((a, b) =>
      a.label.localeCompare(b.label, game.i18n.lang)
    );

    return {
      members: sections,
      skills: groupSkills,
      traits,
    };
  }

  private _prepareMemberEncumbrance(actor: Actor5e) {
    const { pct, max, value } = actor.system.attributes.encumbrance;
    const defaultUnits = CONFIG.DND5E.encumbrance.baseUnits.default;
    const baseUnits =
      CONFIG.DND5E.encumbrance.baseUnits[actor.type] ?? defaultUnits;
    const systemUnits = game.settings.get('dnd5e', 'metricWeightUnits')
      ? 'metric'
      : 'imperial';
    return {
      pct,
      max: dnd5e.utils.convertWeight(
        max,
        baseUnits[systemUnits],
        defaultUnits[systemUnits]
      ),
      value: dnd5e.utils.convertWeight(
        value,
        baseUnits[systemUnits],
        defaultUnits[systemUnits]
      ),
    };
  }

  private _prepareMemberLanguages(
    actor: any,
    languages: Map<string, MeasurableGroupTrait<number>>
  ) {
    let memberLanguages =
      actor.type === CONSTANTS.SHEET_TYPE_CHARACTER
        ? Tidy5eCharacterSheetQuadrone._getLanguageTraits(actor)
        : actor.type === CONSTANTS.SHEET_TYPE_NPC
        ? Tidy5eNpcSheetQuadrone._getLanguageTraits(actor)
        : [];

    memberLanguages.forEach((language) => {
      const actorLanguageTrait = {
        label: language.label,
        units: language.units,
        unitsKey: language.unitsKey,
        value: language.value !== undefined ? language.value : undefined,
      };

      const groupLanguage =
        languages.get(language.label) ??
        languages
          .set(language.label, {
            identifiers: new Map<string, MeasurableGroupTrait<number>>(),
            ...actorLanguageTrait,
          })
          .get(language.label)!;

      groupLanguage.identifiers.set(actor.uuid, actorLanguageTrait);

      const actorLanguageUniversalValue =
        actorLanguageTrait.value !== undefined &&
        !isNil(actorLanguageTrait.unitsKey, '')
          ? dnd5e.utils.convertLength(
              actorLanguageTrait.value,
              actorLanguageTrait.unitsKey,
              'ft'
            )
          : undefined;

      const groupLanguageUniversalValue =
        groupLanguage.value !== undefined && !isNil(groupLanguage.unitsKey, '')
          ? dnd5e.utils.convertLength(
              groupLanguage.value,
              groupLanguage.unitsKey,
              'ft'
            )
          : undefined;

      if (
        actorLanguageUniversalValue &&
        actorLanguageUniversalValue > (groupLanguageUniversalValue ?? 0)
      ) {
        groupLanguage.value = actorLanguageTrait.value;
        groupLanguage.units = actorLanguageTrait.units;
        groupLanguage.unitsKey = actorLanguageTrait.unitsKey;
      }

      if (!isNil(actor.system.attributes.languages?.custom, '')) {
        dnd5e.utils
          .splitSemicolons(actor.system.attributes.languages.custom?.trim())
          .forEach((customLanguage: string) => {
            const entry =
              languages.get(customLanguage) ??
              languages
                .set(customLanguage, {
                  label: customLanguage,
                  identifiers: new Map<string, GroupTraitBase<number>>(),
                })
                .get(customLanguage)!;

            entry?.identifiers.set(actor.uuid, { label: customLanguage });
          });
      }
    });
  }

  private _prepareMemberSpeeds(
    actor: any,
    speeds: Map<string, MeasurableGroupTrait<number>>
  ) {
    let unitsKey = actor.system.attributes.movement.units;
    let unitsConfig = CONFIG.DND5E.movementUnits[unitsKey];
    let units = unitsConfig?.abbreviation ?? unitsKey;

    Object.entries<number | unknown>(actor.system.attributes.movement).forEach(
      ([key, speed]) => {
        const movementType = CONFIG.DND5E.movementTypes[key];
        if (typeof speed !== 'number' || speed <= 0 || !movementType) {
          return;
        }

        let actorSpeedTrait: GroupTraitBase<number> = {
          label: movementType.label,
          units: units,
          unitsKey: unitsKey,
          value: speed,
        };

        let groupSpeed =
          speeds.get(key) ??
          speeds
            .set(key, {
              identifiers: new Map<string, MeasurableGroupTrait<number>>(),
              ...actorSpeedTrait,
            })
            .get(key)!;

        groupSpeed.identifiers.set(actor.uuid, actorSpeedTrait);

        const actorSpeedUniversalValue =
          actorSpeedTrait.value !== undefined &&
          !isNil(actorSpeedTrait.unitsKey, '')
            ? dnd5e.utils.convertLength(
                actorSpeedTrait.value,
                actorSpeedTrait.unitsKey,
                'ft'
              )
            : undefined;

        const groupSpeedUniversalValue =
          groupSpeed.value !== undefined && !isNil(groupSpeed.unitsKey, '')
            ? dnd5e.utils.convertLength(
                groupSpeed.value,
                groupSpeed.unitsKey,
                'ft'
              )
            : undefined;

        if (
          actorSpeedUniversalValue &&
          actorSpeedUniversalValue > (groupSpeedUniversalValue ?? 0)
        ) {
          groupSpeed.value = actorSpeedTrait.value;
          groupSpeed.units = actorSpeedTrait.units;
          groupSpeed.unitsKey = actorSpeedTrait.unitsKey;
        }
      }
    );
  }

  private _prepareMemberSpecials(
    actor: any,
    specials: Map<string, GroupTrait>
  ) {
    ['dr', 'di', 'ci', 'dv'].forEach((type) => {
      const custom = actor.system.traits[type]?.custom?.trim();
      if (isNil(custom, '')) {
        return;
      }

      dnd5e.utils.splitSemicolons(custom).forEach((customEntry: string) => {
        const groupSpecial =
          specials.get(customEntry) ??
          specials
            .set(customEntry, {
              label: customEntry,
              identifiers: new Set<string>(),
            })
            .get(customEntry)!;

        groupSpecial.identifiers.add(actor.uuid);
      });
    });
  }

  private _prepareMemberSenses(
    actor: any,
    senses: Map<string, MeasurableGroupTrait<number>>
  ) {
    let unitsKey = actor.system.attributes.movement.units;
    let unitsConfig = CONFIG.DND5E.movementUnits[unitsKey];
    let units = unitsConfig?.abbreviation ?? unitsKey;

    Object.entries(actor.system.attributes.senses ?? {}).forEach(
      ([key, sense]) => {
        const label = CONFIG.DND5E.senses[key];
        if (typeof sense !== 'number' || sense === 0 || !label) {
          return;
        }

        let actorSenseTrait: GroupTraitBase<number> = {
          label: label,
          units: units,
          unitsKey: unitsKey,
          value: sense,
        };

        let groupSense =
          senses.get(key) ??
          senses
            .set(key, {
              identifiers: new Map<string, MeasurableGroupTrait<number>>(),
              ...actorSenseTrait,
            })
            .get(key)!;

        groupSense.identifiers.set(actor.uuid, actorSenseTrait);

        const actorSenseUniversalValue =
          actorSenseTrait.value !== undefined &&
          !isNil(actorSenseTrait.unitsKey, '')
            ? dnd5e.utils.convertLength(
                actorSenseTrait.value,
                actorSenseTrait.unitsKey,
                'ft'
              )
            : undefined;

        const groupSenseUniversalValue =
          groupSense.value !== undefined && !isNil(groupSense.unitsKey, '')
            ? dnd5e.utils.convertLength(
                groupSense.value,
                groupSense.unitsKey,
                'ft'
              )
            : undefined;

        if (
          actorSenseUniversalValue &&
          actorSenseUniversalValue > (groupSenseUniversalValue ?? 0)
        ) {
          groupSense.value = actorSenseTrait.value;
          groupSense.units = actorSenseTrait.units;
          groupSense.unitsKey = actorSenseTrait.unitsKey;
        }
      }
    );

    if (!isNil(actor.system.attributes.senses?.special, '')) {
      dnd5e.utils
        .splitSemicolons(actor.system.attributes.senses.special?.trim())
        .forEach((specialSense: string) => {
          const entry =
            senses.get(specialSense) ??
            senses
              .set(specialSense, {
                label: specialSense,
                identifiers: new Map<string, GroupTraitBase<number>>(),
              })
              .get(specialSense)!;

          entry?.identifiers.set(actor.uuid, { label: specialSense });
        });
    }
  }

  private _prepareMemberTools(actor: any, tools: Map<string, GroupTrait>) {
    Object.keys(actor.system.tools ?? {}).forEach((key) => {
      const toolLabel = dnd5e.documents.Trait.keyLabel(key, {
        trait: 'tool',
      });

      const groupTool =
        tools.get(key) ??
        tools
          .set(key, {
            identifiers: new Set<string>(),
            label: toolLabel,
            key: key,
          })
          .get(key)!;

      groupTool.identifiers.add(actor.uuid);
    });
  }

  async _preparePortrait(actor: Actor5e): Promise<GroupMemberPortraitContext> {
    const showTokenPortrait = this.actor.getFlag(
      CONSTANTS.DND5E_SYSTEM_ID,
      CONSTANTS.SYSTEM_FLAG_SHOW_TOKEN_PORTRAIT
    );

    const token = actor.isToken ? actor.token : actor.prototypeToken;

    const defaults = Actor.implementation.getDefaultArtwork(actor._source);
    let src = showTokenPortrait ? token.texture.src : actor.img;

    if (showTokenPortrait && token?.randomImg) {
      const images = await actor.getTokenImages();
      src = images[Math.floor(Math.random() * images.length)];
    }

    if (!src) {
      src = showTokenPortrait ? defaults.texture.src : defaults.img;
    }

    return {
      src,
      isVideo: foundry.helpers.media.VideoHelper.hasVideoExtension(src),
      shape: ThemeQuadrone.getActorPortraitShape(actor),
    };
  }

  /* -------------------------------------------- */
  /*  Drag and Drop                               */
  /* -------------------------------------------- */

  _onDragStart(
    event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement }
  ): void {
    const memberId = event.currentTarget
      .closest('[data-tidy-draggable][data-member-id]')
      ?.getAttribute('data-member-id');

    if (!memberId) {
      super._onDragStart(event);
      return;
    }

    const actor = this.#findMemberActor(memberId);

    if (!actor) {
      return;
    }

    const dragData = actor.toDragData();
    dragData['groupId'] = this.actor.id;
    event.dataTransfer?.setData('text/plain', JSON.stringify(dragData));
  }

  async _onDropActiveEffect(
    ..._args: any[]
  ): Promise</*ActiveEffect*/ unknown | boolean> {
    // Tidy Group Sheet doesn't support active effect drops.
    return false;
  }

  async _onDropActor(
    event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement },
    data: Actor5e
  ): Promise<object | boolean | undefined> {
    if (!this.isEditable) {
      return false;
    }

    const cls = getDocumentClass('Actor');
    const sourceActor = await cls.fromDropData(data);
    if (!sourceActor) {
      return;
    }

    const dragEventData =
      foundry.applications.ux.TextEditor.getDragEventData(event);
    const groupId = dragEventData['groupId'];

    if (groupId !== this.actor.id) {
      return this.actor.system.addMember(sourceActor);
    }

    const dropTarget = event.target?.closest<HTMLElement>(
      '[data-tidy-draggable][data-member-id]'
    );
    const targetMemberId = dropTarget?.getAttribute('data-member-id');

    const targetMemberActor = this.#findMemberActor(targetMemberId);

    if (
      !dropTarget ||
      !targetMemberActor ||
      targetMemberId === sourceActor.id
    ) {
      return false;
    }

    return await this._onSortMember(sourceActor, targetMemberActor);
  }

  #findMemberActor(actorId: string | null | undefined): Actor5e | undefined {
    return this.actor.system.members.find(
      (m: Group5eMember) => m.actor.id === actorId
    )?.actor;
  }

  async _onSortMember(sourceActor: Actor5e, targetActor: Actor5e) {
    const membersCollection: Group5eMember[] =
      this.actor.system.toObject().members;
    const sourceIndex = membersCollection.findIndex(
      (m) => m.actor === sourceActor.id
    );
    const targetIndex = membersCollection.findIndex(
      (m) => m.actor === targetActor.id
    );

    const sortBefore = sourceIndex > targetIndex;

    if (sortBefore) {
      const sourceMember = membersCollection.splice(sourceIndex, 1)[0];
      membersCollection.splice(targetIndex, 0, sourceMember);
    } else {
      const sourceMember = membersCollection[sourceIndex];
      membersCollection.splice(targetIndex + 1, 0, sourceMember);
      membersCollection.splice(sourceIndex, 1);
    }

    return await this.actor.update({ 'system.members': membersCollection });
  }

  async _onDropFolder(
    event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement },
    data: Record<string, any>
  ) {
    if (!this.isEditable) {
      return false;
    }

    const folder = await Folder.implementation.fromDropData(data);

    if (folder.type === 'Actor') {
      const results: any[] = [];
      for (let actor of folder.contents) {
        results.push(await this.actor.system.addMember(actor));
      }
      return results;
    }

    return await super._onDropFolder(event, data);
  }

  getGpSummary(actor: Actor5e) {
    const currency = actor.system.currency;

    return Math.round(
      Object.keys(currency).reduce((total, key) => {
        return key in CONFIG.DND5E.currencies
          ? total + currency[key] / CONFIG.DND5E.currencies[key].conversion
          : total;
      }, 0)
    );
  }

  /* -------------------------------------------- */
  /*  Sheet Actions                               */
  /* -------------------------------------------- */

  changePace(increment: number) {
    if (Number.isNaN(increment)) return;
    const paces = Object.keys(CONFIG.DND5E.travelPace);
    const current = paces.indexOf(
      this.actor.system._source.attributes.movement.pace
    );
    const next =
      (((current + increment) % paces.length) + paces.length) % paces.length;
    this.actor.update({ 'system.attributes.movement.pace': paces[next] });
  }

  award() {
    new dnd5e.applications.Award({
      award: {
        savedDestinations: this.actor.getFlag('dnd5e', 'awardDestinations'),
      },
      origin: this.actor,
    }).render({ force: true });
  }

  /* -------------------------------------------- */
  /*  Life-Cycle Handlers                         */
  /* -------------------------------------------- */

  /** @inheritDoc */
  async _onDropItem(
    event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement },
    item: Item5e
  ) {
    const { uuid } =
      event.target.closest<HTMLElement>('[data-uuid]')?.dataset ?? {};
    const target = await fromUuid(uuid);
    if (target instanceof foundry.documents.Actor)
      return target.sheet._onDropCreateItems(event, [item]);
    return super._onDropItem(event, item);
  }

  /** @inheritDoc */
  async _onDropCreateItems(
    event: DragEvent,
    items: Item5e[],
    behavior?: DropEffectValue | null
  ) {
    let foundNonPhysical = false;
    items = items.filter((item) => {
      if (
        !item.system.constructor._schemaTemplates?.includes(
          dnd5e.dataModels.item.PhysicalItemTemplate
        )
      ) {
        foundNonPhysical = true;
        return false;
      }
      return true;
    });
    if (foundNonPhysical)
      ui.notifications.warn('DND5E.Group.Warning.PhysicalItemOnly', {
        localize: true,
      });
    return super._onDropCreateItems(event, items, behavior);
  }

  /* -------------------------------------------- */
  /*  Life-Cycle Handlers                         */
  /* -------------------------------------------- */

  async _renderFrame(options: TidyDocumentSheetRenderOptions) {
    const element = await super._renderFrame(options);

    element.querySelector('.window-header').classList.add('theme-dark');

    return element;
  }

  async _renderHTML(
    context: GroupSheetQuadroneContext,
    options: ApplicationRenderOptions
  ) {
    game.user.apps[this.id] = this;
    for (const member of this.actor.system.members) {
      member.actor.apps[this.id] = this;
    }
    return await super._renderHTML(context, options);
  }

  async close(options: ApplicationClosingOptions = {}) {
    delete game.user.apps[this.id];
    for (const member of this.actor.system.members) {
      delete member.actor.apps[this.id];
    }
    return await super.close(options);
  }
}

type SupportedActorType =
  | typeof CONSTANTS.SHEET_TYPE_CHARACTER
  | typeof CONSTANTS.SHEET_TYPE_NPC
  | typeof CONSTANTS.SHEET_TYPE_VEHICLE;
