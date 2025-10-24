import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type { ThemeSettingsConfigurationOptions } from 'src/theme/theme-quadrone.types';
import type {
  ApplicationClosingOptions,
  ApplicationConfiguration,
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

    static DEFAULT_OPTIONS: Partial<ApplicationConfiguration> = {
      form: {
        submitOnChange: true,
      },
      tag: 'form',
      window: {
        controls: [],
      },
      submitOnClose: true,
    };

    async _onChangeForm(formConfig: unknown, event: any) {
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

      try {
        const isSelfSufficientInput = !event.target.name;
        if (isSelfSufficientInput) {
          return;
        }

        super._onChangeForm(formConfig, event);
      } catch (e: any) {
        Object.values(e.getAllFailures()).forEach((failure: any) =>
          ui.notifications.error(failure.message)
        );
      }
    }

    /* -------------------------------------------- */
    /*  Event Listeners and Handlers                */
    /* -------------------------------------------- */

    themeConfigOptions(): ThemeSettingsConfigurationOptions {
      return {
        doc: this.document,
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
