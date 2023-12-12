import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Item5e, ItemDescription, ItemSheetContext } from 'src/types/item';
import { get, writable } from 'svelte/store';
import TypeNotFoundSheet from './item/TypeNotFoundSheet.svelte';
import type { SheetStats, SheetTabCacheable, Tab } from 'src/types/types';
import { applyTitleToWindow } from 'src/utils/applications';
import { debug } from 'src/utils/logging';
import type { SvelteComponent } from 'svelte';
import { getPercentage } from 'src/utils/numbers';
import { isNil } from 'src/utils/data';
import { ItemSheetRuntime } from 'src/runtime/item/ItemSheetRuntime';
import { TabManager } from 'src/runtime/tab/TabManager';
import { SheetCompatibilityManager } from './SheetCompatibilityManager';

export class Tidy5eKgarItemSheet
  extends dnd5e.applications.item.ItemSheet5e
  implements SheetTabCacheable
{
  context = writable<ItemSheetContext>();
  stats = writable<SheetStats>({
    lastSubmissionTime: null,
  });
  currentTabId: string | undefined = undefined;

  constructor(item: Item5e, ...args: any[]) {
    super(item, ...args);

    if (this.object.type === 'class') {
      this.options.width = this.position.width = 600;
      this.options.height = this.position.height = 680;
    } else if (this.object.type === 'subclass') {
      this.options.height = this.position.height = 540;
    }
  }

  get template() {
    return FoundryAdapter.getTemplate('empty-form-template-for-items.hbs');
  }

  static get defaultOptions() {
    return FoundryAdapter.mergeObject(super.defaultOptions, {
      classes: ['tidy5e-kgar', 'sheet', 'item'],
    });
  }

  component: SvelteComponent | undefined;
  activateListeners(html: any) {
    const node = html.get(0);

    const context = new Map<any, any>([
      ['context', this.context],
      ['stats', this.stats],
      ['currentTabId', this.currentTabId],
      ['onTabSelected', this.onTabSelected.bind(this)],
    ]);

    // TODO: Try find sheet from runtime
    const sheetComponent = ItemSheetRuntime.sheets[this.item.type];

    this.component = sheetComponent
      ? new sheetComponent.Sheet({
          target: node,
          context: context,
        })
      : new TypeNotFoundSheet({
          target: node,
          context: context,
        });

    // Advancement context menu
    const contextOptions = this._getAdvancementContextMenuOptions();
    /**
     * A hook event that fires when the context menu for the advancements list is constructed.
     * @function dnd5e.getItemAdvancementContext
     * @memberof hookEvents
     * @param {jQuery} html                      The HTML element to which the context options are attached.
     * @param {ContextMenuEntry[]} entryOptions  The context menu entries.
     */
    FoundryAdapter.hooksCall(
      'dnd5e.getItemAdvancementContext',
      html,
      contextOptions
    );
    if (contextOptions)
      FoundryAdapter.createContextMenu(
        html,
        '.advancement-item',
        contextOptions
      );
  }

  async getData(options = {}) {
    const defaultDocumentContext = await super.getData(this.options);

    const itemDescriptions: ItemDescription[] = [
      {
        content: defaultDocumentContext.enriched.description,
        field: 'system.description.value',
        label: FoundryAdapter.localize('DND5E.Description'),
      },
      {
        content: defaultDocumentContext.enriched.unidentified,
        field: 'system.description.unidentified',
        label: FoundryAdapter.localize('DND5E.DescriptionUnidentified'),
      },
      {
        content: defaultDocumentContext.enriched.chat,
        field: 'system.description.chat',
        label: FoundryAdapter.localize('DND5E.DescriptionChat'),
      },
    ];

    const eligibleCustomTabs = ItemSheetRuntime.getCustomItemTabs(
      defaultDocumentContext
    );

    const customTabs: Tab[] = await TabManager.prepareCustomTabsForRender(
      eligibleCustomTabs,
      defaultDocumentContext
    );

    const tabs = ItemSheetRuntime.sheets[this.item.type]?.defaultTabs() ?? [];

    tabs.push(...customTabs);

    const context: ItemSheetContext = {
      ...defaultDocumentContext,
      appId: this.appId,
      activateFoundryJQueryListeners: (node: HTMLElement) => {
        this._activateCoreListeners($(node));
        super.activateListeners($(node));
      },
      toggleAdvancementLock: this.toggleAdvancementLock.bind(this),
      lockItemQuantity: FoundryAdapter.shouldLockItemQuantity(),
      healthPercentage: getPercentage(
        this.item?.system?.hp?.value,
        this.item?.system?.hp?.max
      ),
      itemDescriptions,
      originalContext: defaultDocumentContext,
      tabs: tabs,
      viewableWarnings:
        defaultDocumentContext.warnings?.filter(
          (w: any) => !isNil(w.message?.trim(), '')
        ) ?? [],
    };

    debug(`${this.item?.type ?? 'Unknown Item Type'} context data`, context);

    // TODO: Add hook for preparing Tidy-specific context data

    return context;
  }

  async _render(force?: boolean, options = {}) {
    this.context.set(await this.getData());

    if (force) {
      this.component?.$destroy();
      await super._render(force, options);
      await this.renderCustomContent({ isFullRender: true });
      return;
    }

    applyTitleToWindow(this.title, this.element.get(0));
    await this.renderCustomContent({ isFullRender: false });
  }

  private async renderCustomContent(args: { isFullRender: boolean }) {
    const data = get(this.context);

    await SheetCompatibilityManager.renderCustomContent({
      app: this,
      data: data,
      element: this.element,
      isFullRender: args.isFullRender,
      superActivateListeners: super.activateListeners,
      tabs: data.tabs,
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
        `Unable to save view state for ${Tidy5eKgarItemSheet.name}. Ignoring.`
      );
    } finally {
      this.component?.$destroy();
      return super.close(...args);
    }
  }

  async _onDropSingleItem(...args: any[]) {
    return super._onDropSingleItem(...args);
  }

  async toggleAdvancementLock() {
    this.advancementConfigurationMode = !this.advancementConfigurationMode;
    this.context.set(await this.getData());
  }

  _getHeaderButtons() {
    const buttons = super._getHeaderButtons();

    return FoundryAdapter.removeConfigureSettingsButtonWhenLockedForNonGm(
      buttons
    );
  }

  /* -------------------------------------------- */
  /* SheetTabCacheable
  /* -------------------------------------------- */

  onTabSelected(tabId: string) {
    this.currentTabId = tabId;
  }
}
