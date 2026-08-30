import { CONSTANTS } from 'src/constants';
import * as Bastion from 'src/features/facility/Bastion';
import { BastionMaintainOrderDialog } from 'src/features/facility/BastionMaintainOrderDialog';
import {
  FacilityOccupantSlotPropsMap,
  FacilityOccupantSlotTypesMap,
} from 'src/features/facility/facility';
import type { Item5e } from 'src/types/item.types';
import type {
  Actor5e,
  FacilityOccupantSlot,
  ActorSheetQuadroneContext,
  BastionOrderQuadroneContext,
  GroupAbility,
  GroupBastionsQuadroneContext,
  GroupMemberBastionQuadroneContext,
  GroupMemberQuadroneContext,
  GroupMemberSection,
  GroupMembersQuadroneContext,
  GroupSheetQuadroneContext,
  GroupSkill,
  GroupSkillRollProcessConfiguration,
  GroupTrait,
  GroupTraits,
  MeasurableGroupTrait,
  MultiActorQuadroneContext,
  TravelPaceConfigEntry,
} from 'src/types/types';
import type {
  ApplicationClosingOptions,
  ApplicationConfiguration,
  ApplicationRenderOptions,
} from 'src/types/application.types';
import GroupSheet from './actor/GroupSheet.svelte';
import { mount } from 'svelte';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import { type TidyDocumentSheetRenderOptions } from 'src/mixins/TidyDocumentSheetMixin.svelte';
import { GroupSheetQuadroneRuntime } from 'src/runtime/actor/GroupSheetQuadroneRuntime.svelte';
import type { GroupMemberContext } from 'src/types/group.types';
import { coalesce } from 'src/utils/formatting';
import { Tidy5eNpcSheetQuadrone } from './Tidy5eNpcSheetQuadrone.svelte';
import { isNil } from 'src/utils/data';
import type { Ref } from 'src/features/reactivity/reactivity.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { settings, systemSettings } from 'src/settings/settings.svelte';
import { mapGetOrInsert, mapGetOrInsertComputed } from 'src/utils/map';
import { getTidy5eMultiActorSheetQuadroneBase } from './Tidy5eMultiActorSheetQuadroneBase.svelte';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { TidyFlags } from 'src/foundry/TidyFlags';
import SectionActions from 'src/features/sections/SectionActions';
import { GroupMemberRowActionRuntime } from 'src/runtime/table-row-actions/GroupMemberRowActionRuntime.svelte';
import { GroupMemberColumnRuntime } from 'src/runtime/table-columns/GroupMemberColumnRuntime';
import { BastionFacilityColumnRuntime } from 'src/runtime/table-columns/BastionFacilityColumnRuntime';
import { BastionOrderColumnRuntime } from 'src/runtime/table-columns/BastionOrderColumnRuntime';

