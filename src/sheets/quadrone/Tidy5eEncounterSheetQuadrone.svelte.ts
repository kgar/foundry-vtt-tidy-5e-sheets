import { CONSTANTS } from 'src/constants';
import type {
  Actor5e,
  ActorSheetQuadroneContext,
  EncounterPlaceholderQuadroneContext,
  EncounterCreatureTypeContext,
  EncounterMemberQuadroneContext,
  EncounterSheetQuadroneContext,
  EncounterTraits,
  GroupSkill,
  GroupTrait,
  MeasurableGroupTrait,
  MultiActorQuadroneContext,
  DifficultyTarget,
  EncounterMemberSection,
  EncounterCombatSection,
  EncounterMemberCombatantQuadroneContext,
} from 'src/types/types';
import { ExpansionTracker } from 'src/features/expand-collapse/ExpansionTracker.svelte';
import type {
  ApplicationConfiguration,
  ApplicationRenderOptions,
} from 'src/types/application.types';
import { mount } from 'svelte';
import EncounterSheet from './actor/EncounterSheet.svelte';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import type { TidyDocumentSheetRenderOptions } from 'src/mixins/TidyDocumentSheetMixin.svelte';
import { EncounterSheetQuadroneRuntime } from 'src/runtime/actor/EncounterSheetQuadroneRuntime.svelte';
import { getTidy5eMultiActorSheetQuadroneBase } from './Tidy5eMultiActorSheetQuadroneBase.svelte';
import { coalesce } from 'src/utils/formatting';
import { isNil } from 'src/utils/data';
import { applyNumberInputConstraints } from 'src/utils/form';
import { mapGetOrInsertComputed } from 'src/utils/map';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Ref } from 'src/features/reactivity/reactivity.types';
import type { EncounterMemberContext } from 'src/types/group.types';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { TidyFlags } from 'src/foundry/TidyFlags';
import {
  type EncounterCombatantSettings,
  type EncounterPlaceholder,
} from 'src/foundry/TidyFlags.types';
import { CombatantSettings } from 'src/features/combat/CombatantSettings';
import { Inventory } from 'src/features/sections/Inventory';
import type { Item5e } from 'src/types/item.types';
import { EncounterMemberColumnRuntime } from 'src/runtime/table-columns/EncounterMemberColumnRuntime';
import { EncounterMemberRowActionRuntime } from 'src/runtime/table-row-actions/EncounterMemberRowActions.svelte';
import { EncounterCombatantMemberRowActionRuntime } from 'src/runtime/table-row-actions/EncounterCombatantRowActionRuntime.svelte';
import { EncounterCombatantColumnRuntime } from 'src/runtime/table-columns/EncounterCombatantColumnRuntime';

