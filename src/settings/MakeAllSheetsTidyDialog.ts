import { getDefaultSheetPreferencesSettingsEditor } from 'src/settings/editors/default-sheet-preferences-settings-editor.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { ApplicationConfiguration } from 'src/types/application.types';

type MakeAllSheetsTidyDialogConfiguration = ApplicationConfiguration & {
  onYes?: () => Promise<void> | void;
};

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
        callback: async (
          _event: PointerEvent | SubmitEvent,
          _target: HTMLButtonElement,
          app: MakeAllSheetsTidyDialog,
        ) => {
          await app._onYes?.();
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

  _onYes?: MakeAllSheetsTidyDialogConfiguration['onYes'];

  constructor(options: Partial<MakeAllSheetsTidyDialogConfiguration>) {
    super(options);

    this._onYes = options.onYes;
  }

  _initializeApplicationOptions(options: Partial<ApplicationConfiguration>) {
    options = super._initializeApplicationOptions(options);

    options.content = `<p style="margin-bottom:1rem;">
      ${FoundryAdapter.localize('TIDY5E.Settings.SheetPreferences.dialogMessage')}
    </p>`;

    return options;
  }
}
