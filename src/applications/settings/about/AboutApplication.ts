import SvelteFormApplicationBase from 'src/applications/SvelteFormApplicationBase';
import { mount } from 'svelte';
import Info from './About.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export class AboutApplication extends SvelteFormApplicationBase {
  static get defaultOptions() {
    return FoundryAdapter.mergeObject(super.defaultOptions, {
      width: 450,
      height: 'auto',
      sheetConfig: false,
      id: 'tidy-5e-sheets-about-window',
      popOut: true,
    });
  }

  get title() {
    return FoundryAdapter.localize('TIDY5E.Settings.About.dialogTitle');
  }

  createComponent(node: HTMLElement): Record<string, any> {
    return mount(Info, {
      target: node,
    });
  }
}
