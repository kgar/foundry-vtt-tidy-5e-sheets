import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Item5e, ItemSheetContext } from 'src/types/item';
import { get, writable } from 'svelte/store';
import TypeNotFoundSheet from './item/TypeNotFoundSheet.svelte';
import EquipmentSheet from './item/EquipmentSheet.svelte';
import BackpackSheet from './item/BackpackSheet.svelte';
import BackgroundSheet from './item/BackgroundSheet.svelte';
import ClassSheet from './item/ClassSheet.svelte';
import ConsumableSheet from './item/ConsumableSheet.svelte';
import FeatSheet from './item/FeatSheet.svelte';
import LootSheet from './item/LootSheet.svelte';
import SpellSheet from './item/SpellSheet.svelte';
import SubclassSheet from './item/SubclassSheet.svelte';
import ToolSheet from './item/ToolSheet.svelte';
import WeaponSheet from './item/WeaponSheet.svelte';
import type { SheetStats, SheetTabCacheable } from 'src/types/types';
import { applyTitleToWindow } from 'src/utils/applications';
import { debug } from 'src/utils/logging';
import type { SvelteComponent } from 'svelte';
import { getPercentage } from 'src/utils/numbers';

declare var dnd5e: {
  applications: {
    item: {
      ItemSheet5e: any;
    };
  };
};

export class Tidy5eKgarItemSheet
  extends dnd5e.applications.item.ItemSheet5e
  implements SheetTabCacheable
{
  context = writable<ItemSheetContext>();
  stats = writable<SheetStats>({
    lastSubmissionTime: null,
  });
  currentTabId: string | undefined = undefined;
  advancementConfigurationMode = false;

  constructor(item: Item5e, ...args: any[]) {
    super(item, ...args);

    if (this.object.type === 'class') {
      this.options.width = this.position.width = 600;
      this.options.height = this.position.height = 680;
    } else if (this.object.type === 'subclass') {
      this.options.height = this.position.height = 540;
    }
  }

  onTabSelected(tabId: string) {
    this.currentTabId = tabId;
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
    // Legacy jquery / form application change handling; will probably have to fix this further in the future
    html.on('change', 'input[name], textarea[name], select[name]', () => {
      this.submit();
    });

    const node = html.get(0);

    const context = new Map<any, any>([
      ['context', this.context],
      ['stats', this.stats],
      ['currentTabId', this.currentTabId],
      ['onTabSelected', this.onTabSelected.bind(this)],
    ]);

    switch (this.item.type) {
      case CONSTANTS.ITEM_TYPE_EQUIPMENT:
        this.component = new EquipmentSheet({
          target: node,
          context: context,
        });
        break;
      case CONSTANTS.ITEM_TYPE_BACKGROUND:
        this.component = new BackgroundSheet({
          target: node,
          context: context,
        });
        break;
      case CONSTANTS.ITEM_TYPE_BACKPACK:
        this.component = new BackpackSheet({
          target: node,
          context: context,
        });
        break;
      case CONSTANTS.ITEM_TYPE_CLASS:
        this.component = new ClassSheet({
          target: node,
          context: context,
        });
        break;
      case CONSTANTS.ITEM_TYPE_CONSUMABLE:
        this.component = new ConsumableSheet({
          target: node,
          context: context,
        });
        break;
      case CONSTANTS.ITEM_TYPE_FEAT:
        this.component = new FeatSheet({
          target: node,
          context: context,
        });
        break;
      case CONSTANTS.ITEM_TYPE_LOOT:
        this.component = new LootSheet({
          target: node,
          context: context,
        });
        break;
      case CONSTANTS.ITEM_TYPE_SPELL:
        this.component = new SpellSheet({
          target: node,
          context: context,
        });
        break;
      case CONSTANTS.ITEM_TYPE_SUBCLASS:
        this.component = new SubclassSheet({
          target: node,
          context: context,
        });
        break;
      case CONSTANTS.ITEM_TYPE_TOOL:
        this.component = new ToolSheet({
          target: node,
          context: context,
        });
        break;
      case CONSTANTS.ITEM_TYPE_WEAPON:
        this.component = new WeaponSheet({
          target: node,
          context: context,
        });
        break;
      default:
        this.component = new TypeNotFoundSheet({
          target: node,
          context: context,
        });
        break;
    }

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
      new ContextMenu(html, '.advancement-item', contextOptions);
  }

  async getData(options = {}) {
    this.context.set(await this.getContext());
    return get(this.context);
  }

  // TODO: Extract this implementation somewhere. Or at least part of it.
  render(force = false, options = {}) {
    if (force) {
      this.component?.$destroy();
      super.render(force, options);
      return this;
    }

    applyTitleToWindow(this.title, this.element.get(0));
    this.getContext().then((context) => {
      this.context.update(() => context);
    });
    return this;
  }

  private async getContext(): Promise<ItemSheetContext> {
    const context = {
      ...(await super.getData(this.options)),
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
    };

    debug(`${this.item?.type ?? 'Unknown Item Type'} context data`, context);

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
    await this.updateContext();
  }

  _getHeaderButtons() {
    const buttons = super._getHeaderButtons();

    return FoundryAdapter.removeConfigureSettingsButtonWhenLockedForNonGm(
      buttons
    );
  }
}
