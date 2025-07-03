import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type { ThemeSettingsConfigurationOptions } from 'src/theme/theme-quadrone.types';
import type {
  ApplicationClosingOptions,
  DocumentSheetApplicationConfiguration,
  DocumentSheetConfiguration,
} from 'src/types/application.types';
import { error } from 'src/utils/logging';

export function DocumentSheetDialog<
  TConstructorArgs extends DocumentSheetApplicationConfiguration = DocumentSheetApplicationConfiguration,
  TContext extends any = {}
>() {
  return class DocumentSheetDialog extends SvelteApplicationMixin<
    Partial<DocumentSheetConfiguration> & { document: any },
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

    themeConfigOptions(): ThemeSettingsConfigurationOptions {
      return {
        doc: this.document,
        mergeParentDocumentSettings: true,
        idOverride: this.id,
      };
    }

    _attachFrameListeners() {
      super._attachFrameListeners();
    }

    /* -------------------------------------------- */
    /*  Closing                                     */
    /* -------------------------------------------- */

    async close(options: ApplicationClosingOptions = {}) {
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
