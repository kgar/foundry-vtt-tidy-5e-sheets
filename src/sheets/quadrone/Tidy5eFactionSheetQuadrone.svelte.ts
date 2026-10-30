import { CONSTANTS } from 'src/constants';
import { getTidy5eMultiActorSheetQuadroneBase } from './Tidy5eMultiActorSheetQuadroneBase.svelte';
import type { FactionSheetQuadroneContext } from 'src/types/types';
import type { ApplicationConfiguration } from 'src/types/application.types';
import { mount } from 'svelte';
import FactionSheet from './actor/FactionSheet.svelte';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';

export class Tidy5eFactionSheetQuadrone extends getTidy5eMultiActorSheetQuadroneBase<FactionSheetQuadroneContext>(
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

  // todo: pick up here
}
