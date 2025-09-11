import { CONSTANTS } from 'src/constants';
import type {
  Actor5e,
  ActorSheetQuadroneContext,
  GroupMemberQuadroneContext,
  GroupMemberSkillContext,
  GroupMembersQuadroneContext,
  GroupSheetQuadroneContext,
  GroupSkill,
  GroupSkillRollProcessConfiguration,
  GroupTrait,
  GroupTraitBase,
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
import { coalesce, getModifierData } from 'src/utils/formatting';
import type { SkillData } from 'src/foundry/dnd5e.types';
import { Tidy5eNpcSheetQuadrone } from './Tidy5eNpcSheetQuadrone.svelte';
import { isNil } from 'src/utils/data';
import type { Ref } from 'src/features/reactivity/reactivity.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { settings } from 'src/settings/settings.svelte';
import { mapGetOrInsert } from 'src/utils/map';
import { Tidy5eMultiActorSheetQuadroneBase } from './Tidy5eMultiActorSheetQuadroneBase.svelte';
import { TidyHooks } from 'src/foundry/TidyHooks';

export class Tidy5eGroupSheetQuadrone extends Tidy5eMultiActorSheetQuadroneBase(
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
      skilled: [],
    };

    let skills = new Map<string, GroupSkill>(
      Object.entries(CONFIG.DND5E.skills).map<[string, GroupSkill]>(
        ([key, skill]) => [
          key,
          {
            ability: skill.ability,
            high: {
              total: -Infinity,
              value: '∞',
              sign: '-',
            },
            low: {
              total: Infinity,
              value: '∞',
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

      const section = sections[actor.type as SupportedActorType];

      if (!section) {
        continue;
      }

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
      sections.all.set(actor.uuid, groupMemberContext);

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

    sections.skilled.push(
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

  private _prepareMemberSkills(actor: any, skills: Map<string, GroupSkill>) {
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

      const modData = getModifierData(skill.total);

      if (skill.total > groupSkill.high.total) {
        groupSkill.high = {
          total: skill.total,
          ...modData,
        };
      }

      if (skill.total < groupSkill.low.total) {
        groupSkill.low = {
          total: skill.total,
          ...modData,
        };
      }

      groupSkill.identifiers.set(actor.uuid, {
        total: skill.total,
        ...modData,
        proficient: skill.proficient,
        passive: skill.passive,
      });

      groupSkill.proficient ||= skill.proficient > 0;
    });
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

      const groupLanguage = mapGetOrInsert(languages, language.label, {
        identifiers: new Map<string, MeasurableGroupTrait<number>>(),
        ...actorLanguageTrait,
      });

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
            const entry = mapGetOrInsert(languages, customLanguage, {
              label: customLanguage,
              identifiers: new Map<string, GroupTraitBase<number>>(),
            });

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

        let groupSpeed = mapGetOrInsert(speeds, key, {
          identifiers: new Map<string, MeasurableGroupTrait<number>>(),
          ...actorSpeedTrait,
        });

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
        const groupSpecial = mapGetOrInsert(specials, customEntry, {
          label: customEntry,
          identifiers: new Set<string>(),
        });

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

        let groupSense = mapGetOrInsert(senses, key, {
          identifiers: new Map<string, MeasurableGroupTrait<number>>(),
          ...actorSenseTrait,
        });

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
          const entry = mapGetOrInsert(senses, specialSense, {
            label: specialSense,
            identifiers: new Map<string, GroupTraitBase<number>>(),
          });

          entry?.identifiers.set(actor.uuid, { label: specialSense });
        });
    }
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
