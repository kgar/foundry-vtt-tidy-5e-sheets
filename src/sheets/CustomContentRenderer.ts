import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { CustomContent, Tab } from 'src/types/types';
import { delay } from 'src/utils/asynchrony';
import {
  getCustomContentGroupIdSelector,
  wrapCustomHtmlForRendering,
} from 'src/utils/content';
import { isNil } from 'src/utils/data';
import { processInputChangeDelta } from 'src/utils/form';
import { debug, error, warn } from 'src/utils/logging';

type CustomContentRenderParams = {
  app: any;
  element: any; // jQuery
  data: any;
  tabs: Tab[];
  isFullRender: boolean;
  superActivateListeners: any;
  customContent: CustomContent[];
};

export class CustomContentRenderer {
  static async render(params: CustomContentRenderParams) {
    const {
      app,
      tabs,
      element,
      data,
      isFullRender,
      superActivateListeners,
      customContent,
    } = params;

    const htmlElement = element as HTMLElement;
    if (!htmlElement) {
      debug('Element not available when it normally should be', params);
      return;
    }

    htmlElement
      .querySelectorAll<HTMLElement>(
        CONSTANTS.HTML_DYNAMIC_RENDERING_ATTRIBUTE_SELECTOR
      )
      .forEach((el: HTMLElement) => el.remove());

    const sheetEl = htmlElement;
    await CustomContentRenderer._renderTabs(
      tabs,
      sheetEl,
      isFullRender,
      app,
      data,
      params
    );

    for (let c of customContent) {
      try {
        CustomContentRenderer._renderContent(
          sheetEl,
          c,
          app,
          data,
          isFullRender,
          superActivateListeners
        );
      } catch (e) {
        error('Unable to render custom content', false, e);
        debug('Custom content render failure context', {
          content: c,
          app,
          data,
          isFullRender,
        });
      }
    }
  }

  private static _renderTabs(
    tabs: Tab[],
    sheetEl: HTMLElement,
    isFullRender: boolean,
    app: any,
    data: any,
    args: CustomContentRenderParams
  ): Promise<unknown> {
    const promises = tabs.map(async (tab) => {
      try {
        let tabEl = sheetEl.querySelector<HTMLElement>(
          `[data-tab-contents-for="${tab.id}"]`
        );

        if (!tabEl) {
          // This content was added during a non-forced render (e.g., tab selection changes); wait a tick and re-attempt to set its HTML
          await delay(0);
          tabEl = sheetEl.querySelector<HTMLElement>(
            `[data-tab-contents-for="${tab.id}"]`
          );
        }

        if (!tabEl) {
          debug('Unable to find custom tab content container for render');
          return;
        }

        if (
          tab.content.type === 'html' &&
          (isFullRender || tab.content.renderScheme === 'handlebars')
        ) {
          tabEl.innerHTML = tab.content.html;
        }

        if (tab.onRender) {
          tab.onRender({
            app: app,
            data: data,
            element: sheetEl,
            tabContentsElement: tabEl,
            isFullRender: isFullRender,
          });
        }
      } catch (e) {
        error('Failed to render custom content due to an error', false, e);
        debug('Custom content error debug details', {
          error: e,
          erroredTab: tab,
          args: args,
        });
      }
    });
    return Promise.all(promises);
  }

