import { HandlebarsTemplateContent } from 'src/api/HandlebarsTemplateContent';
import type { Tab, HtmlTabContent } from 'src/types/types';
import { isNil } from 'src/utils/data';
import type { RegisteredActorTab } from './types';
import { error } from 'src/utils/logging';

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

  if ('type' in tab.content && tab.content.html === 'svelte') {
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
