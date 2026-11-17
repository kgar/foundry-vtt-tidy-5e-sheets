import { CONSTANTS } from 'src/constants';
import { getTidy5eMultiActorSheetQuadroneBase } from './Tidy5eMultiActorSheetQuadroneBase.svelte';
import type {
  FactionSheetContext,
  MultiActorQuadroneContext,
} from 'src/types/types';
import type {
  ApplicationConfiguration,
  ApplicationRenderOptions,
} from 'src/types/application.types';
import { mount } from 'svelte';
import FactionSheet from './actor/FactionSheet.svelte';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { FactionSheetRuntime } from 'src/runtime/actor/FactionSheetRuntime.svelte';

export class Tidy5eFactionSheetQuadrone extends getTidy5eMultiActorSheetQuadroneBase<FactionSheetContext>(
  CONSTANTS.SHEET_TYPE_FACTION,
) {
  currentTabId: string;
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
      // TODO
    },
  };

  _createComponent(node: HTMLElement): Record<string, any> {
    if (this.actor.limited) {
      return this._createLimitedViewComponent(node);
    }

    const component = mount(FactionSheet, {
      target: node,
      context: new Map<any, any>([...this._getActorSvelteContext()]),
    });

    initTidy5eContextMenu(this, this.element);

    return component;
  }

  async _prepareContext(
    options: ApplicationRenderOptions,
  ): Promise<FactionSheetContext> {
    if (options?.tidy?.soft && this._context?.data) {
      return this._context.data;
    }

    const actorContext = (await super._prepareContext(
      options,
    )) as MultiActorQuadroneContext<Tidy5eFactionSheetQuadrone>;

    const enrichmentArgs = {
      secrets: this.actor.isOwner,
      rollData: actorContext.rollData,
      relativeTo: this.actor,
    };

    const context: FactionSheetContext = {
      members: [],
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
      ...actorContext,
    };

    context.customContent =
      await FactionSheetRuntime.getContent(context);

    context.tabs = await FactionSheetRuntime.getTabs(context);

    TidyHooks.tidy5eSheetsPrepareSheetContext(this.document, this, context);

    return context;
  }
}
