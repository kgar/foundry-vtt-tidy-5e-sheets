import { HandlebarsTemplateContent } from 'src/api/HandlebarsTemplateContent';
import type { Tab, HtmlTabContent } from 'src/types/types';
import { isNil } from 'src/utils/data';
import type { RegisteredActorTab, SheetLayout } from './types';
import { error } from 'src/utils/logging';
import { HandlebarsTab, HtmlTab } from 'src/api';

export class ActorSheetRuntimeManager {
  static async prepareTabsForRender(
    context: any,
    registeredTabs: RegisteredActorTab<any>[]
  ): Promise<Tab[]> {
    let enabledTabs = getOrderedEnabledSheetTabs(registeredTabs, context);

    let tabs: Tab[] = [];

    for (let sheetTab of enabledTabs) {
      let tab = {
        id: sheetTab.id,
        title: sheetTab.title,
        onRender: sheetTab.onRender,
        content: await getActorTabContent(context, sheetTab),
      };

      tabs.push(tab);
    }
    return tabs;
  }

  static getTabsAsConfigOptions<TContext>(
    tabs: RegisteredActorTab<TContext>[]
  ): Record<string, string> {
    return tabs.reduce<Record<string, string>>((prev, curr) => {
      prev[curr.id] = curr.title;
      return prev;
    }, {});
  }

  static validateTab(tab: HandlebarsTab | HtmlTab) {
    if (isNil(tab.tabId?.trim(), '')) {
      error('A tab ID is required for actor sheet custom tabs.', true);
      return false;
    }

    // Add any other validation as needed.

    return true;
  }

  static mapCustomTabToRegisteredTab(
    tab: HandlebarsTab | HtmlTab,
    layout?: SheetLayout | SheetLayout[]
  ): RegisteredActorTab<any> | undefined {
    let registeredTab: RegisteredActorTab<any> | undefined;

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
  config: RegisteredActorTab<TContext>[],
  context: TContext
) {
  return [...config].filter(
    (t) =>
      isNil(t.enabled) ||
      (typeof t.enabled === 'function' && t.enabled(context))
  );
}

async function getActorTabContent(data: any, tab: RegisteredActorTab<any>) {
  if ('type' in tab.content && tab.content.type === 'svelte') {
    return tab.content;
  }

  if ('type' in tab.content && tab.content.type === 'html') {
    return tab.content;
  }

  if (tab.content instanceof HandlebarsTemplateContent) {
    return {
      html: await tab.content.render(data),
      renderScheme: tab.renderScheme ?? 'handlebars',
      type: 'html',
      cssClass: tab.tabContentsClasses?.join(' '),
    } satisfies HtmlTabContent;
  }

  error(
    'Unble to get actor tab content. The provided tab information is unable to be rendered.',
    false,
    tab
  );

  return {
    html: '',
    renderScheme: 'force',
    type: 'html',
  } satisfies HtmlTabContent;
}
