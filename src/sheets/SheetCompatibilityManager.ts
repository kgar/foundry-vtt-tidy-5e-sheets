import { CONSTANTS } from 'src/constants';
import type { CustomContent, Tab } from 'src/types/types';
import { delay } from 'src/utils/asynchrony';
import { wrapCustomHtmlForRendering } from 'src/utils/content';
import { debug, error, warn } from 'src/utils/logging';

type RenderCustomContentArgs = {
  app: any;
  element: any; // jQuery
  data: any;
  tabs: Tab[];
  isFullRender: boolean;
  superActivateListeners: any;
  customContent: CustomContent[];
};

export class SheetCompatibilityManager {
  static async renderCustomContent(args: RenderCustomContentArgs) {
    const {
      app,
      tabs,
      element,
      data,
      isFullRender,
      superActivateListeners,
      customContent,
    } = args;

    element
      .get(0)
      .querySelectorAll(CONSTANTS.HTML_DYNAMIC_RENDERING_ATTRIBUTE_SELECTOR)
      .forEach((el: HTMLElement) => el.remove());

    await SheetCompatibilityManager.renderTabs(
      tabs,
      element,
      isFullRender,
      app,
      data,
      args
    );

    const sheetEl = element.get(0);
    for (let c of customContent) {
      sheetEl.querySelectorAll(c.selector).forEach((el: HTMLElement) => {
        const contentWrapperId = foundry.utils.randomID();

        const wrappedContent = wrapCustomHtmlForRendering(
          c.content.html,
          contentWrapperId,
          c.content.renderScheme
        );

        // TODO: `onContentReady here`

        el.insertAdjacentHTML(c.position as InsertPosition, wrappedContent);

        if (c.onRender) {
          c.onRender({
            app: app,
            data: data,
            element: element.get(0),
            isFullRender: isFullRender,
          });
        }
      });
    }

    SheetCompatibilityManager.wireCompatibilityEventListeners(
      element,
      superActivateListeners,
      app
    );
  }

  private static renderTabs(
    tabs: Tab[],
    element: any,
    isFullRender: boolean,
    app: any,
    data: any,
    args: RenderCustomContentArgs
  ): Promise<unknown> {
    const promises = tabs.map(async (tab) => {
      try {
        let tabEl = element
          .get(0)
          .querySelector(`[data-tab-contents-for="${tab.id}"]`);

        if (!tabEl) {
          // This content was added during a non-forced render (e.g., tab selection changes); wait a tick and re-attempt to set its HTML
          await delay(0);
          tabEl = element
            .get(0)
            .querySelector(`[data-tab-contents-for="${tab.id}"]`);
        }

        if (!tabEl) {
          warn('Unable to find custom tab content container for render');
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
            element: element.get(0),
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
