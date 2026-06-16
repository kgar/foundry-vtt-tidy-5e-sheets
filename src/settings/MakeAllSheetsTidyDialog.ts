import { getDefaultSheetPreferencesSettingsEditor } from 'src/applications/settings/editors/default-sheet-preferences-settings-editor.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { ApplicationConfiguration } from 'src/types/application.types';

export class MakeAllSheetsTidyDialog extends foundry.applications.api.DialogV2 {
  static DEFAULT_OPTIONS = {
    window: {
      icon: 'fa-solid fa-scroll',
      title: 'TIDY5E.Settings.SheetPreferences.dialogTitle',
    },
    position: { width: 400 },
    buttons: [
      {
        action: 'yes',
        label: 'Yes',
        icon: 'fa-solid fa-check',
        callback: async () => {
          const editor = getDefaultSheetPreferencesSettingsEditor();
          editor.initialize();
          editor.value.forEach((x) => (x.selected = true));
          await editor.save();
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
      ${FoundryAdapter.localize('TIDY5E.Settings.SheetPreferences.dialogMessage')}
    </p>`;

    return options;
  }
}
