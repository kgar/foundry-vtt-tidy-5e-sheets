import { CONSTANTS } from 'src/constants';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin';
import type {
  ApplicationConfiguration,
  ApplicationRenderOptions,
} from 'src/types/application.types';
import { mount } from 'svelte';
import ItemDebugSheet from './item/ItemDebugSheet.svelte';
import ItemHeaderStart from './item/parts/ItemHeaderStart.svelte';
import type { Tab } from 'src/types/types';
import type { Item5e, ItemDescription } from 'src/types/item.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export type ItemDebugSheetHightouchContext = {
  document: any;
  editable: boolean;
  item: Item5e;
  itemDescriptions: ItemDescription[];
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

  _createComponent(node: HTMLElement): Record<string, any> {
    return mount(ItemDebugSheet, {
      target: node,
      context: new Map<any, any>([
        [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this._context],
      ]),
    });
  }

  _createAdditionalComponents(node: HTMLElement) {
    const windowHeader = this.element.querySelector('.window-header');

    const sheetLock = mount(ItemHeaderStart, {
      target: windowHeader,
      anchor: windowHeader.querySelector('.window-title'),
      context: new Map<string, any>([
        [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this._context],
      ]),
    });

    return [sheetLock];
  }

  async _prepareContext(
    options: ApplicationRenderOptions
  ): Promise<ItemDebugSheetHightouchContext> {
    const rollData = this.document.getRollData();

    // Enrich HTML description
    const enrichmentOptions = {
      secrets: this.document.isOwner,
      relativeTo: this.item,
      rollData: rollData,
    };

    const enriched = {
      description: await TextEditor.enrichHTML(
        this.document.system.description.value,
        enrichmentOptions
      ),
      unidentified: await TextEditor.enrichHTML(
        this.document.system.unidentified?.description,
        enrichmentOptions
      ),
      chat: await TextEditor.enrichHTML(
        this.document.system.description.chat,
        enrichmentOptions
      ),
    };

    const isIdentifiable = 'identified' in this.document.system;

    const itemDescriptions: ItemDescription[] = [];
    itemDescriptions.push({
      enriched: enriched.description,
      content: this.document.system.description.value,
      field: 'system.description.value',
      label: FoundryAdapter.localize('DND5E.Description'),
    });

    if (isIdentifiable && FoundryAdapter.userIsGm()) {
      itemDescriptions.push({
        enriched: enriched.unidentified,
        content: this.document.system.unidentified.description,
        field: 'system.unidentified.description',
        label: FoundryAdapter.localize('DND5E.DescriptionUnidentified'),
      });
    }
    itemDescriptions.push({
      enriched: enriched.chat,
      content: this.document.system.description.chat,
      field: 'system.description.chat',
      label: FoundryAdapter.localize('DND5E.DescriptionChat'),
    });

    return {
      document: this.document,
      editable: this.isEditable,
      item: this.document,
      itemDescriptions,
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
