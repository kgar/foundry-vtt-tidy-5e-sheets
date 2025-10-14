import type { Tidy5eSheetsApi } from 'src/api/Tidy5eSheetsApi';
import type { ModuleIntegrationBase } from '../integration-classes';
import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
import type { TidyExtensibleDocumentSheetMixinInstance } from 'src/mixins/TidyDocumentSheetMixin.svelte';
import type { SvelteApplicationMixinInstance } from 'src/mixins/SvelteApplicationMixin.svelte';

declare var PopoutModule: any;

type PopOutIntegrationData = {
  stylesheet: CSSStyleSheet;
  abortController: AbortController;
};

export class PopoutModuleIntegration implements ModuleIntegrationBase {
  poppedOut: Map<unknown, PopOutIntegrationData> = new Map();

  get moduleId(): string {
    return 'popout';
  }

  init(api: Tidy5eSheetsApi): void {
    Hooks.on(
      'PopOut:loaded',
      (
        app:
          | TidyExtensibleDocumentSheetMixinInstance
          | SvelteApplicationMixinInstance,
        node: HTMLHtmlElement
      ) => {
        if (api.isTidy5eSheet(app)) {
          const popoutDocument = node.ownerDocument;
          const popoutWindow = popoutDocument.defaultView;
          if (!popoutWindow) return;

          const abortController = new AbortController();

          const stylesheet = this.subscribeToThemeChanges(
            popoutWindow,
            app,
            popoutDocument
          );

          this.shimSheetLockToggle(app, node, abortController);

          this.poppedOut.set(app, { stylesheet, abortController });
        }
      }
    );

    const unsubscribe = (app: unknown) => {
      const data = this.poppedOut.get(app);
      if (data) {
        this.poppedOut.delete(app);
        ThemeQuadrone.unsubscribeStylesheet(data.stylesheet);
        data.abortController.abort();
      }
    };

    Hooks.on('PopOut:popin', unsubscribe);
    Hooks.on('PopOut:close', unsubscribe);
  }

  private subscribeToThemeChanges(
    popoutWindow: Window & typeof globalThis,
    app: unknown,
    popoutDocument: Document
  ) {
    const copiedStylesheet = new popoutWindow.CSSStyleSheet();

    ThemeQuadrone.subscribeStylesheet(copiedStylesheet);

    popoutDocument.adoptedStyleSheets.push(copiedStylesheet);

    return copiedStylesheet;
  }

  private shimSheetLockToggle(
    app:
      | TidyExtensibleDocumentSheetMixinInstance
      | SvelteApplicationMixinInstance,
    node: HTMLHtmlElement,
    controller: AbortController
  ) {
    if ('toggleSheetMode' in app) {
      node
        .querySelector('.window-header .header-sheet-edit-mode-toggle input')
        ?.addEventListener(
          'change',
          () => {
            app.toggleSheetMode();
          },
          { signal: controller.signal }
        );
    }
  }
}
