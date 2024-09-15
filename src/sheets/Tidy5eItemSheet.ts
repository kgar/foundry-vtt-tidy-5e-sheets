import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type {
  Item5e,
  ItemDescription,
  ItemSheetContext,
  UsesRecoveryData,
} from 'src/types/item.types';
import { get, writable } from 'svelte/store';
import TypeNotFoundSheet from './item/TypeNotFoundSheet.svelte';
import type { SheetStats, SheetTabCacheable, Tab } from 'src/types/types';
import {
  applySheetAttributesToWindow,
  applyThemeDataAttributeToWindow,
  applyTitleToWindow,
  maintainCustomContentInputFocus,
} from 'src/utils/applications';
import { debug, error } from 'src/utils/logging';
import type { SvelteComponent } from 'svelte';
import { getPercentage } from 'src/utils/numbers';
import { isNil } from 'src/utils/data';
import { ItemSheetRuntime } from 'src/runtime/item/ItemSheetRuntime';
import { TabManager } from 'src/runtime/tab/TabManager';
import { CustomContentRenderer } from './CustomContentRenderer';
import { SettingsProvider, settingStore } from 'src/settings/settings';
import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import { AsyncMutex } from 'src/utils/mutex';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { StoreSubscriptionsService } from 'src/features/store/StoreSubscriptionsService';
import { CONSTANTS } from 'src/constants';

