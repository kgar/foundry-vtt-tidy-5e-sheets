import { SettingsProvider } from 'src/settings/settings';

export class DebugTools {
  static onReady() {
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

      const addDebugButtonToHeader = (
        app: any,
        element: { get(index: number): HTMLElement } | HTMLElement
      ) => {
        const appElement =
          element instanceof HTMLElement ? element : element.get(0);

        appElement.querySelector('.tidy-debug-button')?.remove();

        appElement
          .querySelector('.document-id-link')
          ?.insertAdjacentHTML(
            'afterend',
            `<a data-tooltip="Tidy Debug Button" class="tidy-debug-button pseudo-header-button"><i class="fas fa-broom"></i></a>`
          );

        appElement
          .querySelector('.tidy-debug-button')
          ?.addEventListener('click', async () => {
            ui.notifications.info(
              `${app.document.name} written to the console.`
            );
            console.log(app.document);
            console.log(await app.document.sheet.getData());
          });
      };

      ['renderItemSheet', 'renderContainerSheet'].forEach((hook) => {
        Hooks.on(hook, addDebugButtonToHeader);
      });
    }
  }
}
