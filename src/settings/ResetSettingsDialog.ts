import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { ApplicationConfiguration } from 'src/types/application.types';
import { log } from 'src/utils/logging';

export class ResetSettingsDialog extends foundry.applications.api.DialogV2 {
  static DEFAULT_OPTIONS = {
    window: {
      icon: 'fa-solid fa-coins',
      title: 'TIDY5E.Settings.Reset.dialogs.title',
    },
    position: { width: 400 },
    buttons: [
      {
        action: 'yes',
        label: 'Yes',
        icon: 'fa-solid fa-check',
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
        },
      },
      {
        action: 'no',
        label: 'No',
        icon: 'fa-solid fa-xmark',
        default: true,
      },
    ],
  };

  _initializeApplicationOptions(options: Partial<ApplicationConfiguration>) {
    options = super._initializeApplicationOptions(options);

    options.content = `<p style="margin-bottom:1rem;">
      ${FoundryAdapter.localize('TIDY5E.Settings.Reset.dialogs.content')}
    </p>`;

    return options;
  }

  async _reset() {
    const storedSettings = game.settings.storage
      .get('world')
      .filter((setting: any) =>
        setting.key.startsWith(`${CONSTANTS.MODULE_ID}.`)
      );

    for (let setting of storedSettings) {
      log(`Reset setting '${setting.key}'`);
      await setting.delete();
    }
  }
}
