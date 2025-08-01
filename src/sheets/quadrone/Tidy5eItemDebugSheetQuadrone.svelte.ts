import { CONSTANTS } from 'src/constants';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type {
  ApplicationConfiguration,
  ApplicationRenderOptions,
} from 'src/types/application.types';
import { mount } from 'svelte';
import ItemDebugSheet from './item/ItemDebugSheet.svelte';
import ItemHeaderStart from './item/parts/ItemHeaderStart.svelte';
import type { DocumentSheetV2Context, Tab } from 'src/types/types';
import type {
  Item5e,
  ItemDescription,
  ItemNameContext,
} from 'src/types/item.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { TidyExtensibleDocumentSheetMixin } from 'src/mixins/TidyDocumentSheetMixin.svelte';

export type ItemDebugSheetQuadroneContext = {
  document: any;
  editable: boolean;
  item: Item5e;
  itemDescriptions: ItemDescription[];
  name: ItemNameContext;
  sheet: Tidy5eItemDebugSheetQuadrone;
  system: any;
  tabs: Tab[];
  unlocked: boolean;
} & DocumentSheetV2Context;

export class Tidy5eItemDebugSheetQuadrone extends TidyExtensibleDocumentSheetMixin(
  CONSTANTS.SHEET_TYPE_ITEM,
  SvelteApplicationMixin<
    ApplicationConfiguration | undefined,
    ItemDebugSheetQuadroneContext
  >(foundry.applications.sheets.ItemSheetV2)
) {
  static DEFAULT_OPTIONS: Partial<
    ApplicationConfiguration & { dragDrop: Partial<DragDropConfiguration>[] }
  > = {
    classes: [
      CONSTANTS.MODULE_ID,
      'sheet',
      'item',
      CONSTANTS.ITEM_TYPE_CONTAINER,
      'quadrone',
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
    submitOnClose: true,
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
  ): Promise<ItemDebugSheetQuadroneContext> {
    const documentSheetContext = await super._prepareContext(options);

    const rollData = this.document.getRollData();

    // Enrich HTML description
    const enrichmentOptions = {
      secrets: this.document.isOwner,
      relativeTo: this.item,
      rollData: rollData,
    };

    const enriched = {
      description: await foundry.applications.ux.TextEditor.enrichHTML(
        this.document.system.description.value,
        enrichmentOptions
      ),
      unidentified: await foundry.applications.ux.TextEditor.enrichHTML(
        this.document.system.unidentified?.description,
        enrichmentOptions
      ),
      chat: await foundry.applications.ux.TextEditor.enrichHTML(
        this.document.system.description.chat,
        enrichmentOptions
      ),
    };

    const systemSource = this.document.system.toObject();

    const isIdentifiable = 'identified' in this.document.system;

    const itemDescriptions: ItemDescription[] = [];
    itemDescriptions.push({
      enriched: enriched.description,
      content: systemSource.description.value,
      field: 'system.description.value',
      label: FoundryAdapter.localize('DND5E.Description'),
    });

    if (isIdentifiable && FoundryAdapter.userIsGm()) {
      itemDescriptions.push({
        enriched: enriched.unidentified,
        content: systemSource.unidentified.description,
        field: 'system.unidentified.description',
        label: FoundryAdapter.localize('DND5E.DescriptionUnidentified'),
      });
    }
    itemDescriptions.push({
      enriched: enriched.chat,
      content: systemSource.description.chat,
      field: 'system.description.chat',
      label: FoundryAdapter.localize('DND5E.DescriptionChat'),
    });

    return {
      item: this.document,
      itemDescriptions,
      name: {
        value: this.item.name,
        editable: this.item._source.name,
        field: this.item.schema.getField('name'),
      },
      sheet: this,
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
      ...documentSheetContext,
    };
  }
}
