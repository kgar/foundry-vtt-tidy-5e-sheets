import { HandlebarsTemplateContent } from 'src/api/HandlebarsTemplateContent';
import { HandlebarsTab } from 'src/api/tab/HandlebarsTab';
import { HtmlTab } from 'src/api/tab/HtmlTab';
import type { HtmlTabContent, Tab } from 'src/types/types';
import { error } from 'src/utils/logging';
import { CONSTANTS } from 'src/constants';
import { isNil } from 'src/utils/data';
import type { RegisteredTab, SheetLayout } from '../types';

export class TabManager {
  static async prepareTabsForRender(
    context: any,
    registeredTabs: RegisteredTab<any>[]
  ): Promise<Tab[]> {
    let enabledTabs = getOrderedEnabledSheetTabs(registeredTabs, context);

    let tabs: Tab[] = [];

    for (let sheetTab of enabledTabs) {
      let tab = {
        id: sheetTab.id,
        title: sheetTab.title,
        onRender: sheetTab.onRender,
        content: await getTabContent(context, sheetTab),
      };

      tabs.push(tab);
    }
    return tabs;
  }

  static getTabsAsConfigOptions<TContext>(
    tabs: RegisteredTab<TContext>[]
  ): Record<string, string> {
    return tabs.reduce<Record<string, string>>((prev, curr) => {
      prev[curr.id] = curr.title;
      return prev;
    }, {});
  }

  static validateTab(tab: HandlebarsTab | HtmlTab) {
    if (isNil(tab.tabId?.trim(), '')) {
      error('A tab ID is required for registered tabs.', true);
      return false;
    }

    // Add any other validation as needed.

    return true;
  }

  static mapCustomTabToRegisteredTab(
    tab: HandlebarsTab | HtmlTab,
    layout?: SheetLayout | SheetLayout[]
  ): RegisteredTab<any> | undefined {
    let registeredTab: RegisteredTab<any> | undefined;
    layout ??= CONSTANTS.SHEET_LAYOUT_ALL;

    if (tab instanceof HandlebarsTab) {
      registeredTab = {
        content: new HandlebarsTemplateContent({ path: tab.path }),
        id: tab.tabId,
        title: tab.title,
        enabled: tab.enabled,
        layout: layout,
        onRender: tab.onRender,
        renderScheme: tab.renderScheme,
        tabContentsClasses: tab.tabContentsClasses,
        getData: tab.getData,
      };
    } else if (tab instanceof HtmlTab) {
      registeredTab = {
        content: {
          html: tab.html,
          type: 'html',
          renderScheme: tab.renderScheme,
          cssClass: tab.tabContentsClasses.join(' '),
        },
        id: tab.tabId,
        title: tab.title,
        enabled: tab.enabled,
        layout: layout,
        onRender: tab.onRender,
        renderScheme: tab.renderScheme,
        tabContentsClasses: tab.tabContentsClasses,
      };
    }

    return registeredTab;
  }
}

function getOrderedEnabledSheetTabs<TContext>(
  config: RegisteredTab<TContext>[],
  context: TContext
) {
  return [...config].filter(
    (t) =>
      isNil(t.enabled) ||
      (typeof t.enabled === 'function' && t.enabled(context))
  );
}

async function getTabContent(data: any, tab: RegisteredTab<any>) {
  if ('type' in tab.content && tab.content.type === 'svelte') {
    return tab.content;
  }

  if ('type' in tab.content && tab.content.type === 'html') {
    return tab.content;
  }

  if (tab.content instanceof HandlebarsTemplateContent) {
    const handlebarsData =
      typeof tab.getData === 'function' ? await tab.getData(data) : data;

    return {
      html: await tab.content.render(handlebarsData),
      renderScheme: tab.renderScheme ?? 'handlebars',
      type: 'html',
      cssClass: tab.tabContentsClasses?.join(' '),
    } satisfies HtmlTabContent;
  }

  error(
    'Unble to get tab content. The provided tab information is unable to be rendered.',
    false,
    tab
  );

  return {
    html: '',
    renderScheme: 'force',
    type: 'html',
  } satisfies HtmlTabContent;
}
