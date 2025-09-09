import { CONSTANTS } from 'src/constants';
import type {
  EncounterSheetQuadroneContext,
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

    const context: EncounterSheetQuadroneContext = {
      type: 'encounter',
      ...actorContext,
    };

    // etc.

    context.tabs = await EncounterSheetQuadroneRuntime.getTabs(context);

    return context;
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
