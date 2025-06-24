import type { Unsubscribable } from 'src/foundry/TidyHooks.types';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
import type {
  ApplicationClosingOptions,
  DocumentSheetConfiguration,
} from 'src/types/application.types';
import { applyThemeToApplication } from 'src/utils/applications.svelte';
import { error } from 'src/utils/logging';

export function DocumentSheetDialog<
  TConstructorArgs extends Partial<DocumentSheetConfiguration> | undefined,
  TContext extends any = {}
>() {
  return class DocumentSheetDialog extends SvelteApplicationMixin<
    Partial<DocumentSheetConfiguration>,
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

    themeSettingsSubscription?: Unsubscribable;

    private get themeConfigOptions() {
      return {
        doc: this.document,
        mergeParentDocumentSettings: true,
        idOverride: this.id,
      };
    }

    _attachFrameListeners() {
      super._attachFrameListeners();

      // Tidy 5e relies on `themed theme-{theme}` to be on every one of its applications.
      applyThemeToApplication(this.element, this.document);

      ThemeQuadrone.applyCurrentThemeSettingsToStylesheet(
        this.themeConfigOptions
      );

      this.themeSettingsSubscription =
        ThemeQuadrone.subscribeAndReactToThemeSettingsChanges(
          this.themeConfigOptions
        );
    }

    /* -------------------------------------------- */
    /*  Closing                                     */
    /* -------------------------------------------- */

    async close(options: ApplicationClosingOptions = {}) {
      this.themeSettingsSubscription?.unsubscribe();

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
