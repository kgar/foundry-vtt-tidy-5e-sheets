import { CONSTANTS } from 'src/constants';
import type {
  Actor5e,
  ActorSheetQuadroneContext,
  EncounterCreatureTypeContext,
  EncounterMemberQuadroneContext,
  EncounterSheetQuadroneContext,
  EncounterTraits,
  GroupTrait,
  MeasurableGroupTrait,
  MultiActorQuadroneContext,
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

export class Tidy5eEncounterSheetQuadrone extends Tidy5eMultiActorSheetQuadroneBase(
  CONSTANTS.SHEET_TYPE_ENCOUNTER
) {
  currentTabId: string;

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

    const component = mount(EncounterSheet, {
      target: node,
      context: new Map<any, any>(this._getActorSvelteContext()),
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

    const difficulty = await this.actor.system.getDifficulty();

    const context: EncounterSheetQuadroneContext = {
      difficulty: difficulty
        ? FoundryAdapter.localize(`DND5E.ENCOUNTER.Difficulty.${difficulty}`)
        : null,
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
      ...(await this._prepareMembers(actorContext)),
      ...actorContext,
    };

    context.tabs = await EncounterSheetQuadroneRuntime.getTabs(context);

    return context;
  }

  async _prepareMembers(context: ActorSheetQuadroneContext): Promise<{
    creatureTypes: EncounterCreatureTypeContext[];
    members: {
      npc: EncounterMemberQuadroneContext[];
    };
    traits: EncounterTraits;
  }> {
    const members: Actor5e[] = await this.actor.system.getMembers();

    const creatureTypeCountMap = new Map<
      string,
      EncounterCreatureTypeContext
    >();

    let cis = new Map<string, GroupTrait>();
    let dis = new Map<string, GroupTrait>();
    let drs = new Map<string, GroupTrait>();
    let dvs = new Map<string, GroupTrait>();
    let languages = new Map<string, MeasurableGroupTrait<number>>();
    let senses = new Map<string, MeasurableGroupTrait<number>>();
    let speeds = new Map<string, MeasurableGroupTrait<number>>();

    const memberContexts = await Promise.all(
      members.map(async ({ actor, quantity }) => {
        const accentColor = coalesce(
          // Use the actor's accent color, if configured
          ThemeQuadrone.getSheetThemeSettings({
            doc: actor,
            applyWorldThemeSetting: false,
          }).accentColor,
          // Else, use the encounter sheet's accent color, with fallback to world default accent color
          context.themeSettings.accentColor
        );

        // TODO: Extract to preparation method
        const details = actor.system.details;

        const creatureTypeLabel =
          details.type.value === 'custom'
            ? details.type.custom
            : CONFIG.DND5E.creatureTypes[details.type.value]?.label;
        const creatureType =
          details.type.value === 'custom'
            ? details.type.custom
            : details.type.value;

        mapGetOrInsertComputed(creatureTypeCountMap, creatureType, () => ({
          type: creatureType,
          label: creatureTypeLabel,
          quantity: 0,
        })).quantity += quantity.value;

        this._prepareMemberTrait('ci', actor, cis);
        this._prepareMemberTrait('di', actor, dis);
        this._prepareMemberTrait('dr', actor, drs);
        this._prepareMemberTrait('dv', actor, dvs);
        this._prepareMemberLanguages(actor, languages);
        this._prepareMemberSenses(actor, senses);
        this._prepareMemberSpeeds(actor, speeds);

        return {
          actor,
          quantity,
          accentColor,
          backgroundColor: !isNil(accentColor, '')
            ? `oklch(from ${accentColor} calc(l * 0.75) calc(c * 1.2) h)`
            : undefined,
          highlightColor: !isNil(accentColor, '')
            ? `oklch(from ${accentColor} calc(l * 1.4) 60% h)`
            : undefined,
          portrait: await this._preparePortrait(actor),
        };
      })
    );

    return {
      creatureTypes: [...creatureTypeCountMap.values()].toSorted((a, b) =>
        a.label.localeCompare(b.label, game.i18n.lang)
      ),
      members: {
        npc: memberContexts,
      },
      traits: {
        cis: [...cis.values()].toSorted((a, b) =>
          a.label.localeCompare(b.label, game.i18n.lang)
        ),
        dis: [...dis.values()].toSorted((a, b) =>
          a.label.localeCompare(b.label, game.i18n.lang)
        ),
        drs: [...drs.values()].toSorted((a, b) =>
          a.label.localeCompare(b.label, game.i18n.lang)
        ),
        dvs: [...dvs.values()].toSorted((a, b) =>
          a.label.localeCompare(b.label, game.i18n.lang)
        ),
        languages: [...languages.values()].toSorted((a, b) =>
          a.label.localeCompare(b.label, game.i18n.lang)
        ),
        senses: [...senses.values()].toSorted((a, b) =>
          a.label.localeCompare(b.label, game.i18n.lang)
        ),
        speeds: [...speeds.values()].toSorted((a, b) =>
          a.label.localeCompare(b.label, game.i18n.lang)
        ),
      },
    };
  }

  /* -------------------------------------------- */
  /*  Sheet Actions                               */
  /* -------------------------------------------- */

  async updateMemberQuantity(uuid: string, newValue: string | number) {
    const members: any[] = this.actor.system.toObject().members;

    const index = members.findIndex((m: any, i: number) => m.uuid === uuid);

    if (index < 0) {
      return;
    }

    const member = members[index];
    const currentQuantity = members[index].quantity.value;
    const newQuantity =
      typeof newValue === 'number'
        ? newValue
        : processInputChangeDeltaFromValues(newValue, currentQuantity);

    if (newQuantity !== undefined) {
      foundry.utils.setProperty(member, 'quantity.value', newQuantity);
      return await this.actor.update({ 'system.members': members });
    }
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

  /* -------------------------------------------- */
  /*  Life-Cycle Handlers                         */
  /* -------------------------------------------- */

  async _renderFrame(options: TidyDocumentSheetRenderOptions) {
    const element = await super._renderFrame(options);

    element.querySelector('.window-header').classList.add('theme-dark');

    return element;
  }
}
