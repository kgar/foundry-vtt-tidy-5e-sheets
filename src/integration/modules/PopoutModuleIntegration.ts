import type { Tidy5eSheetsApi } from 'src/api/Tidy5eSheetsApi';
import type { ModuleIntegrationBase } from '../integration-classes';
import type { ContextMenuPositionInfo } from 'src/context-menu/context-menu.types';
import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';

declare var PopoutModule: any;

export class PopoutModuleIntegration implements ModuleIntegrationBase {
  poppedOut: Map<unknown, CSSStyleSheet> = new Map();

  get moduleId(): string {
    return 'popout';
  }

  init(api: Tidy5eSheetsApi): void {
    Hooks.on('PopOut:loaded', (app: unknown, node: HTMLHtmlElement) => {
      if (api.isTidy5eSheet(app)) {
        const popoutDocument = node.ownerDocument;
        const popoutWindow = popoutDocument.defaultView;
        if (!popoutWindow) return;

        const copiedStylesheet = new popoutWindow.CSSStyleSheet();

        this.poppedOut.set(app, copiedStylesheet);
        ThemeQuadrone.subscribeStylesheet(copiedStylesheet);

        popoutDocument.adoptedStyleSheets.push(copiedStylesheet);
      }
    });

    const unsubscribe = (app: unknown) => {
      const stylesheet = this.poppedOut.get(app);
      if (stylesheet) {
        this.poppedOut.delete(app);
        ThemeQuadrone.unsubscribeStylesheet(stylesheet);
      }
    };

    Hooks.on('PopOut:popin', unsubscribe);
    Hooks.on('PopOut:close', unsubscribe);
  }

  private addPopOutHeaderButton(api: Tidy5eSheetsApi) {
    api.registerItemHeaderControls({
      controls: [
        {
          icon: 'fas fa-external-link-alt',
          label: 'POPOUT.PopOut',
          action: 'popout-module-on-popout-clicked',
          async onClickAction(event, target) {
            PopoutModule.singleton.onPopoutClicked(this);
          },
        },
      ],
    });
  }
}
