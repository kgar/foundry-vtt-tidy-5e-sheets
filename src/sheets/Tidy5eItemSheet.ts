import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type {
  CustomHtmlItemSection,
  CustomTab,
  Item5e,
  ItemDescription,
  ItemSheetContext,
} from 'src/types/item';
import { get, writable } from 'svelte/store';
import TypeNotFoundSheet from './item/TypeNotFoundSheet.svelte';
import type {
  HtmlTabContent,
  SheetStats,
  SheetTabCacheable,
  Tab,
} from 'src/types/types';
import { applyTitleToWindow } from 'src/utils/applications';
import { debug } from 'src/utils/logging';
import type { SvelteComponent } from 'svelte';
import { getPercentage } from 'src/utils/numbers';
import { HandlebarsTemplateContent } from 'src/api/HandlebarsTemplateContent';
import { ItemSheetRuntime } from 'src/runtime/item/ItemSheetRuntime';
import { HandlebarsTab } from 'src/api/tab/HandlebarsTab';
import { HtmlTab } from 'src/api/tab/HtmlTab';

export class Tidy5eKgarItemSheet
  extends dnd5e.applications.item.ItemSheet5e
  implements SheetTabCacheable
{
  context = writable<ItemSheetContext>();
  stats = writable<SheetStats>({
    lastSubmissionTime: null,
  });
  currentTabId: string | undefined = undefined;
  renderKey = writable<string>(foundry.utils.randomID());

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
      ['renderKey', this.renderKey],
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

    this.wireCompatibilityEventListeners(html);
  }

  private wireCompatibilityEventListeners(html: any) {
    let sheet = this;
    html.on('change', 'input[name], textarea[name], select[name]', function () {
      //@ts-expect-error
      if (this.closest(CONSTANTS.CLASS_SELECTOR_TIDY_USE_CORE_LISTENERS)) {
        sheet.submit();
      }
    });

    html
      .find(CONSTANTS.CLASS_SELECTOR_TIDY_USE_CORE_LISTENERS)
      .each((_: number, el: HTMLElement) => {
        super.activateListeners($(el));
      });
  }

  private customContentOnRender(args: { isFullRender: boolean }) {
    const data = get(this.context);

    data.customDetailSections.forEach((s) =>
      s.options.onRender?.({
        app: this,
        data: data,
        element: this.element.get(0),
        isFullRender: args.isFullRender,
      })
    );

    data.customTabs.forEach((s) => {
      if (!s.onRender) {
        return;
      }

      const tab = this.element
        .get(0)
        .querySelector(`[data-tab-contents-for="${s.tabId}"]`);

      s.onRender({
        app: this,
        data: data,
        element: this.element.get(0),
        tabContentsElement: tab,
        isFullRender: args.isFullRender,
      });
    });
  }

  async getData(options = {}) {
    return await this.getContext();
  }

  async _render(force?: boolean, options = {}) {
    this.renderKey.set(foundry.utils.randomID());
    this.context.set(await this.getData());

    if (force) {
      this.component?.$destroy();
      await super._render(force, options);
      this.customContentOnRender({ isFullRender: true });
      return;
    }

    applyTitleToWindow(this.title, this.element.get(0));
    this.customContentOnRender({ isFullRender: false });
  }

  private async getContext(): Promise<ItemSheetContext> {
    const defaultCharacterContext = await super.getData(this.options);

    const itemDescriptions: ItemDescription[] = [
      {
        content: defaultCharacterContext.enriched.description,
        field: 'system.description.value',
        label: FoundryAdapter.localize('DND5E.Description'),
      },
      {
        content: defaultCharacterContext.enriched.unidentified,
        field: 'system.description.unidentified',
        label: FoundryAdapter.localize('DND5E.DescriptionUnidentified'),
      },
      {
        content: defaultCharacterContext.enriched.chat,
        field: 'system.description.chat',
        label: FoundryAdapter.localize('DND5E.DescriptionChat'),
      },
    ];

    const registeredCustomItemSectionOptions =
      ItemSheetRuntime.getCustomItemDetailSections(defaultCharacterContext);

    registeredCustomItemSectionOptions.forEach((s) =>
      s.onPrepareData?.(defaultCharacterContext)
    );

    const customItemDetailSections: CustomHtmlItemSection[] = [];

    for (let option of registeredCustomItemSectionOptions) {
      let content = '';
      // TODO: Create an InjectableContent utility function that can handle this common pattern.
      if (option.content instanceof HandlebarsTemplateContent) {
        content = await option.content.render(defaultCharacterContext);
      } else if (typeof option.content === 'string') {
        content = option.content;
      }

      let sectionTitle: string | undefined = undefined;
      if (option.sectionTitle instanceof HandlebarsTemplateContent) {
        sectionTitle = await option.sectionTitle.render(
          defaultCharacterContext
        );
      } else if (typeof option.sectionTitle === 'string') {
        sectionTitle = option.sectionTitle;
      }

      customItemDetailSections.push({
        contentHtml: content,
        sectionTitleHtml: sectionTitle,
        options: option,
      });
    }

    const eligibleCustomTabs = ItemSheetRuntime.getCustomItemTabs(
      defaultCharacterContext
    );

    const customTabs: CustomTab[] = [];

    // TODO: Pull back to a custom/runtime util script
    // TODO: Fold all tabs together into actor context variable, to allow for an additional layer of extensibility
    for (let tab of eligibleCustomTabs) {
      if (tab instanceof HandlebarsTab) {
        const handlebarsContent = new HandlebarsTemplateContent({
          path: tab.path,
        });

        const templateData = await (tab.getData?.(defaultCharacterContext) ??
          defaultCharacterContext);

        customTabs.push({
          type: 'html',
          contentHtml: await handlebarsContent.render(templateData),
          tabClasses: [],
          tabContentsClasses: [
            CONSTANTS.CLASS_TIDY_USE_CORE_LISTENERS,
            ...tab.tabContentsClasses,
          ],
          tabId: tab.tabId,
          title: tab.title,
          onRender: tab.onRender,
          renderScheme: tab.renderScheme,
        });
      } else if (tab instanceof HtmlTab) {
        customTabs.push({
          type: 'html',
          contentHtml: tab.html,
          tabClasses: [],
          tabContentsClasses: [
            CONSTANTS.CLASS_TIDY_USE_CORE_LISTENERS,
            ...tab.tabContentsClasses,
          ],
          tabId: tab.tabId,
          title: tab.title,
          onRender: tab.onRender,
          renderScheme: tab.renderScheme,
        });
      }
    }

    // TODO: add `onRender` to `Tab` and eliminate the intermediary customTabs field. Just loop over all known tabs to invoke `onRender`
    const fred = customTabs.map<Tab>((t) => ({
      content: {
        html: t.contentHtml,
        cssClass: t.tabContentsClasses.join(' '),
        type: 'html',
        renderScheme: t.renderScheme,
      } satisfies HtmlTabContent,
      displayName: t.title,
      id: t.tabId,
    }));

    const tabs = ItemSheetRuntime.sheets[this.item.type]?.defaultTabs ?? [];

    tabs.push(...fred);

    const context: ItemSheetContext = {
      ...defaultCharacterContext,
      appId: this.appId,
      activateFoundryJQueryListeners: (node: HTMLElement) => {
        this._activateCoreListeners($(node));
        super.activateListeners($(node));
      },
      customDetailSections: customItemDetailSections,
      customTabs: customTabs,
      toggleAdvancementLock: this.toggleAdvancementLock.bind(this),
      lockItemQuantity: FoundryAdapter.shouldLockItemQuantity(),
      healthPercentage: getPercentage(
        this.item?.system?.hp?.value,
        this.item?.system?.hp?.max
      ),
      itemDescriptions,
      originalContext: defaultCharacterContext,
      tabs: tabs,
    };

    debug(`${this.item?.type ?? 'Unknown Item Type'} context data`, context);

    // TODO: Add hook for preparing Tidy-specific context data

    return context;
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
    this.context.set(await this.getContext());
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
