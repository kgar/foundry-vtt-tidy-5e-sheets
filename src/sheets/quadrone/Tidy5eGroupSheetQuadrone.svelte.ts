import { CONSTANTS } from 'src/constants';
import type {
  Actor5e,
  ActorSheetQuadroneContext,
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
import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
import { type TidyDocumentSheetRenderOptions } from 'src/mixins/TidyDocumentSheetMixin.svelte';
import { GroupSheetQuadroneRuntime } from 'src/runtime/actor/GroupSheetQuadroneRuntime.svelte';
import type { GroupMemberContext } from 'src/types/group.types';
import { Tidy5eCharacterSheetQuadrone } from './Tidy5eCharacterSheetQuadrone.svelte';
import { coalesce } from 'src/utils/formatting';
import { Tidy5eNpcSheetQuadrone } from './Tidy5eNpcSheetQuadrone.svelte';
import { isNil } from 'src/utils/data';
import type { Ref } from 'src/features/reactivity/reactivity.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { settings } from 'src/settings/settings.svelte';
import { mapGetOrInsert, mapGetOrInsertComputed } from 'src/utils/map';
import { Tidy5eMultiActorSheetQuadroneBase } from './Tidy5eMultiActorSheetQuadroneBase.svelte';
import { TidyHooks } from 'src/foundry/TidyHooks';
import type { Item5e } from 'src/types/item.types';
import { Inventory } from 'src/features/sections/Inventory';
import { TidyFlags } from 'src/api';
import TableRowActionsRuntime from 'src/runtime/tables/TableRowActionsRuntime.svelte';

export class Tidy5eGroupSheetQuadrone extends Tidy5eMultiActorSheetQuadroneBase<GroupSheetQuadroneContext>(
  CONSTANTS.SHEET_TYPE_GROUP
) {
  currentTabId: string;
  emphasizedMember: Ref<GroupMemberContext | undefined> = $state({
    value: undefined,
  });

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
    options: ApplicationRenderOptions
  ): Promise<GroupSheetQuadroneContext> {
    if (options.soft && this._context?.data) {
      return this._context.data;
    }

    const actorContext = (await super._prepareContext(
      options
    )) as MultiActorQuadroneContext<Tidy5eGroupSheetQuadrone>;

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
      ...(await this._prepareMemberDependentContext(actorContext)),
      ...actorContext,
    };

    // etc.
    context.customContent = await GroupSheetQuadroneRuntime.getContent(context);

    context.tabs = await GroupSheetQuadroneRuntime.getTabs(context);

    return context;
  }

  async _prepareMemberDependentContext(
    actorContext: ActorSheetQuadroneContext
  ): Promise<{
    members: GroupMembersQuadroneContext;
    skills: GroupSkill[];
    traits: GroupTraits;
  }> {
    let customSections = TidyFlags.sections.get(this.actor);

    let rowActions =
      TableRowActionsRuntime.getGroupMemberRowActions(actorContext);

    let sections = new Map<string, GroupMemberSection>([
      [
        CONSTANTS.SHEET_TYPE_CHARACTER,
        {
          members: [],
          label: 'TYPES.Actor.characterPl',
          key: CONSTANTS.SHEET_TYPE_CHARACTER,
          show: true,
          dataset: {},
          rowActions,
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
          rowActions,
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
          rowActions,
        },
      ],
    ]);

    let membersContext: GroupMembersQuadroneContext = {
      sections: [],
      character: [],
      all: new Map<string, GroupMemberQuadroneContext>(),
      skilled: [],
    };

    let skills = this._getMemberGroupSkillMap();

    let languages = new Map<string, MeasurableGroupTrait<number>>();
    let senses = new Map<string, MeasurableGroupTrait<number>>();
    let specials = new Map<string, GroupTrait>();
    let speeds = new Map<string, MeasurableGroupTrait<number>>();
    let tools = new Map<string, GroupTrait>();

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
          rowActions,
        })
      );

      const accentColor = coalesce(
        // Use the actor's accent color, if configured
        ThemeQuadrone.getSheetThemeSettings({
          doc: actor,
          applyWorldThemeSetting: false,
        }).accentColor,
        // Else, use the group sheet's accent color, with fallback to world default accent color
        actorContext.themeSettings.accentColor
      );

      const canObserve =
        !settings.value.useGroupSheetMemberSecurity ||
        actor.testUserPermission(game.user, CONSTANTS.PERMISSION_OBSERVER);

      const groupMemberContext = {
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
        inspirationSource:
          actor.type === CONSTANTS.SHEET_TYPE_CHARACTER
            ? await Tidy5eCharacterSheetQuadrone.tryGetInspirationSource(actor)
            : undefined,
        portrait: await this._preparePortrait(actor),
        gold: FoundryAdapter.formatNumber(this.getGpSummary(actor)),
        goldAbbreviation: CONFIG.DND5E.currencies.gp?.abbreviation ?? '',
      };

      section.members.push(groupMemberContext);
      membersContext.all.set(actor.uuid, groupMemberContext);
      if (actor.type === CONSTANTS.SHEET_TYPE_CHARACTER) {
        membersContext.character.push(actor);
      }

      const prepareCreatureInformation =
        canObserve &&
        (actor.type === CONSTANTS.SHEET_TYPE_CHARACTER ||
          Tidy5eNpcSheetQuadrone.isImportantNpc(actor));

      if (prepareCreatureInformation) {
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

      const prepareSpeed =
        prepareCreatureInformation ||
        actor.type === CONSTANTS.SHEET_TYPE_VEHICLE;

      if (prepareSpeed) {
        // Speeds
        this._prepareMemberSpeeds(actor, speeds);
      }
    }

    membersContext.skilled.push(
      ...skilled.values().reduce((prev, curr) => {
        return prev.concat(
          curr.toSorted((a, b) =>
            a.actor.name.localeCompare(b.actor.name, game.i18n.lang)
          )
        );
      }, [])
    );

    let groupSkills = [...skills.values()].toSorted((a, b) =>
      a.name.localeCompare(b.name, game.i18n.lang)
    );

    membersContext.sections = [...sections.values()];

    return {
      members: membersContext,
      skills: groupSkills,
      traits: {
        languages: [...languages.values()].sort((a, b) =>
          a.label.localeCompare(b.label, game.i18n.lang)
        ),
        senses: [...senses.values()].sort((a, b) =>
          a.label.localeCompare(b.label, game.i18n.lang)
        ),
        specials: [...specials.values()].sort((a, b) =>
          a.label.localeCompare(b.label, game.i18n.lang)
        ),
        speeds: [...speeds.values()].sort((a, b) =>
          a.label.localeCompare(b.label, game.i18n.lang)
        ),
        tools: [...tools.values()].sort((a, b) =>
          a.label.localeCompare(b.label, game.i18n.lang)
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
        defaultUnits[systemUnits]
      ),
      value: dnd5e.utils.convertWeight(
        value,
        baseUnits[systemUnits],
        defaultUnits[systemUnits]
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

  protected _getSheetPinTabIdsForItem(sheetPin: Item5e): string[] {
    const tabIds: string[] = [CONSTANTS.TAB_MEMBERS];

    if (Inventory.isItemInventoryType(sheetPin)) {
      tabIds.push(CONSTANTS.TAB_ACTOR_INVENTORY);
    }

    return tabIds;
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

  onRollSkill(options: Partial<GroupSkillRollProcessConfiguration>) {
    if (
      TidyHooks.tidy5eSheetsPrePromptGroupSkillRoll(this, options) === false
    ) {
      return;
    }

    this.actor.rollSkill(options);
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
