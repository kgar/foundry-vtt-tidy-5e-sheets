import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { SvelteComponent } from 'svelte';

export default abstract class SvelteApplicationBase extends Application {
  component: SvelteComponent | undefined;

  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      classes: ['tidy5e-kgar'],
      submitOnClose: false,
      minimizable: true,
      popOut: true,
      resizable: true,
    };
  }

  get template() {
    return FoundryAdapter.getTemplate('empty-div-template.hbs');
  }

  activateListeners(html: any) {
    const node = html.get(0);
    this.component = this.createComponent(node);
  }

  abstract createComponent(node: HTMLElement): SvelteComponent;

  close(options: unknown = {}) {
    this.component?.$destroy();
    return super.close(options);
  }

  render(force = false, ...args: any[]) {
    if (force) {
      this.component?.$destroy();
      super.render(force, ...args);
      return this;
    }

    return this;
  }
}
