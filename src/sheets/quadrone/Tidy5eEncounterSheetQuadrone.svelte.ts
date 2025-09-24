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
import { Tidy5eMultiActorSheetQuadroneBase } from './Tidy5eMultiActorSheetQuadroneBase.svelte';
import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
import { coalesce } from 'src/utils/formatting';
import { isNil } from 'src/utils/data';
import { processInputChangeDeltaFromValues } from 'src/utils/form';
import { mapGetOrInsertComputed } from 'src/utils/map';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Ref } from 'src/features/reactivity/reactivity.types';
import type { EncounterMemberContext } from 'src/types/group.types';
import {
  TidyFlags,
  type EncounterCombatantSettings,
  type EncounterPlaceholder,
} from 'src/api';
import { CombatantSettings } from 'src/features/combat/CombatantSettings';

export class Tidy5eEncounterSheetQuadrone extends Tidy5eMultiActorSheetQuadroneBase(
  CONSTANTS.SHEET_TYPE_ENCOUNTER
) {
  static DEFAULT_ENCOUNTER_PLACEHOLDER_ICON = 'icons/svg/mystery-man.svg';

  currentTabId: string;
  emphasizedMember: Ref<EncounterMemberContext | undefined> = $state({
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
    options: ApplicationRenderOptions
  ): Promise<EncounterSheetQuadroneContext> {
    const actorContext = (await super._prepareContext(
      options
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
          } satisfies DifficultyTarget)
      );

    if (!game.actors.party) {
      difficultyTargets.push({
        name: FoundryAdapter.localize('TIDY5E.Group.PrimaryParty.Label'),
        primary: true,
        id: '',
      });
    }

    let difficultyTargetId = TidyFlags.encounterDifficultyTargetGroupId.get(
      game.user
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
          a.name.localeCompare(b.name, game.i18n.lang)
        ),
        targetId: difficultyTargetId,
      },
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
      totalGold: this.getGpSummary(this.actor),
      totalXp: await this.actor.system.getXPValue(),
      type: 'encounter',
      ...(await this._prepareMemberDependentContext(actorContext)),
      ...actorContext,
    };

    context.tabs = await EncounterSheetQuadroneRuntime.getTabs(context);

    return context;
  }

  async _prepareMemberDependentContext(
    context: ActorSheetQuadroneContext
  ): Promise<{
    combatants: (
      | EncounterMemberQuadroneContext
      | EncounterPlaceholderQuadroneContext
    )[];
    creatureTypes: EncounterCreatureTypeContext[];
    members: {
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
      | EncounterMemberQuadroneContext
      | EncounterPlaceholderQuadroneContext
    )[] = [];
    const creatureTypes = new Map<string, EncounterCreatureTypeContext>();
    const languages = new Map<string, MeasurableGroupTrait<number>>();
    const senses = new Map<string, MeasurableGroupTrait<number>>();
    const specials = new Map<string, GroupTrait>();
    const speeds = new Map<string, MeasurableGroupTrait<number>>();

    const memberContexts = await Promise.all(
      members.map(async ({ actor, quantity }) => {
        const combatantSettings = CombatantSettings.getEntry(
          this.actor,
          actor.uuid
        );

        const accentColor = coalesce(
          // Use the actor's accent color, if configured
          ThemeQuadrone.getSheetThemeSettings({
            doc: actor,
            applyWorldThemeSetting: false,
          }).accentColor,
          // Else, use the encounter sheet's accent color, with fallback to world default accent color
          context.themeSettings.accentColor
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
          name: actor.name,
          portrait: await this._preparePortrait(actor),
          initiative: combatantSettings.initiative,
          includeInCombat: combatantSettings.include,
          visible: combatantSettings.visible,
          type: 'member',
        };

        npcMap.set(actor.uuid, memberContext);

        combatants.push(memberContext);

        return memberContext;
      })
    );

    Object.values(TidyFlags.placeholders.get(this.actor)).forEach(
      (placeholder) => {
        const combatantSettings = CombatantSettings.getEntry(
          this.actor,
          placeholder.id
        );

        combatants.push({
          ...placeholder,
          type: 'placeholder',
          initiative: combatantSettings.initiative,
          includeInCombat: combatantSettings.include,
          name: placeholder.name,
          visible: combatantSettings.visible,
        });
      }
    );

    return {
      combatants: combatants.sort(
        (a, b) =>
          (b.initiative ?? 0) - (a.initiative ?? 0) ||
          a.name.localeCompare(b.name, game.i18n.lang)
      ),
      creatureTypes: [...creatureTypes.values()].sort((a, b) =>
        a.label.localeCompare(b.label, game.i18n.lang)
      ),
      members: {
        npc: memberContexts,
        all: npcMap,
      },
      skills: [...skills.values()].sort((a, b) =>
        a.name.localeCompare(b.name, game.i18n.lang)
      ),
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
    quantity: any
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

  /* -------------------------------------------- */
  /*  Sheet Actions                               */
  /* -------------------------------------------- */

  updateMemberQuantity(uuid: string, newValue: string) {
    return this.updateMember(uuid, (member) => {
      const currentQuantity = member.quantity.value;
      const newQuantity =
        typeof newValue === 'number'
          ? newValue
          : processInputChangeDeltaFromValues(newValue, currentQuantity);

      if (newQuantity !== undefined) {
        foundry.utils.setProperty(member, 'quantity.value', newQuantity);
      }
    });
  }

  updateMemberFormula(uuid: string, newValue: string | number) {
    return this.updateMember(uuid, (member) => {
      foundry.utils.setProperty(member, 'quantity.formula', newValue);
    });
  }

  updatePlaceholderField<K extends keyof EncounterPlaceholder>(
    placeholder: EncounterPlaceholderQuadroneContext,
    key: K,
    value: EncounterPlaceholder[K]
  ) {
    const data: EncounterPlaceholder = {
      id: placeholder.id,
      img: placeholder.img,
      name: placeholder.name,
      note: placeholder.note,
    };

    data[key] = value;

    return TidyFlags.placeholders.insertOrUpdateEntry(this.actor, data);
  }

  async getPrerolledInitiative(ev: Event, actor: Actor5e) {
    const keys = FoundryAdapter.getRollModeState(ev);
    const roll = actor.getInitiativeRoll({ ...keys, event: ev });
    await roll.evaluate();
    return roll.total;
  }

  async prerollInitiative(ev: Event, actor: Actor5e) {
    const total = await this.getPrerolledInitiative(ev, actor);

    CombatantSettings.insertOrUpdate(this.actor, {
      identifier: actor.uuid,
      initiative: total,
    });
  }

  async prerollAllInitiatives(ev: Event) {
    const members = await this.getMembers();

    const initiatives = (
      await Promise.all(
        members.map(async ({ actor }) => {
          const total = await this.getPrerolledInitiative(ev, actor);
          return [actor.uuid, total];
        })
      )
    ).reduce<Record<string, Partial<EncounterCombatantSettings>>>(
      (prev, [uuid, initiative]) => {
        prev[uuid] = {
          identifier: uuid,
          initiative: initiative,
        };
        return prev;
      },
      {}
    );

    CombatantSettings.bulkInsertOrUpdate(this.actor, initiatives);
  }

  updateMember(
    uuid: string,
    memberUpdateCallback: (member: any) => void
  ): Promise<any> | undefined {
    const members: any[] = this.actor.system.toObject().members;

    const member = members.find((m: any) => m.uuid === uuid);

    if (!member) {
      return;
    }

    memberUpdateCallback(member);

    return this.actor.update({ 'system.members': members });
  }

  async award() {
    new dnd5e.applications.Award({
      award: {
        currency: { ...this.actor.system.currency },
        savedDestinations: this.actor.getFlag('dnd5e', 'awardDestinations'),
        xp: await this.actor.system.getXPValue(),
      },
    }).render({ force: true });
  }

  async _browseAddNpc() {
    const result = await dnd5e.applications.CompendiumBrowser.selectOne({
      filters: {
        locked: {
          documentClass: CONSTANTS.DOCUMENT_NAME_ACTOR,
          types: new Set([CONSTANTS.SHEET_TYPE_NPC]),
        },
      },
    });

    if (result) {
      const actor = await fromUuid(result);
      this.actor.system.addMember(actor);
    }
  }

  async addNewPlaceholder(
    data?: Partial<EncounterPlaceholder>,
    combatantSettings?: Partial<EncounterCombatantSettings>
  ): Promise<void> {
    data ??= {};
    const newPlaceholder = FoundryAdapter.mergeObject(
      {
        id: foundry.utils.randomID(),
        img: Tidy5eEncounterSheetQuadrone.DEFAULT_ENCOUNTER_PLACEHOLDER_ICON,
        name: FoundryAdapter.localize('TIDY5E.Encounter.NewPlaceholder.Name'),
      },
      data
    );

    const result = await TidyFlags.placeholders.insertOrUpdateEntry(
      this.actor,
      newPlaceholder
    );

    if (combatantSettings) {
      await CombatantSettings.insertOrUpdate(this.actor, {
        identifier: newPlaceholder.id,
        ...combatantSettings,
      });
    }

    return result;
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
            defaultCombatantSettings.include
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
            combatantSettings[p.id]?.include ?? defaultCombatantSettings.include
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

  deletePlaceholder(placeholderId: string): Promise<void> {
    return TidyFlags.placeholders.deleteEntry(this.actor, placeholderId);
  }

  async onAddPlaceholder(ev: Event & { currentTarget: HTMLElement }) {
    const type = ev.currentTarget
      .closest('[data-combatant-type]')
      ?.getAttribute('data-combatant-type');

    if (type === 'member') {
      const uuid =
        ev.currentTarget
          .closest('[data-member-uuid]')
          ?.getAttribute('data-member-uuid') ?? '';

      const actorMember = this.actor.system.members.find(
        (m: any) => m.uuid === uuid
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
        ev.currentTarget
          .closest('[data-placeholder-id]')
          ?.getAttribute('data-placeholder-id') ?? '';

      const placeholder = placeholders[placeholderId];

      const combatantSettings = CombatantSettings.getEntry(
        this.actor,
        placeholderId
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
    }[]
  ): Promise<void> | undefined {
    if (!game.combat) {
      ui.notifications.warn(
        FoundryAdapter.localize(
          'TIDY5E.Encounter.AddCombatants.MustHaveEncounter.Message'
        )
      );
      return;
    }

    return game.combat.createEmbeddedDocuments('Combatant', combatants);
  }

  toggleCombatantVisibility(identifier: string) {
    const settings = CombatantSettings.getEntry(this.actor, identifier);

    return CombatantSettings.insertOrUpdate(this.actor, {
      identifier,
      visible: !settings.visible,
    });
  }

  toggleCombatantInclusion(identifier: string) {
    const settings = CombatantSettings.getEntry(this.actor, identifier);

    return CombatantSettings.insertOrUpdate(this.actor, {
      identifier,
      include: !settings.include,
    });
  }

  /* -------------------------------------------- */
  /*  Life-Cycle Handlers                         */
  /* -------------------------------------------- */

  async _renderFrame(options: TidyDocumentSheetRenderOptions) {
    const element = await super._renderFrame(options);

    element.querySelector('.window-header').classList.add('theme-dark');

    return element;
  }
}
