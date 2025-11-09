import { mount } from 'svelte';
import ApplyTidySheetPreferences from './ApplyTidySheetPreferences.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { error } from 'src/utils/logging';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type { ApplicationConfiguration } from 'src/types/application.types';
import { CONSTANTS } from 'src/constants';
import { applyThemeToApplication } from 'src/utils/applications.svelte';

export type SheetPreferenceOption = {
  label: string;
  documentName: string;
  subType: string;
  sheetClassIdentifier: string;
  selected: boolean;
};

export class ApplyTidySheetPreferencesApplication extends SvelteApplicationMixin<
  Partial<ApplicationConfiguration> | undefined,
  {}
>(foundry.applications.api.ApplicationV2) {
  sheetOptions = $state<SheetPreferenceOption[]>([]);

  static DEFAULT_OPTIONS = {
    classes: [
      CONSTANTS.MODULE_ID,
      'tidy5e-sheet-preferences',
      'sheet',
      'quadrone',
    ],
    id: 'tidy5e-sheet-preferences',
    tag: 'div',
    window: {
      frame: true,
      positioned: true,
      resizable: true,
      controls: [],
      title: 'TIDY5E.Settings.SheetPreferences.name',
      contentClasses: ['flexcol'],
    },
    position: {
      width: 650,
      height: 500,
    },
  };

  _createComponent(node: HTMLElement): Record<string, any> {
    this.sheetOptions = this.getTidySheetPreferenceOptions();

    return mount(ApplyTidySheetPreferences, {
      target: node,
      props: {
        options: this.sheetOptions,
        onConfirm: this._onConfirm.bind(this),
      },
    });
  }

  getTidySheetPreferenceOptions(): SheetPreferenceOption[] {
    return FoundryAdapter.getAllTidySheetClassMetadata()
      .map((m) => ({
        documentName: m.documentName,
        label: m.typeLabel,
        selected: m.isDefault,
        sheetClassIdentifier: m.sheetClassIdentifier,
        subType: m.documentSubtype,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, game.i18n.lang));
  }

  private async _onConfirm(): Promise<void> {
    try {
      // We intend to adjust the existing settings.
      let sheetSettings = this._getSheetClassesSetting();

      // Evaluate each option.
      this.sheetOptions.forEach((o) => {
        // const compositeSettingKey = `${o.documentName}.${o.subType}`;

        // When selected, simply assign the Tidy class to the appropriate subtype of the appropriate document name
        if (o.selected) {
          const documents = (sheetSettings[o.documentName] ??= {});
          documents[o.subType] = o.sheetClassIdentifier;
          return;
        }

        // When not selected, we want to remove any Tidy
        const currentSetting = sheetSettings[o.documentName]?.[o.subType];
        if (currentSetting !== o.sheetClassIdentifier) {
          // The option was unselected, and the setting does not reference Tidy. Do not change it.
          return;
        }

        // The option was unselected, but the setting currently points to Tidy. Clear out this setting.
        delete sheetSettings[o.documentName][o.subType];

        // Prune settings where the document name no longer has any subtype properties.
        if (Object.keys(sheetSettings[o.documentName]).length === 0) {
          delete sheetSettings[o.documentName];
        }
      });

      await game.settings.set('core', 'sheetClasses', sheetSettings);

      this.close();

      const proceed = await foundry.applications.api.DialogV2.confirm({
        window: {
          title: FoundryAdapter.localize('SETTINGS.ReloadPromptTitle'),
        },
        content: FoundryAdapter.localize('SETTINGS.ReloadPromptBody'),
        yes: { default: true },
      });

      if (proceed) {
        foundry.utils.debouncedReload();
      }
    } catch (e) {
      error(FoundryAdapter.localize('TIDY5E.GenericErrorNotification'), true, {
        error: e,
      });
    }
  }

  private _getSheetClassesSetting() {
    return game.settings.get('core', 'sheetClasses');
  }

  // Not going to refactor this because this application is living on borrowed time
  _attachFrameListeners() {
    super._attachFrameListeners();

    applyThemeToApplication(this.element);
  }
}
