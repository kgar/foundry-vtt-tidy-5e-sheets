import { HandlebarsTemplateContent } from 'src/api/HandlebarsTemplateContent';
import { HandlebarsTab } from 'src/api/tab/HandlebarsTab';
import { HtmlTab } from 'src/api/tab/HtmlTab';
import type { CustomTabBase } from 'src/api/tab/TabBase';
import type { HtmlTabContent, Tab } from 'src/types/types';

export class TabManager {
  static async prepareCustomTabsForRender(
    tabs: CustomTabBase[],
    context: any
  ): Promise<Tab[]> {
    const customRenderedTabs: Tab[] = [];

    for (let tab of tabs) {
      if (tab instanceof HandlebarsTab) {
        const handlebarsContent = new HandlebarsTemplateContent({
          path: tab.path,
        });

        const templateData = await (tab.getData?.(context) ?? context);

        customRenderedTabs.push({
          content: {
            html: await handlebarsContent.render(templateData),
            cssClass: tab.tabContentsClasses.join(' '),
            type: 'html',
            renderScheme: tab.renderScheme,
          } satisfies HtmlTabContent,
          displayName: tab.title,
          id: tab.tabId,
          onRender: tab.onRender,
        });
      } else if (tab instanceof HtmlTab) {
        customRenderedTabs.push({
          content: {
            html: tab.html,
            cssClass: tab.tabContentsClasses.join(' '),
            type: 'html',
            renderScheme: tab.renderScheme,
          } satisfies HtmlTabContent,
          displayName: tab.title,
          id: tab.tabId,
          onRender: tab.onRender,
        });
      }
    }

    return customRenderedTabs;
  }
}