export class Tidy5eKgarItemSheet
  extends dnd5e.applications.item.ItemSheet5e
  implements SheetTabCacheable
{
  context = writable<ItemSheetContext>();
  stats = writable<SheetStats>({
    lastSubmissionTime: null,
  });
  currentTabId: string | undefined = undefined;
  subscriptionsService: StoreSubscriptionsService;

  constructor(item: Item5e, ...args: any[]) {
    super(item, ...args);

    this.subscriptionsService = new StoreSubscriptionsService();
  }

  get template() {
    return FoundryAdapter.getTemplate('empty-form-template-for-items.hbs');
  }

  static get defaultOptions() {
    return FoundryAdapter.mergeObject(super.defaultOptions, {
      classes: [
        CONSTANTS.MODULE_ID,
        'sheet',
        'item',
        CONSTANTS.SHEET_LAYOUT_CLASSIC,
        'app-v1',
      ],
    });
  }

  component: SvelteComponent | undefined;
  activateListeners(html: any) {
    let first = true;
    this.subscriptionsService.unsubscribeAll();
    this.subscriptionsService.registerSubscriptions(
      settingStore.subscribe((s) => {
        if (first) return;
        applyThemeDataAttributeToWindow(s.colorScheme, this.element.get(0));
        this.render();
      })
    );
    first = false;

    const node = html.get(0);

    const context = new Map<any, any>([
      [CONSTANTS.SVELTE_CONTEXT.APP_ID, this.appId],
      [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this.context],
      [CONSTANTS.SVELTE_CONTEXT.STATS, this.stats],
      [CONSTANTS.SVELTE_CONTEXT.CURRENT_TAB_ID, this.currentTabId],
      [CONSTANTS.SVELTE_CONTEXT.ON_TAB_SELECTED, this.onTabSelected.bind(this)],
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

    TidyHooks.dnd5eGetItemAdvancementContext(html, contextOptions);

    if (contextOptions)
      FoundryAdapter.createContextMenu(
        html,
        '.advancement-item',
        contextOptions
      );
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

    const context: ItemSheetContext = {
      ...defaultDocumentContext,
      appId: this.appId,
      activateEditors: (node, options) =>
        FoundryAdapter.activateEditors(node, this, options?.bindSecrets),
      customContent: await ItemSheetRuntime.getContent(defaultDocumentContext),
      customEquipmentTypeGroups:
        ItemSheetRuntime.getCustomEquipmentTypeGroups(),
      itemOverrides: new Set<string>(this._getItemOverrides()),
      healthPercentage: getPercentage(
        this.item?.system?.hp?.value,
        this.item?.system?.hp?.max
      ),
      identifiedName: FoundryAdapter.getIdentifiedName(this.item),
      itemDescriptions,
      lockItemQuantity: FoundryAdapter.shouldLockItemQuantity(),
      originalContext: defaultDocumentContext,
      tabs: tabs,
      toggleAdvancementLock: this.toggleAdvancementLock.bind(this),
      viewableWarnings:
        defaultDocumentContext.warnings?.filter(
          (w: any) => !isNil(w.message?.trim(), '')
        ) ?? [],
      recoveryPeriods: [],
      recoveryTypes: [],
      usesRecovery: [],
    };

    await this.item.system.getSheetData?.(context);

    context.recoveryPeriods = [
      ...Object.entries(CONFIG.DND5E.limitedUsePeriods)
        //@ts-ignore
        .filter(([, { deprecated }]) => !deprecated)
        .map(([value, { label }]) => ({
          value,
          label,
          group: 'DND5E.DurationTime',
        })),
      { value: 'recharge', label: 'DND5E.USES.Recovery.Recharge.Label' },
    ];

    context.recoveryTypes = [
      { value: 'recoverAll', label: 'DND5E.USES.Recovery.Type.RecoverAll' },
      { value: 'loseAll', label: 'DND5E.USES.Recovery.Type.LoseAll' },
      { value: 'formula', label: 'DND5E.USES.Recovery.Type.Formula' },
    ];

    context.usesRecovery = (context.system.uses?.recovery ?? []).map(
      (data: UsesRecoveryData) => ({
        data,
        formulaOptions:
          data.period === 'recharge' ? data.recharge?.options : null,
      })
    );

    if (context.system.activities) {
      context.activities = (context.system.activities ?? [])
        .map(({ _id: id, name, img, sort }: any) => ({
          id,
          name,
          sort,
          img: { src: img, svg: img?.endsWith('.svg') },
        }))
        .sort((a: any, b: any) => a.sort - b.sort);
    }

    debug(`${this.item?.type ?? 'Unknown Item Type'} context data`, context);

    // TODO: Add hook for preparing Tidy-specific context data

    return context;
  }

  /**
   * A boolean which gates double-rendering and prevents a second
   * colliding render from triggering an infamous
   * "One of original or other are not Objects!" error.
   */
  private tidyRendering = false;

  render(...args: unknown[]) {
    debug('Sheet render begin');
    this.tidyRendering = true;
    super.render(...args);
  }

  private _renderMutex = new AsyncMutex();
  async _render(force?: boolean, options = {}) {
    await this._renderMutex.lock(async () => {
      const doubleRenderDetected =
        this.options.token && this.tidyRendering === false;

      if (doubleRenderDetected) {
        return;
      }

      await this._renderSheet(force, options);
    });
    this.tidyRendering = false;
    debug('Sheet render end');
  }

  private async _renderSheet(force?: boolean, options = {}) {
    const data = await this.getData();
    this.context.set(data);

    if (force) {
      const width = SheetPreferencesService.getByType(this.item.type)?.width;

      this.position = {
        ...this.position,
        width: width ?? this.position.width,
      };

      this.component?.$destroy();
      await super._render(force, options);
      applySheetAttributesToWindow(
        this.item.documentName,
        this.item.uuid,
        this.item.type,
        SettingsProvider.settings.colorScheme.get(),
        this.element.get(0)
      );
      await this.renderCustomContent({ data, isFullRender: true });
      TidyHooks.tidy5eSheetsRenderItemSheet(
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

    await maintainCustomContentInputFocus(this, async () => {
      applyTitleToWindow(this.title, this.element.get(0));
      await this.renderCustomContent({ data, isFullRender: false });
      TidyHooks.tidy5eSheetsRenderItemSheet(
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
    data: ItemSheetContext;
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
        `Unable to save view state for ${Tidy5eKgarItemSheet.name}. Ignoring.`
      );
    } finally {
      this.component?.$destroy();
      this.subscriptionsService.unsubscribeAll();
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

  _disableFields(...args: any[]) {
    debug('Ignoring call to disable fields. Delegating to Tidy Sheets...');
  }

  _onResize(event: any) {
    super._onResize(event);
    const { width } = this.position;
    SheetPreferencesService.setDocumentTypePreference(
      this.item.type,
      'width',
      width
    );
  }

  /* -------------------------------------------- */
  /* Actions
  /* -------------------------------------------- */

  addActivity() {
    return dnd5e.documents.activity.UtilityActivity.createDialog(
      {},
      {
        parent: this.item,
        types: Object.keys(CONFIG.DND5E.activityTypes),
      }
    );
  }

  /**
   * Create a new recovery profile.
   */
  addRecovery(): Promise<any> {
    return this.submit({
      updateData: {
        'system.uses.recovery': [
          ...this.item.system.toObject().uses.recovery,
          {},
        ],
      },
    });
  }

  deleteRecovery(index: number) {
    const recovery = this.item.system.toObject().uses.recovery;
    recovery.splice(index, 1);
    return this.submit({ updateData: { 'system.uses.recovery': recovery } });
  }

  // TODO: Make prop of type `keyof WhateverWeCallTheREcoveryType`
  updateRecovery(index: number, prop: string, value: keyof UsesRecoveryData) {
    const recovery = this.item.system.toObject().uses.recovery;
    recovery[index][prop] = value;
    return this.submit({ updateData: { 'system.uses.recovery': recovery } });
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