export class Tidy5eGroupSheetQuadrone extends getTidy5eMultiActorSheetQuadroneBase<GroupSheetQuadroneContext>(
  CONSTANTS.SHEET_TYPE_GROUP,
) {
  currentTabId: string;
  emphasizedMember: Ref<GroupMemberContext | undefined> = $state({
    value: undefined,
  });
  aggregatePinTab = {
    tabId: CONSTANTS.TAB_MEMBERS,
    tabName: 'DND5E.Group.Member.other',
  };

  constructor(options?: Partial<ApplicationConfiguration> | undefined) {
    super(options);

    this.currentTabId = CONSTANTS.TAB_MEMBERS;
  }

  static DEFAULT_OPTIONS: Partial<
    ApplicationConfiguration & { dragDrop: Partial<DragDropConfiguration>[] }
  > = {
    position: {
      width: 740,
      height: 810,
    },
    actions: {
      addMemberFacilityOccupant:
        Tidy5eGroupSheetQuadrone.#addMemberFacilityOccupant,
      adjustMemberFacilityProgress:
        Tidy5eGroupSheetQuadrone.#adjustMemberFacilityProgress,
      takeBastionTurn: Tidy5eGroupSheetQuadrone.#takeBastionTurn,
      useMemberFacility: Tidy5eGroupSheetQuadrone.#useMemberFacility,
    },
  };

  _createComponent(node: HTMLElement): Record<string, any> {
    if (this.actor.limited) {
      return this._createLimitedViewComponent(node);
    }

    const component = mount(GroupSheet, {
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
  ): Promise<GroupSheetQuadroneContext> {
    if (options?.tidy?.soft && this._context?.data) {
      return this._context.data;
    }

    // TODO: figure out and fix the type error that necessitates the `as` cast here
    const actorContext = (await super._prepareContext(
      options,
    )) as MultiActorQuadroneContext<Tidy5eGroupSheetQuadrone>;

    const paces: TravelPaceConfigEntry[] = Object.entries(
      CONFIG.DND5E.travelPace,
    )
      .toSorted((a, b) => a[1].multiplier - b[1].multiplier)
      .map(([key, config], index) => ({ key, config, index }));

    const currentPace =
      paces.find(
        (pace) => pace.key === this.actor.system.attributes.travel.pace,
      ) ?? paces[0];

    const enrichmentArgs = {
      secrets: this.actor.isOwner,
      rollData: actorContext.rollData,
      relativeTo: this.actor,
    };

    const memberDependentContext =
      await this._prepareMemberDependentContext(actorContext);

    const context: GroupSheetQuadroneContext = {
      bastionsContext: await this._prepareBastionsContext(
        memberDependentContext.memberContext,
        actorContext,
      ),
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
            CONFIG.DND5E.travelUnits[this.actor.system.attributes.travel.units]
              ?.abbreviationDay ?? this.actor.system.attributes.travel.units,
        },
      },
      type: 'group',
      ...memberDependentContext,
      ...actorContext,
    };

    // etc.
    context.customContent = await GroupSheetQuadroneRuntime.getContent(context);

    context.tabs = await GroupSheetQuadroneRuntime.getTabs(context);

    TidyHooks.tidy5eSheetsPrepareSheetContext(this.document, this, context);

    return context;
  }

  /**
   * Prepare group bastions. One entry per PC member. Orders are shared context for the group.
   *
   * GMs can prep facilities before players get access via their level, but players
   * won't see it until one of them reaches the level where bastions unlock.
   */
  async _prepareBastionsContext(
    memberContext: GroupMembersQuadroneContext,
    actorContext: ActorSheetQuadroneContext,
  ): Promise<GroupBastionsQuadroneContext> {
    const members: GroupMemberBastionQuadroneContext[] = [];
    const orders: BastionOrderQuadroneContext[] = [];

    const columnOptions = {
      sheetDocument: this.document,
      tabId: CONSTANTS.TAB_GROUP_BASTIONS,
      sectionKey: CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT,
      editable: actorContext.editable,
      owner: actorContext.owner,
      unlocked: actorContext.unlocked,
    };

    const orderColumns =
      BastionOrderColumnRuntime.getColumnSpecifications(columnOptions);

    // Skip if bastions are off.
    if (!systemSettings.value.bastionConfiguration.enabled) {
      return { members, orders, orderColumns };
    }

    // Facilities are identical, so get all actors at once.
    const facilityColumns =
      BastionFacilityColumnRuntime.getColumnSpecifications(columnOptions);

    for (const member of memberContext.character) {
      // Check observers
      if (!member.canObserve) {
        continue;
      }

      const { facilities } = await Bastion.prepareFacilities(member.actor);

      members.push({
        member,
        name: member.actor.system.bastion?.name ?? '',
        level: member.actor.system.details.level,
        facilities,
        hirelings: Bastion.calculateOccupancy(
          facilities.special.builtFacilities,
          'hirelings',
        ),
        defenders: Bastion.calculateOccupancy(
          facilities.special.builtFacilities,
          'defenders',
        ),
        columns: facilityColumns,
      });

      const memberFacilities = [
        ...facilities.basic.builtFacilities,
        ...facilities.special.builtFacilities,
      ];

      for (const facility of memberFacilities) {
        if (!facility.progress.max) {
          continue;
        }

        orders.push({
          facility: facility.facility,
          facilityName: facility.name,
          member,
          key: facility.progress.order,
          label:
            CONFIG.DND5E.facilities.orders[facility.progress.order]?.label ??
            facility.progress.order,
          progress: {
            value: facility.progress.value,
            max: facility.progress.max,
            pct: facility.progress.pct,
            order: facility.progress.order,
          },
          craft: facility.craft,
          cost: Bastion.getOrderCost(facility),
        });
      }
    }

    // Sort by progress
    orders.sort((a, b) => b.progress.pct - a.progress.pct);

    return { members, orders, orderColumns };
  }

  async _prepareMemberDependentContext(
    actorContext: ActorSheetQuadroneContext,
  ): Promise<{
    abilities: GroupAbility[];
    members: GroupMemberSection[];
    memberContext: GroupMembersQuadroneContext;
    skills: GroupSkill[];
    traits: GroupTraits;
  }> {
    const customSections = TidyFlags.sections.get(this.actor);

    const sections = new Map<string, GroupMemberSection>([
      [
        CONSTANTS.SHEET_TYPE_CHARACTER,
        {
          members: [],
          label: 'TYPES.Actor.characterPl',
          key: CONSTANTS.SHEET_TYPE_CHARACTER,
          show: true,
          dataset: {},
          sectionActions: [],
          columns: GroupMemberColumnRuntime.getColumnSpecifications({
            sheetDocument: this.document,
            tabId: CONSTANTS.TAB_MEMBERS,
            sectionKey: CONSTANTS.SHEET_TYPE_CHARACTER,
            editable: actorContext.editable,
            owner: actorContext.owner,
            unlocked: actorContext.unlocked,
          }),
        },
      ],
      [
        CONSTANTS.SHEET_TYPE_NPC,
        {
          members: [],
          label: 'TYPES.Actor.npcPl',
          key: CONSTANTS.SHEET_TYPE_NPC,
          show: true,
          dataset: {},
          sectionActions: [],
          columns: GroupMemberColumnRuntime.getColumnSpecifications({
            sheetDocument: this.document,
            tabId: CONSTANTS.TAB_MEMBERS,
            sectionKey: CONSTANTS.SHEET_TYPE_NPC,
            editable: actorContext.editable,
            owner: actorContext.owner,
            unlocked: actorContext.unlocked,
          }),
        },
      ],
      [
        CONSTANTS.SHEET_TYPE_VEHICLE,
        {
          members: [],
          label: 'TYPES.Actor.vehiclePl',
          key: CONSTANTS.SHEET_TYPE_VEHICLE,
          show: true,
          dataset: {},
          sectionActions: [],
          columns: GroupMemberColumnRuntime.getColumnSpecifications({
            sheetDocument: this.document,
            tabId: CONSTANTS.TAB_MEMBERS,
            sectionKey: CONSTANTS.SHEET_TYPE_VEHICLE,
            editable: actorContext.editable,
            owner: actorContext.owner,
            unlocked: actorContext.unlocked,
          }),
        },
      ],
    ]);

    let memberContext: GroupMembersQuadroneContext = {
      character: [],
      all: new Map<string, GroupMemberQuadroneContext>(),
      skilled: [],
    };

    let abilities = this._getMemberGroupAbilityMap();
    let skills = this._getMemberGroupSkillMap();

    let languages = new Map<string, MeasurableGroupTrait<number>>();
    let senses = new Map<string, MeasurableGroupTrait<number>>();
    let specials = new Map<string, GroupTrait>();
    let speeds = new Map<string, MeasurableGroupTrait<number>>();
    let tools = new Map<string, GroupTrait>();
    let masteries = new Map<string, GroupTrait>();

    let skilled = new Map<string, GroupMemberQuadroneContext[]>([
      [CONSTANTS.SHEET_TYPE_CHARACTER, []],
      [CONSTANTS.SHEET_TYPE_NPC, []],
    ]);

    for (let { actor } of this.actor.system.members) {
      if (!actor) {
        continue;
      }

      if (
        settings.value.useGroupSheetMemberSecurity &&
        !actor.testUserPermission(game.user, CONSTANTS.PERMISSION_LIMITED)
      ) {
        continue;
      }

      let sectionKey = customSections[actor.id] ?? actor.type;

      let section: GroupMemberSection = mapGetOrInsertComputed(
        sections,
        sectionKey,
        (key) => ({
          label: FoundryAdapter.localize(key),
          members: [],
          key: key,
          show: true,
          dataset: {},
          custom: {
            section: key,
            creationItemTypes: [],
          },
          sectionActions: [],
          columns: GroupMemberColumnRuntime.getColumnSpecifications({
            sheetDocument: this.document,
            tabId: CONSTANTS.TAB_MEMBERS,
            sectionKey: key,
            editable: actorContext.editable,
            owner: actorContext.owner,
            unlocked: actorContext.unlocked,
          }),
        }),
      );

      const accentColor = coalesce(
        // Use the actor's accent color, if configured, which references global themes if configured
        TidyFlags.sheetThemeSettings.get(actor)?.accentColor,
        // Else, use the group sheet's accent color, with fallback to world default accent color
        actorContext.themeSettings.accentColor,
      );

      const canObserve =
        !settings.value.useGroupSheetMemberSecurity ||
        actor.testUserPermission(game.user, CONSTANTS.PERMISSION_OBSERVER);

      const groupMemberContext: GroupMemberQuadroneContext = {
        accentColor: !isNil(accentColor, '') ? accentColor : undefined,
        actor,
        backgroundColor: !isNil(accentColor, '')
          ? `oklch(from ${accentColor} calc(l * 0.75) calc(c * 1.2) h)`
          : undefined,
        canObserve,
        encumbrance: this._prepareMemberEncumbrance(actor),
        highlightColor: !isNil(accentColor, '')
          ? `oklch(from ${accentColor} calc(l * 1.4) 60% h)`
          : undefined,
        inspirationSource: actor.system.isCharacter
          ? await CONFIG.TIDY5E.utils.actorInspiration.tryGetInspirationSource(
              actor,
            )
          : undefined,
        portrait: await this._preparePortrait(actor),
        gold: FoundryAdapter.formatNumber(
          this.getDefaultCurrencySummary(actor),
        ),
        goldAbbreviation:
          FoundryAdapter.getDefaultCurrencyConfig()?.abbreviation ?? '',
        rowActions: GroupMemberRowActionRuntime.getRowActions({
          app: this,
          data: {
            unlocked: actorContext.unlocked,
            owner: actorContext.owner,
            editable: actorContext.editable,
          },
          rowDocument: actor,
          sheetDocument: actorContext.document,
        }),
      };

      section.members.push(groupMemberContext);
      memberContext.all.set(actor.uuid, groupMemberContext);
      if (actor.system.isCharacter) {
        memberContext.character.push(groupMemberContext);
      }

      const prepareCreatureInformation =
        canObserve &&
        (actor.system.isCharacter ||
          Tidy5eNpcSheetQuadrone.isImportantNpc(actor));

      if (prepareCreatureInformation) {
        // Abilities
        this._prepareMemberAbilities(actor, abilities);

        // Masteries
        this._prepareMemberMasteries(actor, masteries);

        // Skills
        skilled.get(actor.type)?.push(groupMemberContext);
        this._prepareMemberSkills(actor, skills);

        // Languages
        this._prepareMemberLanguages(actor, languages);

        // Senses
        this._prepareMemberSenses(actor, senses);

        // Specials
        this._prepareMemberSpecials(actor, specials);

        // Tools
        this._prepareMemberTools(actor, tools);
      }

      const prepareSpeed = prepareCreatureInformation || actor.system.isVehicle;

      if (prepareSpeed) {
        // Speeds
        this._prepareMemberSpeeds(actor, speeds);
      }
    }

    sections.forEach((section) => {
      section.sectionActions = SectionActions.getGroupMemberHeaderActions(
        this.actor,
        actorContext.unlocked,
        section,
      );
    });

    memberContext.skilled.push(
      ...skilled.values().reduce((prev, curr) => {
        return prev.concat(
          curr.toSorted((a, b) =>
            a.actor.name.localeCompare(b.actor.name, game.i18n.lang),
          ),
        );
      }, []),
    );

    let groupAbilities = [...abilities.values()];
    let groupSkills = [...skills.values()].toSorted((a, b) =>
      a.name.localeCompare(b.name, game.i18n.lang),
    );

    return {
      abilities: groupAbilities,
      memberContext,
      members: [...sections.values()],
      skills: groupSkills,
      traits: {
        languages: [...languages.values()].sort((a, b) =>
          a.label.localeCompare(b.label, game.i18n.lang),
        ),
        masteries: [...masteries.values()].sort((a, b) =>
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
        tools: [...tools.values()].sort((a, b) =>
          a.label.localeCompare(b.label, game.i18n.lang),
        ),
      },
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
        defaultUnits[systemUnits],
      ),
      value: dnd5e.utils.convertWeight(
        value,
        baseUnits[systemUnits],
        defaultUnits[systemUnits],
      ),
    };
  }

  private _prepareMemberTools(actor: any, tools: Map<string, GroupTrait>) {
    Object.keys(actor.system.tools ?? {}).forEach((key) => {
      const toolLabel = dnd5e.documents.Trait.keyLabel(key, {
        trait: 'tool',
      });

      const groupTool = mapGetOrInsert(tools, key, {
        identifiers: new Set<string>(),
        label: toolLabel,
        key: key,
      });

      groupTool.identifiers.add(actor.uuid);
    });
  }

  _prepareMemberMasteries(actor: any, masteries: Map<string, GroupTrait>) {
    for (const key of actor.system.traits?.weaponProf?.mastery?.value ?? []) {
      const groupMastery = mapGetOrInsertComputed(masteries, key, (key) => ({
        key,
        label: dnd5e.documents.Trait.keyLabel(key, { trait: 'weapon' }) ?? key,
        identifiers: new Set<string>(),
      }));

      groupMastery.identifiers.add(actor.uuid);
    }
  }

  /* -------------------------------------------- */
  /*  Sheet Actions                               */
  /* -------------------------------------------- */

  static async #takeBastionTurn(this: Tidy5eGroupSheetQuadrone) {
    await this.takeBastionTurn();
  }

  /**
   * Advance a bastion turn for characters in this group only. Not the whole world.
   *
   * Mirrors `dnd5e.bastion.confirmAdvance()`, which can't be reused here because
   * it's world-level.
   */
  async takeBastionTurn() {
    if (!FoundryAdapter.userIsGm()) {
      return;
    }

    const proceed = await foundry.applications.api.DialogV2.confirm({
      content: FoundryAdapter.localize(
        'TIDY5E.Bastion.Group.TakeBastionTurn.Confirm',
      ),
      rejectClose: false,
      window: {
        icon: 'fa-solid fa-chess-rook',
        title: 'DND5E.Bastion.Action.BastionTurn',
      },
    });

    if (!proceed) {
      return;
    }

    const members = this.actor.system.members
      .map(({ actor }: { actor: Actor5e }) => actor)
      .filter((actor: Actor5e) => !!actor);

    const maintainUuids = await BastionMaintainOrderDialog.prompt(
      members.filter((actor: Actor5e) => actor.itemTypes.facility?.length),
      (dialog) => this._renderChild(dialog),
    );

    if (maintainUuids === null) {
      return;
    }

    return await Bastion.advanceBastions(members, { maintainUuids });
  }

  async issueMemberMaintainOrder(member: Actor5e) {
    if (!FoundryAdapter.userIsGm() || !member.itemTypes.facility?.length) {
      return;
    }

    return await Bastion.issueMaintainOrder(member);
  }

  static async #useMemberFacility(
    this: Tidy5eGroupSheetQuadrone,
    event: Event,
    target: HTMLElement,
  ) {
    const { facilityId, memberUuid } =
      target.closest<HTMLElement>('[data-member-uuid]')?.dataset ?? {};

    const member = memberUuid ? fromUuidSync(memberUuid) : undefined;

    if (!member) {
      return;
    }

    await this.useMemberFacility(member, facilityId, event);
  }

  /** Issue an order to a facility owned by a group member. */
  async useMemberFacility(
    member: Actor5e,
    facilityId: string | undefined,
    event: Event,
  ) {
    if (!this.isEditable) {
      return;
    }

    return await Bastion.useFacility({
      actor: member,
      facilityId,
      event,
      sheet: this,
    });
  }

  /**
   * Nudge a member facility's order along by a day, for GMs correcting the
   * record. Serves the facilities table and the orders table, which tag their
   * facility differently.
   */
  static async #adjustMemberFacilityProgress(
    this: Tidy5eGroupSheetQuadrone,
    _event: Event,
    target: HTMLElement,
  ) {
    if (!FoundryAdapter.userIsGm()) {
      return;
    }

    const memberUuid =
      target.closest<HTMLElement>('[data-member-uuid]')?.dataset.memberUuid;

    const member = memberUuid ? fromUuidSync(memberUuid) : undefined;

    // Facility rows carry `data-facility-id`; order rows identify the same
    // document with the generic `data-item-id`.
    const facilityId =
      target.closest<HTMLElement>('[data-facility-id]')?.dataset.facilityId ??
      target.closest<HTMLElement>('[data-item-id]')?.dataset.itemId;

    const facility = facilityId ? member?.items.get(facilityId) : undefined;

    if (
      !facility ||
      !facility.isOwner ||
      FoundryAdapter.isLockedInCompendium(facility)
    ) {
      return;
    }

    const toAdjust = Number(target.dataset.value);
    const { value, max } = facility.system.progress;

    if (Number.isNaN(toAdjust) || !max) {
      return;
    }

    const next = Math.clamp(value + toAdjust, 0, max);

    if (next === value) {
      return;
    }

    // If you hit the last day, check if the user wants to complete the order.
    if (toAdjust > 0 && next >= max) {
      const proceed = await Bastion.confirmCompleteOrder();

      if (!proceed) {
        return;
      }

      return await Bastion.completeOrder(facility);
    }

    return await facility.update({ 'system.progress.value': next });
  }

  async completeMemberFacilityOrder(facility: Item5e) {
    if (
      !FoundryAdapter.userIsGm() ||
      !facility.isOwner ||
      FoundryAdapter.isLockedInCompendium(facility)
    ) {
      return;
    }

    return await Bastion.completeOrder(facility);
  }

  /* -------------------------------------------- */

  /**
   * Fill an open occupant slot on a member's facility.
   *
   * Facility rows identify their facility directly. The member header row shows
   * an occupancy total across every special facility, so it has no single
   * target and prompts for one instead.
   */
  static async #addMemberFacilityOccupant(
    this: Tidy5eGroupSheetQuadrone,
    event: Event,
    target: HTMLElement,
  ) {
    const memberUuid =
      target.closest<HTMLElement>('[data-member-uuid]')?.dataset.memberUuid;

    const member = memberUuid ? fromUuidSync(memberUuid) : undefined;

    const slot = target.dataset.occupantSlot as
      | FacilityOccupantSlot
      | undefined;

    if (!member || !slot) {
      return;
    }

    const facilityId =
      target.closest<HTMLElement>('[data-facility-id]')?.dataset.facilityId;

    const facility = facilityId
      ? member.items.get(facilityId)
      : await this.#promptForFacilityWithOpenSlot(member, slot);

    if (
      !facility ||
      !facility.isOwner ||
      FoundryAdapter.isLockedInCompendium(facility)
    ) {
      return;
    }

    const prop = FacilityOccupantSlotPropsMap[slot];

    if (
      !TidyHooks.tidy5eSheetsFacilityEmptyOccupantSlotClicked(
        event,
        facility,
        FacilityOccupantSlotTypesMap[slot],
        prop,
      )
    ) {
      return;
    }

    const result = await dnd5e.applications.CompendiumBrowser.selectOne(
      {
        filters: {
          locked: {
            documentClass: 'Actor',
            types: new Set(['character', 'npc', 'vehicle', 'group']),
          },
        },
      },
      this._detachOptions(),
    );

    if (result) {
      await Bastion.addFacilityOccupant(facility, prop, result);
    }
  }

  /* -------------------------------------------- */

  /**
   * Ask which of a member's facilities should receive the occupant. Resolves
   * without prompting when there is only one candidate.
   */
  async #promptForFacilityWithOpenSlot(
    member: Actor5e,
    slot: FacilityOccupantSlot,
  ): Promise<Item5e | undefined> {
    const candidates = Bastion.getFacilitiesWithOpenSlot(member, slot);

    if (candidates.length <= 1) {
      return candidates[0];
    }

    // Built through the DOM so facility names are escaped for us.
    const select = document.createElement('select');
    select.name = 'facilityId';
    for (const facility of candidates) {
      const option = document.createElement('option');
      option.value = facility.id;
      option.textContent = facility.name;
      select.appendChild(option);
    }

    const { promise, resolve } = Promise.withResolvers<string | undefined>();

    const dialog = new foundry.applications.api.DialogV2({
      content: `<div class="form-group">${select.outerHTML}</div>`,
      window: {
        icon: 'fa-solid fa-house-turret',
        title: FoundryAdapter.localize(
          'TIDY5E.Bastion.Group.ChooseFacility.Title',
        ),
      },
      buttons: [
        {
          action: 'choose',
          icon: 'fa-solid fa-check',
          label: FoundryAdapter.localize('Confirm'),
          default: true,
          callback: (_event: Event, button: HTMLButtonElement) =>
            new foundry.applications.ux.FormDataExtended(button.form).object
              .facilityId as string | undefined,
        },
      ],
      submit: (result: string | undefined) => resolve(result),
    });

    dialog.addEventListener('close', () => resolve(undefined), { once: true });

    this._renderChild(dialog);

    const chosenId = await promise;

    return chosenId ? member.items.get(chosenId) : undefined;
  }

  /* -------------------------------------------- */

  /**
   * Bastion member rows deep link to the member's own bastion tab, so a GM can
   * jump from the party overview straight to the facilities they were reading.
   */
  async _showDocument(_event: Event, target: HTMLElement) {
    if (!target.closest('.bastion-member')) {
      return;
    }

    const uuid = target.closest<HTMLElement>('[data-uuid]')?.dataset.uuid;
    const actor = uuid ? await fromUuid(uuid) : undefined;

    if (!actor || !Bastion.characterHasBastionTab(actor)) {
      return;
    }

    this._openDocumentSheet(actor, {
      mode: CONSTANTS.SHEET_MODE_PLAY,
      tidy: { tab: CONSTANTS.TAB_CHARACTER_BASTION },
    });

    return false;
  }

  /* -------------------------------------------- */

  /**
   * Browse for a facility and create it on the member. GM only, so it ignores
   * level restrictions.
   */
  async addMemberFacility(
    member: Actor5e,
    facilityType: string,
    event: Event,
  ) {
    if (!this.isEditable) {
      return;
    }

    return await Bastion.addFacility({
      actor: member,
      facilityType,
      event,
      detachOptions: this._detachOptions(),
      ignoreLevelRestriction: true,
      onSelected: (itemData) =>
        dnd5e.documents.Item5e.createDocuments([itemData], {
          pack: member.pack,
          parent: member,
          keepId: true,
        }),
    });
  }

  changePace(increment: number) {
    if (Number.isNaN(increment)) return;
    const paces = Object.keys(CONFIG.DND5E.travelPace);
    const current = paces.indexOf(
      this.actor.system._source.attributes.travel.pace,
    );
    const next =
      (((current + increment) % paces.length) + paces.length) % paces.length;
    this.actor.update({ 'system.attributes.travel.pace': paces[next] });
  }

  async award() {
    this._renderChild(
      new dnd5e.applications.Award({
        award: {
          savedDestinations: this.actor.getFlag('dnd5e', 'awardDestinations'),
        },
        origin: this.actor,
      }),
    );
  }

  _rollAbilityCheck(args: { ability: string; event: Event }) {
    return this.onRollAbility(args);
  }

  _rollSavingThrow(args: { ability: string; event: Event }) {
    return this.onRollSavingThrow(args);
  }

  _rollSkill(args: { event: Event; skill: string }) {
    return this.onRollSkill(args);
  }

  onRollSkill(options: Partial<GroupSkillRollProcessConfiguration>) {
    if (
      !FoundryAdapter.userIsGm() ||
      TidyHooks.tidy5eSheetsPrePromptGroupSkillRoll(this, options) === false
    ) {
      return;
    }

    return this.actor.rollSkill(options);
  }

  onRollAbility(options: { ability: string; event: Event }) {
    if (
      !FoundryAdapter.userIsGm() ||
      TidyHooks.tidy5eSheetsPrePromptGroupAbilityRoll(this, options) === false
    ) {
      return;
    }

    return this.rollAbility(options);
  }

  async rollAbility(config: { ability: string }) {
    if (!config.ability) {
      return;
    }

    const abilityConfig = CONFIG.DND5E.abilities[config.ability];

    const abilityLabel = abilityConfig?.label ?? '';

    await foundry.documents.ChatMessage.implementation.create({
      flavor: FoundryAdapter.localize('DND5E.AbilityPromptTitle', {
        ability: abilityLabel,
      }),
      speaker: ChatMessage.getSpeaker({
        actor: this.actor,
        alias: this.actor.name,
      }),
      system: {
        button: {
          icon: 'fa-solid fa-dice-d20',
          label: FoundryAdapter.localize(`TIDY5E.AbilityRoll`, {
            ability: abilityLabel,
          }),
        },
        data: { ...config },
        handler: CONSTANTS.ROLL_REQUEST_ABILITY_KEY,
        targets: this.actor.system.members.flatMap(
          ({ actor }: { actor: Actor5e }) => {
            if (actor.system.abilities) return { actor: actor.uuid };
            return [];
          },
        ),
      },
      type: 'request',
    });
    return false;
  }

  onRollSavingThrow(options: { ability: string; event: Event }) {
    if (
      !FoundryAdapter.userIsGm() ||
      TidyHooks.tidy5eSheetsPrePromptGroupSavingThrowRoll(this, options) ===
        false
    ) {
      return;
    }

    this.rollSavingThrow(options);
  }

  async rollSavingThrow(config: { ability: string }) {
    if (!config.ability) {
      return;
    }

    const abilityConfig = CONFIG.DND5E.abilities[config.ability];

    const abilityLabel = abilityConfig?.label ?? '';

    await foundry.documents.ChatMessage.implementation.create({
      flavor: FoundryAdapter.localize('DND5E.SavePromptTitle', {
        ability: abilityLabel,
      }),
      speaker: ChatMessage.getSpeaker({
        actor: this.actor,
        alias: this.actor.name,
      }),
      system: {
        button: {
          icon: 'fa-solid fa-dice-d20',
          label: FoundryAdapter.localize('DND5E.SavingThrowRoll', {
            ability: abilityLabel,
          }),
        },
        data: { ...config },
        handler: CONSTANTS.ROLL_REQUEST_SAVE_KEY,
        targets: this.actor.system.members.flatMap(
          ({ actor }: { actor: Actor5e }) => {
            if (actor.system.abilities) return { actor: actor.uuid };
            return [];
          },
        ),
      },
      type: 'request',
    });
    return false;
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
    options: ApplicationRenderOptions,
  ) {
    game.user.apps[this.id] = this;
    for (const member of this.actor.system.members) {
      // An actor can be added to the sheet and then removed from the world, causing member.actor to be null.
      if (member.actor) {
        member.actor.apps[this.id] = this;
      }
    }
    return await super._renderHTML(context, options);
  }

  async close(options: ApplicationClosingOptions = {}) {
    delete game.user.apps[this.id];
    for (const member of this.actor.system.members) {
      // An actor can be added to the sheet and then removed from the world, causing member.actor to be null.
      if (member.actor) {
        delete member.actor.apps[this.id];
      }
    }
    return await super.close(options);
  }
}
