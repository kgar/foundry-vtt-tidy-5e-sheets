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
import type { Item5e } from 'src/types/item.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export type ItemDebugSheetHightouchContext = {
  document: any;
  editable: boolean;
  item: Item5e;
  system: any;
  tabs: Tab[];
  unlocked: boolean;
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
      editable: this.isEditable,
      item: this.document,
      system: this.document.system,
      tabs: [
        {
          content: {
            type: 'html',
            html: `<h1>Hallo 👋</h1>`,
            renderScheme: 'handlebars',
          },
          id: 'hallo-tab',
          title: 'Say Hallo',
        },
        {
          content: {
            type: 'html',
            html: `<h1>Welcome 🤝</h1>`,
            renderScheme: 'handlebars',
          },
          id: 'welcome-tab',
          title: 'Welcome',
        },
      ],
      unlocked: FoundryAdapter.isSheetUnlocked(this.document),
    };
  }
}
