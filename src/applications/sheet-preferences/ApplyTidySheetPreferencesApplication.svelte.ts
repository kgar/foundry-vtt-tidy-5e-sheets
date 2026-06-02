import { mount } from 'svelte';
import ApplyTidySheetPreferences from './ApplyTidySheetPreferences.svelte';
import SettingsDialogShell from 'src/applications/settings/SettingsDialogShell.svelte';
import type {
  SettingsFooterHost,
  SettingsPane,
} from 'src/applications/settings/settings-pane.types';
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

export class ApplyTidySheetPreferencesApplication
  extends SvelteApplicationMixin<Partial<ApplicationConfiguration> | undefined, {}>(
    foundry.applications.api.ApplicationV2
  )
  implements SettingsPane, SettingsFooterHost
{
  sheetOptions = $state<SheetPreferenceOption[]>([]);

  _initialSnapshot = $state('');

  hasChanges = $derived(
    this._snapshot($state.snapshot(this.sheetOptions)) !== this._initialSnapshot
  );

  // Single-pane host. Use Global Defaults reverts every document to the dnd5e
  // system sheet, so it reads "Revert to System Sheets" here.
  canUndo = $derived(this.hasChanges);
  canUseDefault = true;
  useDefaultLabel = 'TIDY5E.Settings.SheetPreferences.RevertToSystemSheets';

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
    this._resetToGlobalDefaults();

    return mount(SettingsDialogShell, {
      target: node,
      props: {
        host: this,
        pane: ApplyTidySheetPreferences,
        paneProps: {
          options: this.sheetOptions,
        },
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

  /** Order-independent snapshot of which documents are set to Tidy. */
  _snapshot(options: SheetPreferenceOption[]): string {
    return JSON.stringify(
      options
        .map((o) => `${o.documentName}.${o.subType}:${o.selected ? 1 : 0}`)
        .sort()
    );
  }

  _resetToGlobalDefaults() {
    this._initialSnapshot = this._snapshot($state.snapshot(this.sheetOptions));
  }

  undoChanges() {
    // Revert selections to the currently-saved core sheet assignments, in place
    // so the bound radios refresh.
    const saved = new Map(
      this.getTidySheetPreferenceOptions().map((o) => [
        `${o.documentName}.${o.subType}`,
        o.selected,
      ])
    );
    this.sheetOptions.forEach((o) => {
      o.selected = saved.get(`${o.documentName}.${o.subType}`) ?? false;
    });
    this._resetToGlobalDefaults();
  }

  /** Stage every document back to the system sheet. Persisted on Save. */
  resetToDefault() {
    this.sheetOptions.forEach((o) => {
      o.selected = false;
    });
  }

  // Footer "Revert to System Sheets". Staged and undoable, committed on Save,
  // so no separate confirm here (Save already prompts to reload).
  useDefault() {
    this.resetToDefault();
  }

  async save(): Promise<void> {
    const changed = this.hasChanges;

    try {
      await this.apply();
    } catch (e) {
      error(FoundryAdapter.localize('TIDY5E.GenericErrorNotification'), true, {
        error: e,
      });
      return;
    }

    await this.close();

    // Sheet class changes only take effect after a reload.
    if (changed) {
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
    }
  }

  async apply(): Promise<void> {
    // We intend to adjust the existing settings.
    let sheetSettings = this._getSheetClassesSetting();

    // Evaluate each option.
    this.sheetOptions.forEach((o) => {
      // When selected, assign the Tidy class to the subtype of the document name.
      if (o.selected) {
        const documents = (sheetSettings[o.documentName] ??= {});
        documents[o.subType] = o.sheetClassIdentifier;
        return;
      }

      // When not selected, we want to remove any Tidy assignment.
      const currentSetting = sheetSettings[o.documentName]?.[o.subType];
      if (currentSetting !== o.sheetClassIdentifier) {
        // Unselected and the setting does not reference Tidy. Leave it.
        return;
      }

      // Unselected, but the setting currently points to Tidy. Clear it.
      delete sheetSettings[o.documentName][o.subType];

      // Prune document names that no longer have any subtype properties.
      if (Object.keys(sheetSettings[o.documentName]).length === 0) {
        delete sheetSettings[o.documentName];
      }
    });

    await game.settings.set('core', 'sheetClasses', sheetSettings);

    this._resetToGlobalDefaults();
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
