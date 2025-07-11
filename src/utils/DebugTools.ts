import type { Tidy5eSheetsApi } from 'src/api/Tidy5eSheetsApi';
import { type HeaderControlRegistrationParams } from 'src/api/api.types';
import { settings } from 'src/settings/settings.svelte';

export class DebugTools {
  static onReady(api: Tidy5eSheetsApi) {
    if (settings.value.debug) {
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

      const controlRegistrationParams: HeaderControlRegistrationParams = {
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
          {
            async onClickAction(this: any, event: PointerEvent) {
              ui.notifications.info(`Custom Theme CSS written to the console.`);
              const stylesheet = Array.from(document.styleSheets).find(
                (s) =>
                  // @ts-expect-error
                  s.ownerNode.id === 'tidy5e-sheets-quadrone-theme-settings'
              )!;

              console.log(stylesheet);
              console.log(
                Array.from(stylesheet.cssRules)
                  .map((r) => r.cssText)
                  .join('\n')
              );
            },
            icon: 'fas fa-broom',
            label: 'Print Tidy Theme Overrides to Console',
          },
        ],
      };
      api.registerItemHeaderControls(controlRegistrationParams);
      api.registerActorHeaderControls(controlRegistrationParams);
    }
  }
}
