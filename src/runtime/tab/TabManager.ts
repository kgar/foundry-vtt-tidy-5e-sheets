import { HandlebarsTemplateRenderer } from 'src/runtime/HandlebarsTemplateRenderer';
import { HandlebarsTab } from 'src/api/tab/HandlebarsTab';
import { HtmlTab } from 'src/api/tab/HtmlTab';
import type { RenderedHtml, SvelteTabContent, Tab } from 'src/types/types';
import { debug, error } from 'src/utils/logging';
import { CONSTANTS } from 'src/constants';
import { isNil } from 'src/utils/data';
import type { RegisteredTab, SheetLayout } from '../types';
import type { CustomTabTitle } from 'src/api/tab/CustomTabBase';
import type { SupportedTab } from 'src/api/api.types';
import { SvelteTab } from 'src/api/tab/SvelteTab';

export class TabManager {
  static async prepareTabsForRender(
    context: any,
    registeredTabs: RegisteredTab<any>[]
  ): Promise<Tab[]> {
    let enabledTabs = getOrderedEnabledSheetTabs(context, registeredTabs);

    let tabs: Tab[] = [];

    for (let sheetTab of enabledTabs) {
      try {
        let tab: Tab = {
          id: sheetTab.id,
          title: TabManager.getTabTitle(sheetTab),
          iconClass: sheetTab.iconClass,
          onRender: sheetTab.onRender,
          content: await getTabContent(context, sheetTab),
          autoHeight: sheetTab.autoHeight,
        };

        tabs.push(tab);
      } catch (e) {
        error('Unable to prepare tab for rendering', false, {
          error: e,
          tab: sheetTab,
        });
      }
    }
    return tabs;
  }

  static getTabsAsConfigOptions<TContext>(
    tabs: RegisteredTab<TContext>[]
  ): Record<string, string> {
    return tabs.reduce<Record<string, string>>((prev, curr) => {
      prev[curr.id] = TabManager.getTabTitle(curr);
      return prev;
    }, {});
  }

  static validateTab(tab: SupportedTab) {
    if (isNil(tab.tabId?.trim(), '')) {
      error('A tab ID is required for registered tabs.', true);
      return false;
    }

    // Add any other validation as needed.

    return true;
  }

  static mapToRegisteredTabs(
    tab: SupportedTab,
    layoutPreference?: SheetLayout | SheetLayout[],
    allowedTypes?: string | string[]
  ): RegisteredTab<any>[] {
    layoutPreference ??= [CONSTANTS.SHEET_LAYOUT_ALL];

    if (typeof layoutPreference === 'string') {
      layoutPreference = [layoutPreference];
    }

    let registeredTabs: RegisteredTab<any>[] = [];

    let types: Set<string> | undefined;
    if (!isNil(allowedTypes, '')) {
      types = new Set<string>(
        typeof allowedTypes === 'string' ? [allowedTypes] : allowedTypes
      );
    }

    for (let layout of layoutPreference) {
      if (tab instanceof HandlebarsTab) {
        registeredTabs.push({
          content: new HandlebarsTemplateRenderer({ path: tab.path }),
          id: tab.tabId,
          title: tab.title,
          iconClass: tab.iconClass,
          enabled: tab.enabled,
          layout: layout,
          onRender: tab.onRender,
          renderScheme: tab.renderScheme,
          tabContentsClasses: tab.tabContentsClasses,
          getData: tab.getData,
          types,
        });
      } else if (tab instanceof HtmlTab) {
        registeredTabs.push({
          content: {
            html: tab.html,
            type: 'html',
            renderScheme: tab.renderScheme,
            cssClass: tab.tabContentsClasses.join(' '),
            getData: tab.getData,
          },
          id: tab.tabId,
          title: tab.title,
          iconClass: tab.iconClass,
          enabled: tab.enabled,
          layout: layout,
          onRender: tab.onRender,
          renderScheme: tab.renderScheme,
          tabContentsClasses: tab.tabContentsClasses,
          types,
        });
      } else if (tab instanceof SvelteTab) {
        // An external svelte tab should be instantiated
        if (tab.component) {
          registeredTabs.push({
            content: {
              type: 'svelte',
              component: tab.component,
              cssClass: tab.tabContentsClasses?.join(' ') ?? '',
              getProps: tab.getProps,
              getContext: tab.getContext,
            },
            id: tab.tabId,
            title: tab.title,
            iconClass: tab.iconClass,
            enabled: tab.enabled,
            layout: layout,
            onRender: tab.onRender,
            renderScheme: 'force',
            tabContentsClasses: tab.tabContentsClasses,
            types,
          });
        }
      }
    }

    return registeredTabs;
  }

  static getTabTitle(tab: { title: CustomTabTitle }) {
    try {
      return typeof tab.title === 'function' ? tab.title() : tab.title;
    } catch (e) {
      error('An error occurred while getting the tab title', false, e);
      debug('Tab title error troubleshooting info', { tab });
      return '';
    }
  }
}

function getOrderedEnabledSheetTabs<TContext>(
  context: TContext,
  registeredTabs: RegisteredTab<TContext>[]
) {
  return [...registeredTabs].filter((t) => {
    try {
      return (
        isNil(t.enabled) ||
        (typeof t.enabled === 'function' && t.enabled(context))
      );
    } catch (e) {
      error(
        'An error occurred while determining if a tab should be enabled.',
        false,
        e
      );
      debug('Tab-enabled error troubleshooting info', { tab: t });
      return false;
    }
  });
}

async function getTabContent(
  data: any,
  tab: RegisteredTab<
    SvelteTabContent | RenderedHtml | HandlebarsTemplateRenderer
  >
) {
  if ('type' in tab.content && tab.content.type === 'svelte') {
    return tab.content;
  }

  if ('type' in tab.content && tab.content.type === 'html') {
    let renderData = (await tab.content.getData?.(data)) ?? data;
    let html = tab.content.html;

    return {
      html: typeof html === 'function' ? html(renderData) : html,
      renderScheme: tab.content.renderScheme,
      type: tab.content.type,
      cssClass: tab.content.cssClass,
    } satisfies RenderedHtml;
  }

  if (tab.content instanceof HandlebarsTemplateRenderer) {
    const handlebarsData =
      typeof tab.getData === 'function' ? await tab.getData(data) : data;

    return {
      html: await tab.content.render(handlebarsData),
      renderScheme: tab.renderScheme ?? 'handlebars',
      type: 'html',
      cssClass: tab.tabContentsClasses?.join(' '),
    } satisfies RenderedHtml;
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
  } satisfies RenderedHtml;
}
