import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { SvelteComponent } from 'svelte';
import SettingsSheet from './SettingsSheet.svelte';

declare var Application: any;

export class Tidy5eKgarSettingsSheet extends Application {
  constructor(...args: any[]) {
    super(...args);
  }

  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      height: 750,
      title: FoundryAdapter.localize('T5EK.Settings.SheetMenu.title'),
      width: 750,
      classes: ['tidy5e-kgar', 'settings'],
      submitOnClose: false,
      minimizable: true,
      popOut: true,
      resizable: true,
    };
  }

  get template() {
    return FoundryAdapter.getTemplate('empty-div-template.hbs');
  }

  component: SvelteComponent | undefined;
  activateListeners(html: any) {
    const node = html.get(0);

    this.component = new SettingsSheet({
      target: node,
    });
  }

  close(options: unknown = {}) {
    this.component?.$destroy();
    return super.close(options);
  }

  async render(force: boolean, ...args: any[]) {
    if (force) {
      this.component?.$destroy();
      super.render(force, ...args);
      return;
    }

    // TODO: If there's context to refresh, do it here
  }
}
