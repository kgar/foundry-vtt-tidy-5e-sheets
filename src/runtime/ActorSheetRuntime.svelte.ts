import type { CustomContent, Tab } from 'src/types/types';
import type { RegisteredContent, RegisteredTab, SheetLayout } from './types';
import { debug, error, warn } from 'src/utils/logging';
import { TabManager } from './tab/TabManager';
import type { ActorTabRegistrationOptions } from 'src/api/api.types';
import { CustomContentManager } from './content/CustomContentManager';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export class ActorSheetRuntime<TSheetContext> {
  private _content = $state<RegisteredContent<TSheetContext>[]>([]);
  private _tabs = $state<RegisteredTab<TSheetContext>[]>([]);
  private _defaultTabIds = $state<string[]>([]);

  constructor(
    nativeTabs: RegisteredTab<TSheetContext>[],
    defaultTabIds: string[]
  ) {
    this._tabs = [...nativeTabs];
    this._defaultTabIds = defaultTabIds;
  }

  async getContent(context: TSheetContext): Promise<CustomContent[]> {
    return await CustomContentManager.prepareContentForRender(context, [
      ...this._content,
    ]);
  }

  async getTabs(context: TSheetContext): Promise<Tab[]> {
    return await TabManager.prepareTabsForRender(context, [...this._tabs]);
  }

  getAllRegisteredTabs(): RegisteredTab<TSheetContext>[] {
    return [...this._tabs];
  }

  getDefaultTabIds(): string[] {
    return [...this._defaultTabIds];
  }

  registerContent(registeredContent: RegisteredContent<TSheetContext>) {
    this._content.push(registeredContent);
  }

  registerTab(
    tab: RegisteredTab<TSheetContext>,
    options?: ActorTabRegistrationOptions
  ) {
    const tabExists = this._tabs.some(
      (existingTab) => existingTab.id === tab.id
    );

    if (tabExists && !options?.overrideExisting) {
      warn(`Tab with id ${tab.id} already exists.`);
      return;
    }

    if (tabExists && options?.overrideExisting) {
      const index = this._tabs.findIndex((t) => t.id === tab.id);
      if (index >= 0) {
        this._tabs.splice(index, 1);
      }
    }

    this._tabs.push(tab);
  }

  getTabTitle(tabId: string) {
    try {
      let tabTitle = this._tabs.find((t) => t.id === tabId)?.title;
      if (typeof tabTitle === 'function') {
        tabTitle = tabTitle();
      }
      return tabTitle ? FoundryAdapter.localize(tabTitle) : tabId;
    } catch (e) {
      error('An error occurred while searching for a tab title.', false, e);
      debug('Tab title error troubleshooting information', { tabId });
    }
  }
}
