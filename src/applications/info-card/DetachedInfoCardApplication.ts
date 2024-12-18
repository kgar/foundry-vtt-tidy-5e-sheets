import type { InfoCardState } from 'src/components/info-card/info-card.svelte';
import { CONSTANTS } from 'src/constants';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type { ApplicationConfiguration } from 'src/types/application.types';
import { mount } from 'svelte';
import DetachedInfoCard from './DetachedInfoCard.svelte';

export class DetachedInfoCardApplication extends SvelteApplicationMixin<{}>(
  foundry.applications.api.ApplicationV2
) {
  #cardState: InfoCardState<any>;

  constructor(cardState: InfoCardState<any>, ...rest: any[]) {
    super(...rest);

    this.#cardState = cardState;
  }

  static DEFAULT_OPTIONS: Partial<
    ApplicationConfiguration & { dragDrop: Partial<DragDropConfiguration>[] }
  > = {
    classes: [
      CONSTANTS.MODULE_ID,
      'application-shell',
      'tidy-info-card-application',
      'app-v2',
      CONSTANTS.SHEET_LAYOUT_CLASSIC,
    ],
    tag: 'div',
    window: {
      frame: true,
      positioned: true,
      resizable: true,
      controls: [],
    },
    position: {
      width: 280,
      height: 460,
    },
    actions: {},
    submitOnClose: false,
  };

  _createComponent(node: HTMLElement): Record<string, any> {
    const component = mount(DetachedInfoCard, {
      target: node,
      props: {
        cardState: this.#cardState,
      },
    });

    return component;
  }

  async _prepareContext() {
    return {};
  }
}
