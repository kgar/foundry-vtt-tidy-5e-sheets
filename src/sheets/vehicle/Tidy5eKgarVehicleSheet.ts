import { CONSTANTS } from 'src/constants';
import { SettingsProvider } from 'src/settings/settings';
import type { SheetStats } from 'src/types/types';
import { isNil } from 'src/utils/data';
import { writable } from 'svelte/store';

export class Tidy5eKgarVehicleSheet {
  stats = writable<SheetStats>({
    lastSubmissionTime: null,
  });
  selectedTabId: string | undefined = undefined;
  
  // TODO: Make it happen!
  // _getHeaderButtons() {
  //     const buttons = super._getHeaderButtons();
  //     buttons.unshift({
  //       class: 'configure-tidy5e',
  //       icon: 'far fa-newspaper',
  //       label: 'Tidy5e',
  //       onclick: () => {
  //         return new Tidy5eKgarUserSettings({}, undefined).render(true);
  //       },
  //     });
  //     return FoundryAdapter.removeConfigureSettingsButtonWhenLockedForNonGm(
  //       buttons
  //     );
  //   }

  // async activateListeners(html: { get: (index: 0) => HTMLElement }) {
  //   const node = html.get(0);
  //   const initialContext = await this.getContext();
  //   this.store.set(initialContext);

  //   new Tidy5eCharacterSheetContent({
  //     target: node,
  //     props: {
  //       selectedTabId: this.#getSelectedTabId(),
  //     },
  //     context: new Map<any, any>([
  //       ['store', this.store],
  //       ['stats', this.stats],
  //     ]),
  //   });

  //   initTidy5eContextMenu.call(this, html);
  // }

  // private async getContext(): Promise<VehicleSheetContext> {
  //   return {
  //     ...(await super.getData(this.options)),
  //     appId: this.appId,
  //     activateFoundryJQueryListeners: (node: HTMLElement) => {
  //       this._activateCoreListeners($(node));
  //       super.activateListeners($(node));
  //     },
  //   };
  // }

  // #getSelectedTabId(): string {
  //   if (
  //     !game.modules.get('character-actions-list-5e')?.active &&
  //     SettingsProvider.settings.defaultActionsTab.get() === 'actions'
  //   ) {
  //     return 'attributes';
  //   }

  //   return (
  //     this.selectedTabId ??
  //     (SettingsProvider.settings.defaultActionsTab.get() !== 'default'
  //       ? SettingsProvider.settings.defaultActionsTab.get()
  //       : 'attributes')
  //   );
  // }

  // #cacheSelectedTabId() {
  //   const selectedTabId = this.element
  //     ?.get(0)
  //     ?.querySelector(`.${CONSTANTS.TAB_OPTION_CLASS}.active`)?.dataset?.tabId;

  //   if (!isNil(selectedTabId, '')) {
  //     this.selectedTabId = selectedTabId;
  //   }
  // }
}
