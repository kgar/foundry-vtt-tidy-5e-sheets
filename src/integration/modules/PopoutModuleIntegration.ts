import type { Tidy5eSheetsApi } from 'src/api/Tidy5eSheetsApi';
import type { ModuleIntegrationBase } from '../integration-classes';
import type { ContextMenuPositionInfo } from 'src/context-menu/context-menu.types';

declare var PopoutModule: any;

export class PopoutModuleIntegration implements ModuleIntegrationBase {
  get moduleId(): string {
    return 'popout';
  }

  init(api: Tidy5eSheetsApi): void {
    //this.addPopOutHeaderButton(api); // Uncomment if PopOut! supports App V2
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
