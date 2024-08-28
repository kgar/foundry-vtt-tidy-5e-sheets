import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { CustomContent, Tab } from 'src/types/types';
import { delay } from 'src/utils/asynchrony';
import {
  getCustomContentGroupIdSelector,
  wrapCustomHtmlForRendering,
} from 'src/utils/content';
import { isNil } from 'src/utils/data';
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

    const htmlElement = FoundryAdapter.getElementFromAppV1OrV2(element);
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
      .on('change.compatiblity-event-listeners', function () {
        //@ts-expect-error
        if (!this.closest(CONSTANTS.CLASS_SELECTOR_TIDY_USE_CORE_LISTENERS)) {
          sheet.submit();
        }
      });

    html
      .find(CONSTANTS.CLASS_SELECTOR_TIDY_USE_CORE_LISTENERS)
      .each((_: number, el: HTMLElement) => {
        superActivateListeners.call(sheet, $(el));
      });
  }
}
