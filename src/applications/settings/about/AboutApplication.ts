import { mount } from 'svelte';
import About from './About.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { ApplicationConfiguration } from 'src/types/application.types';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import { CONSTANTS } from 'src/constants';
import { applyThemeToApplication } from 'src/utils/applications.svelte';

export class AboutApplication extends SvelteApplicationMixin<
  Partial<ApplicationConfiguration> | undefined,
  {}
>(foundry.applications.api.ApplicationV2) {
  static DEFAULT_OPTIONS = {
    classes: [CONSTANTS.MODULE_ID, CONSTANTS.SHEET_LAYOUT_QUADRONE],
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
    return mount(About, {
      target: node,
    });
  }

  // Not going to refactor this because this application is living on borrowed time
  _attachFrameListeners() {
    super._attachFrameListeners();

    applyThemeToApplication(this.element);
  }
}
