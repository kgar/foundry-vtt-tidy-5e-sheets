import { CONSTANTS } from 'src/constants';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin';
import type {
  ApplicationConfiguration,
  ApplicationRenderOptions,
} from 'src/types/application.types';
import type { SvelteComponent } from 'svelte';
import ItemDebugSheet from './item/ItemDebugSheet.svelte';
import ItemHeaderStart from './item/parts/ItemHeaderStart.svelte';
import type { Tab } from 'src/types/types';

export type ItemDebugSheetHightouchContext = {
  document: any;
  system: any;
  tabs: Tab[];
};

export class Tidy5eItemDebugSheetHightouch extends SvelteApplicationMixin<ItemDebugSheetHightouchContext>(
  foundry.applications.sheets.ItemSheetV2
) {
  static DEFAULT_OPTIONS: Partial<
    ApplicationConfiguration & { dragDrop: Partial<DragDropConfiguration>[] }
  > = {
    classes: [
      CONSTANTS.MODULE_ID,
      'sheet',
      'item',
      CONSTANTS.ITEM_TYPE_CONTAINER,
      'app-v2',
      'hightouch',
    ],
    tag: 'form',
    window: {
      frame: true,
      positioned: true,
      resizable: true,
      controls: [],
    },
    position: {
      width: 1600,
      height: 2400,
    },
    actions: {},
    dragDrop: [{ dropSelector: 'div' }],
    submitOnClose: false,
  };

  _createComponent(node: HTMLElement): SvelteComponent<any, any, any> {
    return new ItemDebugSheet({
      target: node,
      context: new Map<any, any>([
        [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this._store],
      ]),
    });
  }

  _createAdditionalComponents(node: HTMLElement) {
    const windowHeader = this.element.querySelector('.window-header');

    const sheetLock = new ItemHeaderStart({
      target: windowHeader,
      anchor: windowHeader.querySelector('.window-title'),
      context: new Map<string, any>([
        [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this._store],
      ]),
    });

    return [sheetLock];
  }

  async _prepareContext(
    options: ApplicationRenderOptions
  ): Promise<ItemDebugSheetHightouchContext> {
    return {
      document: this.document,
      system: this.document.system,
      tabs: [],
    };
  }
}
