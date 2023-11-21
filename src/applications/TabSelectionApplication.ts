import type { SvelteComponent } from 'svelte';
import SvelteApplicationBase from './SvelteApplicationBase';
import Test from './Test.svelte';

export default class TabSelectionApplication extends SvelteApplicationBase {
  createComponent(node: HTMLElement): SvelteComponent<any, any, any> {
    return new Test({
      target: node,
      context: new Map<any, any>([['appId', this.appId]]),
    });
  }

  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      height: 750,
      title: 'T5EK.TabSelection.Title',
      width: 750,
      classes: ['tidy5e-kgar', 'tab-selection'],
      submitOnClose: false,
      minimizable: true,
      popOut: true,
      resizable: true,
    };
  }
}
