import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { log } from 'src/utils/logging';

export class ResetSettingsDialog extends FormApplication {
  constructor(...args: any[]) {
    super(...args);
    return new Dialog({
      title: FoundryAdapter.localize(`T5EK.Settings.Reset.dialogs.title`),
      content:
        '<p style="margin-bottom:1rem;">' +
        FoundryAdapter.localize(`T5EK.Settings.Reset.dialogs.content`) +
        '</p>',
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: FoundryAdapter.localize(`T5EK.Settings.Reset.dialogs.confirm`),
          callback: async () => {
            const storedSettings = game.settings.storage
              .get('world')
              .filter((setting: any) =>
                setting.key.startsWith(`${CONSTANTS.MODULE_ID}.`)
              );

            for (let setting of storedSettings) {
              log(`Reset setting '${setting.key}'`);
              await setting.delete();
            }
            //window.location.reload();
          },
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: FoundryAdapter.localize(`T5EK.Settings.Reset.dialogs.cancel`),
        },
      },
      default: 'cancel',
    });
  }

  async _updateObject(...args: any[]) {
    // do nothing
  }
}
