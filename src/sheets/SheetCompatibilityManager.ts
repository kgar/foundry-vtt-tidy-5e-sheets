import { CONSTANTS } from 'src/constants';
import type { Tab } from 'src/types/types';
import { delay } from 'src/utils/asynchrony';
import { warn } from 'src/utils/logging';

type RenderCustomContentArgs = {
  app: any;
  element: any;
  data: any;
  tabs: Tab[];
  isFullRender: boolean;
  superActivateListeners: any;
};

export class SheetCompatibilityManager {
  static async renderCustomContent(args: RenderCustomContentArgs) {
    const { app, tabs, element, data, isFullRender, superActivateListeners } =
      args;

    const renderPromises = tabs.map(async (s) => {
      let tab = element
        .get(0)
        .querySelector(`[data-tab-contents-for="${s.id}"]`);

      if (!tab) {
        // This content was added during a non-forced render (e.g., tab selection changes); wait a tick and re-attempt to set its HTML
        await delay(0);
        tab = element.get(0).querySelector(`[data-tab-contents-for="${s.id}"]`);
      }

      if (!tab) {
        warn('Unable to find custom tab content container for render');
        return;
      }

      if (
        s.content.type === 'html' &&
        (isFullRender || s.content.renderScheme === 'handlebars')
      ) {
        tab.innerHTML = s.content.html;
      }

      if (s.onRender) {
        s.onRender({
          app: app,
          data: data,
          element: element.get(0),
          tabContentsElement: tab,
          isFullRender: isFullRender,
        });
      }
    });

    await Promise.all(renderPromises);

    SheetCompatibilityManager.wireCompatibilityEventListeners(
      element,
      superActivateListeners,
      app
    );
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
