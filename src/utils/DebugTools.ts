import { type Tidy5eSheetsApi } from 'src/api';
import { SettingsProvider } from 'src/settings/settings';

export class DebugTools {
  static onReady(api: Tidy5eSheetsApi) {
    if (SettingsProvider.settings.debug.get()) {
      async function onDebugButtonClick(app: any) {
        ui.notifications.info(`${app.document.name} written to the console.`);
        console.log(app.document);
        console.log(await app.document.sheet.getData());
      }

      Hooks.on('getActorSheetHeaderButtons', (app: any, buttons: any[]) => {
        buttons.unshift({
          label: 'Tidy Debug Button',
          class: 'tidy-debug-button',
          icon: 'fas fa-broom',
          onclick() {
            onDebugButtonClick(app);
          },
        });
      });

      const controlRegistrationParams = {
        controls: [
          {
            async onClickAction(this: any, event: PointerEvent) {
              ui.notifications.info(
                `${this.document.name} written to the console.`
              );
              console.log(this.document);
              console.log(await this.document.sheet._prepareContext());
            },
            icon: 'fas fa-broom',
            label: 'Tidy Debug Button',
          },
        ],
      };
      api.registerItemHeaderControls(controlRegistrationParams);
      api.registerActorHeaderControls(controlRegistrationParams);
    }
  }
}