export class Tidy5eEncounterSheetQuadrone extends getTidy5eMultiActorSheetQuadroneBase<EncounterSheetQuadroneContext>(
  CONSTANTS.SHEET_TYPE_ENCOUNTER,
) {
  static DEFAULT_ENCOUNTER_PLACEHOLDER_ICON = 'icons/svg/mystery-man.svg';

  currentTabId: string;
  emphasizedMember: Ref<EncounterMemberContext | undefined> = $state({
    value: undefined,
  });
  aggregatePinTab = {
    tabId: CONSTANTS.TAB_MEMBERS,
    tabName: 'DND5E.ENCOUNTER.Tab.Members',
  };

  constructor(options?: Partial<ApplicationConfiguration> | undefined) {
    super(options);

    this.currentTabId = CONSTANTS.TAB_MEMBERS;

    this.sectionExpansionTracker = new ExpansionTracker(
      true,
      this.document,
      CONSTANTS.LOCATION_SECTION,
    );
  }

  static DEFAULT_OPTIONS: Partial<
    ApplicationConfiguration & { dragDrop: Partial<DragDropConfiguration>[] }
  > = {
    position: {
      width: 740,
      height: 810,
    },
    actions: {
      addAllAsPlaceholders: Tidy5eEncounterSheetQuadrone.#addAllAsPlaceholders,
      addNewLairPlaceholder:
        Tidy5eEncounterSheetQuadrone.#addNewLairPlaceholder,
      addNewPlaceholder: Tidy5eEncounterSheetQuadrone.#addNewPlaceholder,
      addToCombatAsPlaceholder:
        Tidy5eEncounterSheetQuadrone.#addToCombatAsPlaceholder,
      browseAddNpc: Tidy5eEncounterSheetQuadrone.#browseAddNpc,
      editPlaceholderImage: Tidy5eEncounterSheetQuadrone.#editPlaceholderImage,
      prerollAllInitiatives:
        Tidy5eEncounterSheetQuadrone.#prerollAllInitiatives,
      prerollInitiative: Tidy5eEncounterSheetQuadrone.#prerollInitiative,
      removeMember: Tidy5eEncounterSheetQuadrone.#removeMember,
      rollQuantities: Tidy5eEncounterSheetQuadrone.#rollQuantities,
      showPlaceholderArtwork:
        Tidy5eEncounterSheetQuadrone.#showPlaceholderArtwork,
      toggleCombatantInclusion:
        Tidy5eEncounterSheetQuadrone.#toggleCombatantInclusion,
      toggleCombatantVisibility:
        Tidy5eEncounterSheetQuadrone.#toggleCombatantVisibility,
    },
  };

  static _lockedSkillAllowlist = new Set<string>(['ins', 'per']);

  _createComponent(node: HTMLElement): Record<string, any> {
    if (this.actor.limited) {
      return this._createLimitedViewComponent(node);
    }

    const component = mount(EncounterSheet, {
      target: node,
      context: new Map<any, any>([
        [CONSTANTS.SVELTE_CONTEXT.EMPHASIZED_MEMBER_REF, this.emphasizedMember],
        ...this._getActorSvelteContext(),
      ]),
    });

    initTidy5eContextMenu(this, this.element, CONSTANTS.SHEET_LAYOUT_QUADRONE);

    return component;
  }

  async _prepareContext(
    options: ApplicationRenderOptions,
  ): Promise<EncounterSheetQuadroneContext> {
    if (options?.tidy?.soft && this._context?.data) {
      return this._context.data;
    }

    const actorContext = (await super._prepareContext(
      options,
    )) as MultiActorQuadroneContext<Tidy5eEncounterSheetQuadrone>;

    const enrichmentArgs = {
      secrets: this.actor.isOwner,
      rollData: actorContext.rollData,
      relativeTo: this.actor,
    };

    const difficultyTargets: DifficultyTarget[] = (game.actors as Actor5e[])
      .filter((x: Actor5e) => x.type === 'group')
      .map(
        (x: Actor5e) =>
          ({
            id: x.id,
            name: x.name,
            primary: x.id === game.actors.party?.id,
          }) satisfies DifficultyTarget,
      );

    if (!game.actors.party) {
      difficultyTargets.push({
        name: FoundryAdapter.localize('TIDY5E.Group.PrimaryParty.Label'),
        primary: true,
        id: '',
      });
    }

    let difficultyTargetId = TidyFlags.encounterDifficultyTargetGroupId.get(
      game.user,
    );

    if (!difficultyTargets.find((t) => t.id === difficultyTargetId)) {
      difficultyTargetId = game.actors.party?.id ?? '';
    }

    const difficultyTarget = game.actors.get(difficultyTargetId);
    const difficulty = await this.actor.system.getDifficulty(difficultyTarget);

    const { creatures, level } = difficultyTarget?.system ?? {};

    const [low, med, high] = (
      CONFIG.DND5E.ENCOUNTER_DIFFICULTY[level] ?? []
    ).map((t) => t * creatures.length);

    const xp = await this.actor.system.getXPValue();

    const context: EncounterSheetQuadroneContext = {
      difficulty: {
        label: difficulty
          ? FoundryAdapter.localize(`DND5E.ENCOUNTER.Difficulty.${difficulty}`)
          : null,
        value: xp,
        max: high ?? Infinity,
        pct: high ? Math.min((xp / high) * 100, 100) : 0,
        stops: {
          low: high ? (low / high) * 100 : 0,
          high: high ? (med / high) * 100 : 0,
        },
        availableTargets: difficultyTargets.sort((a, b) =>
          a.name.localeCompare(b.name, game.i18n.lang),
        ),
        targetId: difficultyTargetId,
      },
      enriched: {
        description: {
          full: await foundry.applications.ux.TextEditor.enrichHTML(
            this.actor.system.description.full,
            enrichmentArgs,
          ),
          summary: await foundry.applications.ux.TextEditor.enrichHTML(
            this.actor.system.description.summary,
            enrichmentArgs,
          ),
        },
      },
      totalCurrency: this.getDefaultCurrencySummary(this.actor),
      totalXp: await this.actor.system.getXPValue(),
      type: 'encounter',
      ...(await this._prepareMemberDependentContext(actorContext)),
      ...actorContext,
    };

    context.customContent =
      await EncounterSheetQuadroneRuntime.getContent(context);

    context.tabs = await EncounterSheetQuadroneRuntime.getTabs(context);

    TidyHooks.tidy5eSheetsPrepareSheetContext(this.document, this, context);

    return context;
  }

  async _prepareMemberDependentContext(
    context: ActorSheetQuadroneContext,
  ): Promise<{
    combat: EncounterCombatSection[];
    creatureTypes: EncounterCreatureTypeContext[];
    members: EncounterMemberSection[];
    memberContext: {
      npc: EncounterMemberQuadroneContext[];
      all: Map<string, EncounterMemberQuadroneContext>;
    };
    skills: GroupSkill[];
    traits: EncounterTraits;
  }> {
    const members = await this.getMembers();

    let skills = this._getMemberGroupSkillMap();

    const npcMap = new Map<string, EncounterMemberQuadroneContext>();
    const combatants: (
      | EncounterMemberCombatantQuadroneContext
      | EncounterPlaceholderQuadroneContext
    )[] = [];
    const creatureTypes = new Map<string, EncounterCreatureTypeContext>();
    const languages = new Map<string, MeasurableGroupTrait<number>>();
    const senses = new Map<string, MeasurableGroupTrait<number>>();
    const specials = new Map<string, GroupTrait>();
    const speeds = new Map<string, MeasurableGroupTrait<number>>();

    const memberContexts = await Promise.all(
      members.map(async ({ actor, quantity }, index) => {
        const combatantSettings = CombatantSettings.getEntry(
          this.actor,
          actor.uuid,
        );

        const accentColor = coalesce(
          // Use the actor's accent color, if configured, which references global themes if configured
          TidyFlags.sheetThemeSettings.get(actor)?.accentColor,
          // Else, use the group sheet's accent color, with fallback to world default accent color
          // Else, use the encounter sheet's accent color, with fallback to world default accent color
          context.themeSettings.accentColor,
        );

        this._prepareMemberSkills(actor, skills);
        this._prepareMemberCreatureType(actor, creatureTypes, quantity);
        this._prepareMemberLanguages(actor, languages);
        this._prepareMemberSenses(actor, senses);
        this._prepareMemberSpecials(actor, specials);
        this._prepareMemberSpeeds(actor, speeds);

        const memberContext: EncounterMemberQuadroneContext = {
          actor,
          quantity,
          accentColor,
          backgroundColor: !isNil(accentColor, '')
            ? `oklch(from ${accentColor} calc(l * 0.75) calc(c * 1.2) h)`
            : undefined,
          canEdit: FoundryAdapter.documentIsEditable(actor),
          highlightColor: !isNil(accentColor, '')
            ? `oklch(from ${accentColor} calc(l * 1.4) 60% h)`
            : undefined,
          index,
          name: actor.name,
          portrait: await this._preparePortrait(actor),
          initiative: combatantSettings.initiative,
          includeInCombat: combatantSettings.include,
          visible: combatantSettings.visible,
          type: 'member',
          rowActions: EncounterMemberRowActionRuntime.getRowActions({
            app: context.sheet,
            data: context,
            rowDocument: actor,
            sheetDocument: context.document,
          }),
        };

        npcMap.set(actor.uuid, memberContext);

        const memberCombatantContext: EncounterMemberCombatantQuadroneContext =
          {
            ...memberContext,
            rowActions: EncounterCombatantMemberRowActionRuntime.getRowActions({
              app: context.sheet,
              data: context,
              rowDocument: actor,
              sheetDocument: context.document,
            }),
          };

        combatants.push(memberCombatantContext);

        return memberContext;
      }),
    );

    Object.values(TidyFlags.placeholders.get(this.actor)).forEach(
      (placeholder) => {
        const combatantSettings = CombatantSettings.getEntry(
          this.actor,
          placeholder.id,
        );

        combatants.push({
          ...placeholder,
          type: 'placeholder',
          initiative: combatantSettings.initiative,
          includeInCombat: combatantSettings.include,
          name: placeholder.name,
          visible: combatantSettings.visible,
          rowActions: EncounterCombatantMemberRowActionRuntime.getRowActions({
            app: context.sheet,
            data: context,
            sheetDocument: context.document,
          }),
        });
      },
    );

    return {
      combat: [
        {
          key: CONSTANTS.SHEET_TYPE_NPC,
          dataset: {},
          label: 'TIDY5E.Encounter.CombatantsSection.Title',
          show: true,
          columns: EncounterCombatantColumnRuntime.getColumnSpecifications({
            sheetDocument: this.document,
            tabId: CONSTANTS.TAB_ACTOR_COMBAT,
            sectionKey: CONSTANTS.SHEET_TYPE_NPC,
            editable: context.editable,
            owner: context.owner,
            unlocked: context.unlocked,
          }),
          combatants: combatants.sort(
            (a, b) =>
              (b.initiative ?? 0) - (a.initiative ?? 0) ||
              a.name.localeCompare(b.name, game.i18n.lang),
          ),
          sectionActions: [],
        },
      ],
      creatureTypes: [...creatureTypes.values()].sort((a, b) =>
        a.label.localeCompare(b.label, game.i18n.lang),
      ),
      memberContext: {
        npc: memberContexts,
        all: npcMap,
      },
      members: [
        {
          key: CONSTANTS.SHEET_TYPE_NPC,
          label: 'DND5E.ENCOUNTER.Tab.Members',
          members: memberContexts,
          sectionActions: [],
          show: true,
          dataset: {},
          columns: EncounterMemberColumnRuntime.getColumnSpecifications({
            sheetDocument: context.document,
            tabId: CONSTANTS.TAB_MEMBERS,
            sectionKey: CONSTANTS.SHEET_TYPE_NPC,
            editable: context.editable,
            owner: context.owner,
            unlocked: context.unlocked,
          }),
        },
      ],
      skills: [...skills.values()].sort((a, b) =>
        a.name.localeCompare(b.name, game.i18n.lang),
      ),
      traits: {
        languages: [...languages.values()].sort((a, b) =>
          a.label.localeCompare(b.label, game.i18n.lang),
        ),
        senses: [...senses.values()].sort((a, b) =>
          a.label.localeCompare(b.label, game.i18n.lang),
        ),
        specials: [...specials.values()].sort((a, b) =>
          a.label.localeCompare(b.label, game.i18n.lang),
        ),
        speeds: [...speeds.values()].sort((a, b) =>
          a.label.localeCompare(b.label, game.i18n.lang),
        ),
      },
    };
  }

  private async getMembers(): Promise<
    { actor: Actor5e; quantity: { value: number; formula: string } }[]
  > {
    return await this.actor.system.getMembers();
  }

  private _prepareMemberCreatureType(
    actor: any,
    creatureTypeCountMap: Map<string, EncounterCreatureTypeContext>,
    quantity: any,
  ) {
    const details = actor.system.details;

    const creatureTypeLabel =
      details.type.value === 'custom'
        ? details.type.custom
        : CONFIG.DND5E.creatureTypes[details.type.value]?.label;
    const creatureType =
      details.type.value === 'custom'
        ? details.type.custom
        : details.type.value;

    if (!isNil(creatureType)) {
      mapGetOrInsertComputed(creatureTypeCountMap, creatureType, () => ({
        type: creatureType,
        label: creatureTypeLabel ?? creatureType,
        quantity: 0,
      })).quantity += quantity.value;
    }
  }

  protected _getSheetPinTabIdsForItem(item: Item5e): string[] {
    const tabIds: string[] = [CONSTANTS.TAB_MEMBERS];

    if (Inventory.isItemInventoryType(item)) {
      tabIds.push(CONSTANTS.TAB_ACTOR_INVENTORY);
    }

    return tabIds;
  }

  /* -------------------------------------------- */
  /*  Sheet Actions                               */
  /* -------------------------------------------- */

  static async #addAllAsPlaceholders(
    this: Tidy5eEncounterSheetQuadrone,
    _event: Event,
    _target: HTMLElement,
  ) {
    this.addAllAsPlaceholders();
  }

  async addAllAsPlaceholders(): Promise<void> {
    const members = await this.getMembers();
    const placeholders = TidyFlags.placeholders.get(this.actor);

    const combatantSettings = CombatantSettings.get(this.actor);
    const defaultCombatantSettings = CombatantSettings.defaultSettings;

    return await this._addPlaceholdersToCurrentEncounter([
      ...members
        .filter(
          ({ actor }) =>
            combatantSettings[actor.uuid]?.include ??
            defaultCombatantSettings.include,
        )
        .map(({ actor, quantity }) => ({
          name:
            actor.name +
            (quantity.value && quantity.value > 1
              ? ` (${quantity.value})`
              : ''),
          img: actor.img,
          initiative:
            combatantSettings[actor.uuid]?.initiative ??
            defaultCombatantSettings.initiative,
          hidden: !(
            combatantSettings[actor.uuid]?.visible ??
            defaultCombatantSettings.visible
          ),
        })),
      ...Object.values(placeholders)
        .filter(
          (p) =>
            combatantSettings[p.id]?.include ??
            defaultCombatantSettings.include,
        )
        .map((p) => ({
          name: p.name,
          img: p.img,
          initiative:
            combatantSettings[p.id]?.initiative ??
            defaultCombatantSettings.initiative,
          hidden: !(
            combatantSettings[p.id]?.visible ?? defaultCombatantSettings.visible
          ),
        })),
    ]);
  }

  /* -------------------------------------------- */

  static async #addNewLairPlaceholder(
    this: Tidy5eEncounterSheetQuadrone,
    event: Event,
    target: HTMLElement,
  ) {
    this.addNewPlaceholder(
      {
        name: FoundryAdapter.localize('DND5E.LAIR.Action.Label'),
      },
      { initiative: 20 },
    );
  }

  /* -------------------------------------------- */

  static async #addNewPlaceholder(
    this: Tidy5eEncounterSheetQuadrone,
    event: Event,
    target: HTMLElement,
  ) {
    let { initiative } = target.dataset;

    if (Number.isNumeric(initiative) && initiative !== undefined) {
      const initiativeNumber = Number(initiative);

      this.addNewPlaceholder(
        {
          name: FoundryAdapter.localize(
            'TIDY5E.Encounter.InitiativeCount.Label',
            {
              count: initiativeNumber,
            },
          ),
        },
        { initiative: initiativeNumber },
      );
    } else {
      this.addNewPlaceholder();
    }
  }

  async addNewPlaceholder(
    data?: Partial<EncounterPlaceholder>,
    combatantSettings?: Partial<EncounterCombatantSettings>,
  ): Promise<void> {
    data ??= {};
    const newPlaceholder = FoundryAdapter.mergeObject(
      {
        id: foundry.utils.randomID(),
        img: Tidy5eEncounterSheetQuadrone.DEFAULT_ENCOUNTER_PLACEHOLDER_ICON,
        name: FoundryAdapter.localize('TIDY5E.Encounter.NewPlaceholder.Name'),
      },
      data,
    );

    const result = await TidyFlags.placeholders.insertOrUpdateEntry(
      this.actor,
      newPlaceholder,
    );

    if (combatantSettings) {
      await CombatantSettings.insertOrUpdate(this.actor, {
        identifier: newPlaceholder.id,
        ...combatantSettings,
      });
    }

    return result;
  }

  /* -------------------------------------------- */

  static async #addToCombatAsPlaceholder(
    this: Tidy5eEncounterSheetQuadrone,
    _event: Event,
    target: HTMLElement,
  ) {
    this.onAddPlaceholder(target);
  }

  async onAddPlaceholder(target: HTMLElement) {
    const type = target
      .closest('[data-combatant-type]')
      ?.getAttribute('data-combatant-type');

    if (type === 'member') {
      const uuid =
        target
          .closest('[data-member-uuid]')
          ?.getAttribute('data-member-uuid') ?? '';

      const actorMember = this.actor.system.members.find(
        (m: any) => m.uuid === uuid,
      );

      const combatantSettings = CombatantSettings.getEntry(this.actor, uuid);

      if (actorMember && !combatantSettings.include) {
        return;
      }

      const actor = await fromUuid(actorMember.uuid);

      // TODO: determine the appropriate image
      this._addPlaceholdersToCurrentEncounter([
        {
          name: actor.name,
          img: actor.img,
          initiative: combatantSettings.initiative,
          hidden: !combatantSettings.visible,
        },
      ]);
    } else if (type === 'placeholder') {
      const placeholders = TidyFlags.placeholders.get(this.actor);
      const placeholderId =
        target
          .closest('[data-placeholder-id]')
          ?.getAttribute('data-placeholder-id') ?? '';

      const placeholder = placeholders[placeholderId];

      const combatantSettings = CombatantSettings.getEntry(
        this.actor,
        placeholderId,
      );

      if (!combatantSettings.include) {
        return;
      }

      if (placeholder) {
        return await this._addPlaceholdersToCurrentEncounter([
          {
            img: placeholder.img,
            initiative: combatantSettings.initiative,
            name: placeholder.name,
            hidden: !combatantSettings.visible,
          },
        ]);
      }
    }
  }

  _addPlaceholdersToCurrentEncounter(
    combatants: {
      name: string;
      img: string;
      initiative: number | undefined;
      hidden: boolean;
    }[],
  ): Promise<void> | undefined {
    if (!game.combat) {
      ui.notifications.warn(
        FoundryAdapter.localize(
          'TIDY5E.Encounter.AddCombatants.MustHaveEncounter.Message',
        ),
      );
      return;
    }

    return game.combat.createEmbeddedDocuments('Combatant', combatants);
  }

  /* -------------------------------------------- */

  async award() {
    this._renderChild(
      new dnd5e.applications.Award({
        award: {
          currency: { ...this.actor.system.currency },
          savedDestinations: this.actor.getFlag('dnd5e', 'awardDestinations'),
          xp: await this.actor.system.getXPValue(),
        },
      }),
    );
  }

  /* -------------------------------------------- */

  static async #browseAddNpc(
    this: Tidy5eEncounterSheetQuadrone,
    _event: Event,
    target: HTMLElement,
  ) {
    this._browseAddNpc();
  }

  async _browseAddNpc() {
    const result = await dnd5e.applications.CompendiumBrowser.selectOne(
      {
        filters: {
          locked: {
            documentClass: CONSTANTS.DOCUMENT_NAME_ACTOR,
            types: new Set([CONSTANTS.SHEET_TYPE_NPC]),
          },
        },
      },
      this._detachOptions(),
    );

    if (result) {
      const actor = await fromUuid(result);
      this.actor.system.addMember(actor);
    }
  }

  /* -------------------------------------------- */

  static async #editPlaceholderImage(
    this: Tidy5eEncounterSheetQuadrone,
    _event: Event,
    target: HTMLElement,
  ) {
    const { placeholderId } =
      target.closest<HTMLElement>('[data-placeholder-id]')?.dataset ?? {};

    if (!placeholderId) {
      return;
    }

    const placeholder = TidyFlags.placeholders.get(this.document)?.[
      placeholderId
    ];

    if (!placeholder) {
      return;
    }

    const fp = new foundry.applications.apps.FilePicker.implementation({
      current: placeholder.img,
      type: 'image',
      redirectToRoot:
        Tidy5eEncounterSheetQuadrone.DEFAULT_ENCOUNTER_PLACEHOLDER_ICON
          ? [Tidy5eEncounterSheetQuadrone.DEFAULT_ENCOUNTER_PLACEHOLDER_ICON]
          : [],
      callback: (path: string) => {
        placeholder.img = path;
        TidyFlags.placeholders.insertOrUpdateEntry(this.document, placeholder);
      },
      position: {
        top: this.position.top + 40,
        left: this.position.left + 10,
      },
    });

    fp.browse();
  }

  /* -------------------------------------------- */

  static async #prerollAllInitiatives(
    this: Tidy5eEncounterSheetQuadrone,
    event: Event,
    target: HTMLElement,
  ) {
    this.prerollAllInitiatives(event);
  }

  async prerollAllInitiatives(ev: Event) {
    const members = await this.getMembers();

    const initiatives = (
      await Promise.all(
        members.map(async ({ actor }) => {
          const total = await this.getPrerolledInitiative(ev, actor);
          return [actor.uuid, total];
        }),
      )
    ).reduce<Record<string, Partial<EncounterCombatantSettings>>>(
      (prev, [uuid, initiative]) => {
        prev[uuid] = {
          identifier: uuid,
          initiative: initiative,
        };
        return prev;
      },
      {},
    );

    CombatantSettings.bulkInsertOrUpdate(this.actor, initiatives);
  }

  async getPrerolledInitiative(ev: Event, actor: Actor5e) {
    const keys = FoundryAdapter.getRollModeState(ev);
    const roll = actor.getInitiativeRoll({ ...keys, event: ev });
    await roll.evaluate();
    return roll.total;
  }

  /* -------------------------------------------- */

  static async #prerollInitiative(
    this: Tidy5eEncounterSheetQuadrone,
    event: Event,
    target: HTMLElement,
  ) {
    const uuid =
      target.closest<HTMLElement>('[data-member-uuid]')?.dataset.memberUuid;
    const member = await fromUuid(uuid);
    return await this.prerollInitiative(event, member);
  }

  async prerollInitiative(ev: Event, actor: Actor5e) {
    const total = await this.getPrerolledInitiative(ev, actor);

    CombatantSettings.insertOrUpdate(this.actor, {
      identifier: actor.uuid,
      initiative: total,
    });
  }

  /* -------------------------------------------- */

  static async #rollQuantities(
    this: Tidy5eEncounterSheetQuadrone,
    event: Event,
    target: HTMLElement,
  ) {
    this.document.system.rollQuantities();
  }

  /* -------------------------------------------- */

  static async #showPlaceholderArtwork(
    this: Tidy5eEncounterSheetQuadrone,
    _event: Event,
    target: HTMLElement,
  ) {
    const { placeholderId } =
      target.closest<HTMLElement>('[data-placeholder-id]')?.dataset ?? {};

    if (!placeholderId) {
      return;
    }

    const placeholder = TidyFlags.placeholders.get(this.document)?.[
      placeholderId
    ];

    if (!placeholder) {
      return;
    }

    this._renderChild(
      new foundry.applications.apps.ImagePopout({
        src: placeholder.img,
        title: placeholder.name,
      }),
    );
  }

  /* -------------------------------------------- */

  static async #toggleCombatantInclusion(
    this: Tidy5eEncounterSheetQuadrone,
    event: Event,
    target: HTMLElement,
  ) {
    const { identifier } = this._getCombatantIdentifiers(target);

    if (identifier) {
      this.toggleCombatantInclusion(identifier);
    }
  }

  toggleCombatantInclusion(identifier: string) {
    const settings = CombatantSettings.getEntry(this.actor, identifier);

    return CombatantSettings.insertOrUpdate(this.actor, {
      identifier,
      include: !settings.include,
    });
  }

  _getCombatantIdentifiers(target: HTMLElement) {
    const { placeholderId, memberUuid } =
      target.closest<HTMLElement>('[data-placeholder-id], [data-member-uuid]')
        ?.dataset ?? {};

    const identifier = placeholderId ?? memberUuid;

    return {
      placeholderId,
      memberUuid,
      identifier,
    };
  }

  /* -------------------------------------------- */

  static async #toggleCombatantVisibility(
    this: Tidy5eEncounterSheetQuadrone,
    event: Event,
    target: HTMLElement,
  ) {
    const { identifier } = this._getCombatantIdentifiers(target);

    if (identifier) {
      this.toggleCombatantVisibility(identifier);
    }
  }

  toggleCombatantVisibility(identifier: string) {
    const settings = CombatantSettings.getEntry(this.actor, identifier);

    return CombatantSettings.insertOrUpdate(this.actor, {
      identifier,
      visible: !settings.visible,
    });
  }

  /* -------------------------------------------- */

  override async _onAdjustProperty(
    event: Event,
    target: HTMLElement,
    amount: number,
  ): Promise<any> {
    const index = target.closest<HTMLElement>('[data-index]')?.dataset.index;

    if (index === undefined) {
      return super._onAdjustProperty(event, target, amount);
    }

    const property = target.dataset.property;

    if (!property) {
      return;
    }

    const input = target.parentElement?.querySelector('input');
    const members = this.actor.system.toObject().members;
    const member = members[index];

    const originalValue =
      FoundryAdapter.getProperty<number>(member, property) ?? 0;

    const newValue = applyNumberInputConstraints(originalValue, input);

    foundry.utils.setProperty(member, property, newValue);

    this.actor.update({ 'system.members': members });
  }

  static async #removeMember(
    this: Tidy5eEncounterSheetQuadrone,
    event: Event,
    target: HTMLElement,
  ) {
    const { placeholderId, memberUuid } = this._getCombatantIdentifiers(target);

    if (placeholderId) {
      return await this.deletePlaceholder(placeholderId);
    }

    const member = await fromUuid(memberUuid);

    if (member) {
      return await this.document.system.removeMember(member);
    }
  }

  deletePlaceholder(placeholderId: string): Promise<void> {
    return TidyFlags.placeholders.deleteEntry(this.actor, placeholderId);
  }

  /* -------------------------------------------- */
  /*  Life-Cycle Handlers                         */
  /* -------------------------------------------- */

  async _renderFrame(options: TidyDocumentSheetRenderOptions) {
    const element = await super._renderFrame(options);

    element.querySelector('.window-header').classList.add('theme-dark');

    return element;
  }

  async _onChangeForm(
    formConfig: unknown,
    event: Event & { target: HTMLElement },
  ) {
    // data-name => the prop path for a single-property update
    const { name } = event.target.dataset;
    // data-index => a member update
    const index =
      event.target.closest<HTMLElement>('[data-index]')?.dataset.index;

    if (Number.isNumeric(index) && !!name) {
      return await this._onMemberChanged(event, Number(index), name);
    }

    // TODO: Make utility function for this type of operation: detecting specialization prefix, shaving off prefix, running a callback, returning a boolean, all async I guess
    const isCombatUpdate = name?.startsWith('combatantSettings:');

    const { memberUuid, placeholderId } =
      event.target.closest<HTMLElement>(
        '[data-member-uuid], [data-placeholder-id]',
      )?.dataset ?? {};

    const combatantId = memberUuid ?? placeholderId;

    if (isCombatUpdate && !!name && combatantId) {
      const prop = name.split('combatantSettings:').at(-1);
      return prop
        ? await this._onCombatantChanged(event, combatantId, prop)
        : undefined;
    }

    const isPlaceholderUpdate = name?.startsWith('placeholder:');

    if (isPlaceholderUpdate && !!name && placeholderId) {
      const prop = name.split('placeholder:').at(-1);
      return prop
        ? await this._onPlaceholderChanged(event, placeholderId, prop)
        : undefined;
    }

    return await super._onChangeForm(formConfig, event);
  }

  async _onMemberChanged(event: any, index: number, name: string) {
    const members = this.actor.system.toObject().members;

    if (
      // TODO: I've used this multiple times now. Where can I share it?
      event.target.matches(
        `input:is([name], [data-name]):is([data-dtype="Number"], [inputmode="numeric"], [type="number"])`,
      )
    ) {
      dnd5e.utils.parseInputDelta(event.target, members[index]);
    }

    foundry.utils.setProperty(members[index], name, event.target.value);

    this.actor.update({ 'system.members': members });
  }

  _onPlaceholderChanged(event: any, placeholderId: string, prop: string) {
    const placeholder = TidyFlags.placeholders.get(this.document)?.[
      placeholderId
    ];

    if (!placeholder) {
      return;
    }

    if (
      // TODO: I've used this multiple times now. Where can I share it?
      event.target.matches(
        `input:is([name], [data-name]):is([data-dtype="Number"], [inputmode="numeric"], [type="number"])`,
      )
    ) {
      dnd5e.utils.parseInputDelta(event.target, placeholder);
    }

    const value = Number.isNumeric(event.target.value)
      ? Number(event.target.value)
      : event.target.value;

    foundry.utils.setProperty(placeholder, prop, value);

    return TidyFlags.placeholders.insertOrUpdateEntry(
      this.document,
      placeholder,
    );
  }

  _onCombatantChanged(event: any, combatantId: string, prop: string) {
    const combatant = CombatantSettings.getEntry(this.document, combatantId);

    if (!combatant) {
      return;
    }

    if (
      // TODO: I've used this multiple times now. Where can I share it?
      event.target.matches(
        `input:is([name], [data-name]):is([data-dtype="Number"], [inputmode="numeric"], [type="number"])`,
      )
    ) {
      dnd5e.utils.parseInputDelta(event.target, combatant);
    }

    const value = Number.isNumeric(event.target.value)
      ? Number(event.target.value)
      : event.target.value;

    foundry.utils.setProperty(combatant, prop, value);

    return CombatantSettings.insertOrUpdate(this.document, combatant);
  }
}
