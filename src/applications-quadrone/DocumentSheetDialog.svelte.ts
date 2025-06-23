import { TidyHooks } from 'src/api';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import { ThemeQuadrone } from 'src/theme/theme-quadrone';
import type {
  ApplicationClosingOptions,
  ApplicationConfiguration,
} from 'src/types/application.types';
import { applyThemeToApplication } from 'src/utils/applications.svelte';
import { error } from 'src/utils/logging';

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

    #customHTMLTags: string[] = ['PROSE-MIRROR'];

    _onChangeForm(formConfig: unknown, event: any) {
      super._onChangeForm(formConfig, event);

      if (event.type !== 'change') {
        return;
      }

      if (!this.document) {
        return;
      }

      const { target } = event;
      if (!target) {
        return;
      }

      if (!this.#customHTMLTags.includes(target.tagName)) {
        return;
      }

      const value = target._getValue();
      this.document.update({ [target.name]: value });
    }

    /* -------------------------------------------- */
    /*  Event Listeners and Handlers                */
    /* -------------------------------------------- */

    themeSettingsChangeHookId?: number;

    _attachFrameListeners() {
      super._attachFrameListeners();

      // Tidy 5e relies on `themed theme-{theme}` to be on every one of its applications.
      applyThemeToApplication(this.element, this.document);

      this.themeSettingsChangeHookId =
        TidyHooks.tidy5eSheetsThemeSettingsChangedSubscribe((doc?: any) => {
          const appliesToThisSheet =
            !!doc &&
            (doc.uuid === this.document.uuid ||
              doc.uuid === this.document.parent?.uuid);

          if (appliesToThisSheet) {
            ThemeQuadrone.applyCurrentThemeSettingsToStylesheet({
              doc,
              mergeParentDocumentSettings: true,
            });
          }
        });
    }

    /* -------------------------------------------- */
    /*  Closing                                     */
    /* -------------------------------------------- */

    async close(options: ApplicationClosingOptions = {}) {
      TidyHooks.tidy5eSheetsThemeSettingsChangedUnsubscribe(
        this.themeSettingsChangeHookId
      );

      // Trigger saving of the form if configured and allowed
      const submit =
        !options.bypassSubmitOnClose &&
        this.options.submitOnClose &&
        this.document.isOwner &&
        this.isEditable;

      if (submit) {
        try {
          await this.submit({ preventClose: true, preventRender: true });
        } catch (e) {
          error('An error occurred while submitting changes', false, e);
        }
      }

      await super.close(options);
    }
  };
}
