import { CONSTANTS } from 'src/constants';
import {
  SvelteApplicationMixin,
  type ApplicationRenderOptions,
} from '../mixins/SvelteApplicationMixin';
import type { SvelteComponent } from 'svelte';
import GroupSheet from './group/GroupSheet.svelte';

export type GroupSheetClassicContext = {
  greetings: string;
  showThumbsUp: boolean;
};

export class Tidy5eGroupSheet extends SvelteApplicationMixin<GroupSheetClassicContext>(
  foundry.applications.sheets.ActorSheetV2
) {
  static DEFAULT_OPTIONS = {
    classes: [CONSTANTS.MODULE_ID, 'group'],
    tag: 'div',
    window: {
      frame: true,
      positioned: true,
      resizable: true,
    },
    position: {
      width: 480,
      height: 700,
    },
  };

  // TODO: First render, derive options that come from user preference

  _createComponent(node: HTMLElement): SvelteComponent<any, any, any> {
    return new GroupSheet({
      target: node,
      context: new Map<any, any>([
        [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this._store],
      ]),
    });
  }

  async _prepareContext(
    options: ApplicationRenderOptions
  ): Promise<GroupSheetClassicContext> {
    return {
      greetings: 'Hello, world!',
      showThumbsUp: true,
    };
  }
}
