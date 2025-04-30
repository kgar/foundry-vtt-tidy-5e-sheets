import { mount } from 'svelte';
import Info from './About.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { ApplicationConfiguration } from 'src/types/application.types';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import { CONSTANTS } from 'src/constants';

export class AboutApplication extends SvelteApplicationMixin<
  Partial<ApplicationConfiguration> | undefined,
  {}
>(foundry.applications.api.ApplicationV2) {
  static DEFAULT_OPTIONS = {
    classes: [
      CONSTANTS.MODULE_ID,
      'app-v2',
      'application',
      CONSTANTS.SHEET_LAYOUT_QUADRONE,
    ],
    id: 'tidy-5e-sheets-about-window',
    position: {
      width: 450,
      height: 'auto',
    },
  };

  get title() {
    return FoundryAdapter.localize('TIDY5E.Settings.About.dialogTitle');
  }

  _createComponent(node: HTMLElement): Record<string, any> {
    return mount(Info, {
      target: node,
    });
  }
}
