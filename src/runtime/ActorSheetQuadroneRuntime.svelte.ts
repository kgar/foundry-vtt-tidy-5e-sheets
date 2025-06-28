import type {
  ActorSheetQuadroneContext,
  CustomContent,
  Tab,
} from 'src/types/types';
import type { RegisteredContent, RegisteredTab, SheetLayout } from './types';
import { debug, error, warn } from 'src/utils/logging';
import { TabManager } from './tab/TabManager';
import type { ActorTabRegistrationOptions } from 'src/api/api.types';
import { CustomContentManager } from './content/CustomContentManager';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { TidyFlags } from 'src/api';
import { settings } from 'src/settings/settings.svelte';

export class ActorSheetQuadroneRuntime<
  TSheetContext extends ActorSheetQuadroneContext
> {
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
    let tabIds = this._tabs.map((x) => x.id);

    const selectedTabs = TidyFlags.tabConfiguration.get(context.actor)?.selected ?? [];

    if (selectedTabs?.length) {
      tabIds = tabIds
        .filter((t) => selectedTabs?.includes(t))
        .sort((a, b) => selectedTabs.indexOf(a) - selectedTabs.indexOf(b));
    } else {
      let defaultTabs =
        settings.value.tabConfiguration[context.document.documentName]?.[
          context.document.type
        ]?.selected ?? [];

      if (!defaultTabs.length) {
        defaultTabs = this.getDefaultTabIds();
      }

      tabIds = tabIds
        .filter((t) => defaultTabs?.includes(t))
        .sort((a, b) => defaultTabs.indexOf(a) - defaultTabs.indexOf(b));
    }

    let tabsToPrepare = tabIds
      .map((tabId) => this._tabs.find((tab) => tab.id === tabId))
      .filter((t) => !!t);

    let renderableTabs = await TabManager.prepareTabsForRender(
      context,
      tabsToPrepare
    );

    return renderableTabs.filter(
      (t) => !t.condition || t.condition(context.document)
    );
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