  private static _renderContent(
    sheetEl: any,
    customContent: CustomContent,
    app: any,
    data: any,
    isFullRender: boolean,
    superActivateListeners: any
  ) {
    const groupId = foundry.utils.randomID();

    let contentHtml = '';
    try {
      contentHtml =
        typeof customContent.content.html === 'function'
          ? customContent.content.html(data)
          : customContent.content.html;
    } catch (e) {
      error('Failed to render custom HTML', false, { e, customContent });
    }

    const wrappedContent = wrapCustomHtmlForRendering(
      contentHtml,
      customContent.content.renderScheme,
      groupId,
      customContent.activateDefaultSheetListeners
    );

    if (customContent.onContentReady) {
      customContent.onContentReady({
        app: app,
        data: data,
        element: sheetEl,
        isFullRender: isFullRender,
        content: wrappedContent,
      });
    }

    if (!isNil(customContent.position)) {
      const targetElements = Array.from(
        sheetEl.querySelectorAll(customContent.selector)
      ) as HTMLElement[];

      if (!targetElements.length) {
        debug('No target elements were found for injecting custom content', {
          content: customContent,
        });
      }

      targetElements.forEach((el: HTMLElement) => {
        el.insertAdjacentHTML(
          customContent.position as InsertPosition,
          wrappedContent
        );
      });

      if (customContent.activateDefaultSheetListeners) {
        const groupSelector = getCustomContentGroupIdSelector(groupId);
        sheetEl
          .querySelectorAll(groupSelector)
          .forEach((el: HTMLElement) => superActivateListeners(el));
      }
    }

    if (customContent.onRender) {
      customContent.onRender({
        app: app,
        data: data,
        element: sheetEl,
        isFullRender: isFullRender,
      });
    }
  }

  static wireCompatibilityEventListeners(
    html: any,
    superActivateListeners: any,
    sheet: any
  ) {
    html
      .find('input[name], textarea[name], select[name]')
      .off('change.compatiblity-event-listeners')
      .on('change.compatiblity-event-listeners', async function () {
        //@ts-expect-error
        if (!this.closest(CONSTANTS.CLASS_SELECTOR_TIDY_USE_CORE_LISTENERS)) {
          await sheet.submit();
        }
      });

    html
      .find(CONSTANTS.CLASS_SELECTOR_TIDY_USE_CORE_LISTENERS)
      .each((_: number, el: HTMLElement) => {
        superActivateListeners.call(sheet, globalThis.$(el));
      });

    html
      .find('input[data-name], textarea[data-name], select[data-name]')
      .off('change.embedded-doc-compatiblity-event-listeners')
      .on(
        'change.embedded-doc-compatiblity-event-listeners',
        async function (event: any) {
          // TODO: is jquery giving me the raw event?
          await _submitEmbeddedDocumentChange(sheet.document, event);
        }
      );
  }
}

/*----------------------------------------------*/
/* Ported from App V2 Svelte Mixin as a stopgap */
/*----------------------------------------------*/
async function _submitEmbeddedDocumentChange(
  foundryDocument: any,
  event: InputEvent & { target: HTMLInputElement }
) {
  const itemId =
    event.target.closest<HTMLElement>('[data-item-id]')?.dataset.itemId;
  if (itemId) {
    await _submitEmbeddedItemChange(foundryDocument, event, itemId);
  }
}

async function _submitEmbeddedItemChange(
  foundryDocument: any,
  event: InputEvent & { target: HTMLInputElement },
  itemId: string
) {
  event.stopImmediatePropagation();

  const item = await getItem(foundryDocument, itemId);
  const field = event.target.getAttribute('data-name')!;

  let valueToSave: string | number = event.target.value;

  // For deltas, parse the resulting delta value
  if (event.target.matches('[inputmode="numeric"]')) {
    valueToSave = processInputChangeDelta(
      event.target.value,
      item,
      field
    )?.toString();
  }

  // For numeric changes, enforce min/max on the value to save
  if (event.target.matches('[inputmode="numeric"], [type="number"]')) {
    const minAttribute = event.target.getAttribute('min');
    const min = !isNil(minAttribute, '') ? Number(minAttribute) : -Infinity;

    const maxAttribute = event.target.getAttribute('max');
    const max = !isNil(maxAttribute, '') ? Number(maxAttribute) : Infinity;

    const valueAsNumber = Number(valueToSave);
    valueToSave = Math.clamp(valueAsNumber, min, max);

    if (item && !Number.isNaN(valueToSave)) {
      event.target.value = valueToSave?.toString();
    }
  }

  // Save the value to the document, whatever that value ultimately became
  item.update({ [field]: valueToSave });
}

async function getItem(foundryDocument: any, id: string) {
  if (foundryDocument.type === 'container')
    return foundryDocument.system.getContainedItem(id);
  return foundryDocument.items.get(id);
}
