import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { unmount } from 'svelte';

export default abstract class SvelteFormApplicationBase extends FormApplication {
  component: Record<string, any> | undefined;
  staticExtraApplicationClasses: string[] = [];

  constructor(...args: any[]) {
    super(...args);
  }

  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      classes: [
        CONSTANTS.MODULE_ID,
        'application-shell',
        'app-v1',
        CONSTANTS.SHEET_LAYOUT_CLASSIC,
      ],
      submitOnClose: false,
      minimizable: true,
      popOut: true,
      resizable: true,
    };
  }

  get template() {
    return FoundryAdapter.getTemplate('empty-form-template.hbs');
  }

  activateListeners(html: any) {
    const node = html.get(0);
    this.refreshContext();
    this.component = this.createComponent(node);
  }

  abstract createComponent(node: HTMLElement): Record<string, any>;

  close(options: unknown = {}) {
    if (this.component) {
      unmount(this.component);
    }
    return super.close(options);
  }

  render(force = false, ...args: any[]) {
    if (force) {
      if (this.component) {
        unmount(this.component);
      }
      super.render(force, ...args);
      return this;
    }

    this.refreshContext();
    return this;
  }

  refreshContext() {
    /* Implement in a subclass if needed */
  }

  async _updateObject() {
    /* Implement in a subclass if needed */
  }
}
