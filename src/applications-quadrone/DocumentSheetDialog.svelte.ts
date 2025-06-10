import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type { ApplicationConfiguration } from 'src/types/application.types';
import { applyThemeToApplication } from 'src/utils/applications.svelte';

export function DocumentSheetDialog<
  TConstructorArgs extends Partial<ApplicationConfiguration> | undefined,
  TContext extends any = {}
>() {
  return class DocumentSheetDialog extends SvelteApplicationMixin<
    TConstructorArgs,
    TContext
  >(foundry.applications.api.DocumentSheetV2) {
    constructor(options: TConstructorArgs) {
      super(options);
    }

    /* -------------------------------------------- */
    /*  Event Listeners and Handlers                */
    /* -------------------------------------------- */
    _attachFrameListeners() {
      super._attachFrameListeners();

      // Tidy 5e relies on `themed theme-{theme}` to be on every one of its applications.
      applyThemeToApplication(this.element, this.document);
    }
  };
}
