import type { Tidy5eSheetsApi } from 'src/api';
import type { ModuleIntegrationBase } from '../integration-classes';
import type { ContextMenuPositionInfo } from 'src/context-menu/context-menu.types';

declare var PopoutModule: any;

export class PopoutModuleIntegration implements ModuleIntegrationBase {
  get moduleId(): string {
    return 'popout';
  }
  init(api: Tidy5eSheetsApi): void {
    this.setCorrectContextMenuPosition();
    //this.addPopOutHeaderButton(api); // Uncomment if PopOut! supports App V2
  }

  private setCorrectContextMenuPosition() {
    Hooks.on(
      'tidy5e-sheet.prepareFloatingContextMenuPosition',
      (info: ContextMenuPositionInfo) => {
        const appNode = info.target.closest('[data-appId]');
        const appIdAttribute = appNode?.getAttribute('data-appId');
        const appId = parseInt(appIdAttribute ?? '');

        const isPoppedOut = PopoutModule.singleton.poppedOut.has(appId);

        if (!isPoppedOut) {
          return;
        }

        const poppedOutBody =
          PopoutModule.singleton.poppedOut.get(appId).window.document.body;

        // Make the popped out Window Proxy the insert target for the context menu.
        info.insertTarget = poppedOutBody;

        poppedOutBody.addEventListener(
          'click',
          () => {
            ui.context?.close();
            // Remove the "context" class from any Tidy content, since some things may be decorated by that class.
            poppedOutBody
              .querySelectorAll('[data-context-menu]')
              .forEach((el: HTMLElement) => el.classList.remove('context'));
          },
          { once: true }
        );
      }
    );
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
