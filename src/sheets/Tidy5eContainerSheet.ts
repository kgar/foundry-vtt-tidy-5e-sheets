import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { ContainerSheetContext, ItemDescription } from 'src/types/item';
import type {
  ItemCardStore,
  SheetStats,
  SheetTabCacheable,
  Tab,
} from 'src/types/types';
import { debug } from 'src/utils/logging';
import { get, writable } from 'svelte/store';
import { CustomContentRenderer } from './CustomContentRenderer';
import {
  applySheetAttributesToWindow,
  applyTitleToWindow,
  maintainCustomContentInputFocus,
} from 'src/utils/applications';
import { SettingsProvider } from 'src/settings/settings';
import { ItemSheetRuntime } from 'src/runtime/item/ItemSheetRuntime';
import { TabManager } from 'src/runtime/tab/TabManager';
import { isNil } from 'src/utils/data';
import type { SvelteComponent } from 'svelte';
import ContainerSheet from './item/ContainerSheet.svelte';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';

export class Tidy5eKgarContainerSheet
  extends dnd5e.applications.item.ContainerSheet
  implements SheetTabCacheable
{
  context = writable<ContainerSheetContext>();
  stats = writable<SheetStats>({
    lastSubmissionTime: null,
  });
  currentTabId: string | undefined = undefined;
  card = writable<ItemCardStore>();

  get template() {
    return FoundryAdapter.getTemplate('empty-form-template-for-items.hbs');
  }

  static get defaultOptions() {
    return FoundryAdapter.mergeObject(super.defaultOptions, {
      classes: ['tidy5e-sheet', 'sheet', 'item', 'container'],
    });
  }

  component: SvelteComponent | undefined;
  activateListeners(html: any) {
    const node = html.get(0);

    this.card.set({ sheet: node, item: null, itemCardContentTemplate: null });

    const context = new Map<any, any>([
      ['context', this.context],
      ['stats', this.stats],
      ['card', this.card],
      ['currentTabId', this.currentTabId],
      ['onTabSelected', this.onTabSelected.bind(this)],
    ]);

    this.component = new ContainerSheet({
      target: node,
      context: context,
    });

    initTidy5eContextMenu(this, html);
  }

  async getData(options = {}) {
    const defaultDocumentContext = await super.getData(this.options);

    const itemDescriptions: ItemDescription[] = [];
    itemDescriptions.push({
      content: defaultDocumentContext.enriched.description,
      field: 'system.description.value',
      label: FoundryAdapter.localize('DND5E.Description'),
    });
    if (defaultDocumentContext.isIdentifiable && FoundryAdapter.userIsGm()) {
      itemDescriptions.push({
        content: defaultDocumentContext.enriched.unidentified,
        field: 'system.unidentified.description',
        label: FoundryAdapter.localize('DND5E.DescriptionUnidentified'),
      });
    }
    itemDescriptions.push({
      content: defaultDocumentContext.enriched.chat,
      field: 'system.description.chat',
      label: FoundryAdapter.localize('DND5E.DescriptionChat'),
    });

    const eligibleCustomTabs = ItemSheetRuntime.getCustomItemTabs(
      defaultDocumentContext
    );

    const customTabs: Tab[] = await TabManager.prepareTabsForRender(
      defaultDocumentContext,
      eligibleCustomTabs
    );

    const tabs = ItemSheetRuntime.sheets[this.item.type]?.defaultTabs() ?? [];

    tabs.push(...customTabs);

    const context: ContainerSheetContext = {
      ...defaultDocumentContext,
      appId: this.appId,
      activateFoundryJQueryListeners: (node: HTMLElement) => {
        this._activateCoreListeners($(node));
        super.activateListeners($(node));
      },
      customContent: await ItemSheetRuntime.getContent(defaultDocumentContext),
      itemDescriptions,
      lockItemQuantity: FoundryAdapter.shouldLockItemQuantity(),
      originalContext: defaultDocumentContext,
      tabs: tabs,
      viewableWarnings:
        defaultDocumentContext.warnings?.filter(
          (w: any) => !isNil(w.message?.trim(), '')
        ) ?? [],
    };

    debug(`Container Sheet context data`, context);

    // TODO: Add hook for preparing Tidy-specific context data

    return context;
  }

  async _render(force?: boolean, options = {}) {
    const data = await this.getData();
    this.context.set(data);

    if (force) {
      this.component?.$destroy();
      await super._render(force, options);
      applySheetAttributesToWindow(
        this.item.documentName,
        this.item.type,
        SettingsProvider.settings.colorScheme.get(),
        this.element.get(0)
      );
      await this.renderCustomContent({ data, isFullRender: true });
      Hooks.callAll(
        'tidy5e-sheet.renderItemSheet',
        this,
        this.element.get(0),
        data,
        true
      );
      CustomContentRenderer.wireCompatibilityEventListeners(
        this.element,
        super.activateListeners,
        this
      );
      return;
    }

    maintainCustomContentInputFocus(this, async () => {
      applyTitleToWindow(this.title, this.element.get(0));
      await this.renderCustomContent({ data, isFullRender: false });
      Hooks.callAll(
        'tidy5e-sheet.renderItemSheet',
        this,
        this.element.get(0),
        data,
        false
      );
      CustomContentRenderer.wireCompatibilityEventListeners(
        this.element,
        super.activateListeners,
        this
      );
    });
  }

  private async renderCustomContent(args: {
    data: ContainerSheetContext;
    isFullRender: boolean;
  }) {
    await CustomContentRenderer.render({
      app: this,
      customContent: args.data.customContent,
      data: args.data,
      element: this.element,
      isFullRender: args.isFullRender,
      superActivateListeners: super.activateListeners,
      tabs: args.data.tabs,
    });
  }

  async _onSubmit(...args: any[]) {
    await super._onSubmit(...args);

    // TODO: Figure out why multiple render calls is trashing the prose editor.
    // This setTimeout() is making it so the item prose editors don't go nonresponsive.
    // I think it may have something to do with Save -> Trigger Component Refresh (onSubmit) -> Render -> Trash Prose Editor HTML -> Render again
    setTimeout(() => {
      this.stats.update((stats) => {
        stats.lastSubmissionTime = new Date();
        return stats;
      });
    });
  }

  close(...args: any[]) {
    try {
      this._saveViewState();
    } catch (e) {
      debug(
        `Unable to save view state for ${Tidy5eKgarContainerSheet.name}. Ignoring.`
      );
    } finally {
      this.component?.$destroy();
      return super.close(...args);
    }
  }

  async _onDropSingleItem(...args: any[]) {
    return super._onDropSingleItem(...args);
  }

  _getHeaderButtons() {
    const buttons = super._getHeaderButtons();

    return FoundryAdapter.removeConfigureSettingsButtonWhenLockedForNonGm(
      buttons
    );
  }

  _disableFields(...args: any[]) {
    debug('Ignoring call to disable fields. Delegating to Tidy Sheets...');
  }

  /* -------------------------------------------- */
  /* SheetTabCacheable
  /* -------------------------------------------- */

  onTabSelected(tabId: string) {
    this.currentTabId = tabId;
    const tabs = get(this.context)?.tabs ?? [];
    setTimeout(() => {
      this._handleAutoHeightTabs(tabs);
    });
  }

  private _handleAutoHeightTabs(tabs: Tab[]) {
    const currentTabSettings = tabs.find((t) => t.id === this.currentTabId);
    if (currentTabSettings?.autoHeight) {
      this._saveScrollPositions(this.element);
      this.setPosition({ height: 'auto' });
    }
  }
}
