import type {
  ActorSheetQuadroneContext,
  CustomContent,
  Tab,
} from 'src/types/types';
import type { RegisteredContent, RegisteredTab } from './types';
import { debug, error, warn } from 'src/utils/logging';
import { TabManager } from './tab/TabManager';
import type { ActorTabRegistrationOptions } from 'src/api/api.types';
import { CustomContentManager } from './content/CustomContentManager';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { settings } from 'src/settings/settings.svelte';
import type { SheetTabConfiguration } from 'src/settings/settings.types';
import { VisibilityLevels } from 'src/features/visibility-levels/VisibilityLevels';
import { CONSTANTS } from 'src/constants';

type GetTabConfigFn = (actor: any) => SheetTabConfiguration | null | undefined;

export class ActorSheetQuadroneRuntime<
  TSheetContext extends ActorSheetQuadroneContext
> {
  private _content = $state<RegisteredContent<TSheetContext>[]>([]);
  private _tabs = $state<RegisteredTab<TSheetContext>[]>([]);
  private _defaultTabIds = $state<string[]>([]);

  private _getTabConfig: GetTabConfigFn;
  private _docTypeKeyOverride?: string;

  constructor(
    nativeTabs: RegisteredTab<TSheetContext>[],
    defaultTabIds: string[],
    overrides?: {
      getTabConfig?: GetTabConfigFn;
      docTypeKeyOverride?: string;
    }
  ) {
    this._tabs = [...nativeTabs];

    this._defaultTabIds = defaultTabIds;

    this._getTabConfig =
      overrides?.getTabConfig ?? TidyFlags.tabConfiguration.get;

    this._docTypeKeyOverride = overrides?.docTypeKeyOverride;
  }

  async getContent(context: TSheetContext): Promise<CustomContent[]> {
    return await CustomContentManager.prepareContentForRender(context, [
      ...this._content,
    ]);
  }

  async getTabs(context: TSheetContext): Promise<Tab[]> {
    let tabIds = this._getVisibleTabIds(context);

    const selectedTabs = this._getTabConfig(context.actor)?.selected ?? [];

    if (selectedTabs?.length) {
      tabIds = tabIds
        .filter((t) => selectedTabs?.includes(t))
        .sort((a, b) => selectedTabs.indexOf(a) - selectedTabs.indexOf(b));
    } else {
      let defaultTabs =
        settings.value.tabConfiguration[context.document.documentName]?.[
          this._docTypeKeyOverride ?? context.document.type
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

  _getVisibleTabIds(context: TSheetContext) {
    const tabIds = Iterator.from(this._tabs).map((t) => t.id);

    if (FoundryAdapter.userIsGm()) {
      return [...tabIds];
    }

    const worldTabConfig =
      settings.value.tabConfiguration[context.document.documentName]?.[
        this._docTypeKeyOverride ?? context.document.type
      ]?.visibilityLevels ?? {};

    const sheetTabConfig =
      this._getTabConfig(context.document)?.visibilityLevels ?? {};

    const documentOwnershipLevel = context.document.getUserLevel(game.user);

    const defaultVisibilityLevel = VisibilityLevels.getDefaultLevelValue(
      CONSTANTS.DOCUMENT_NAME_ACTOR
    );

    return [
      ...tabIds.filter((tabId) => {
        const minOwnershipLevel = Math.max(
          worldTabConfig[tabId] ?? defaultVisibilityLevel,
          sheetTabConfig[tabId] ?? defaultVisibilityLevel
        );
        return documentOwnershipLevel >= minOwnershipLevel;
      }),
    ];
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

    const includeAsDefault = options?.includeAsDefaultTab ?? true;
    if (includeAsDefault && !this._defaultTabIds.includes(tab.id)) {
      this._defaultTabIds.push(tab.id);
    }
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
