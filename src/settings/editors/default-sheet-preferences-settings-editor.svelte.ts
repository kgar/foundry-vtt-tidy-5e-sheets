import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { SettingsEditor } from './settings-editors.svelte';

export type SheetPreferenceOption = {
  label: string;
  documentName: string;
  subType: string;
  sheetClassIdentifier: string;
  selected: boolean;
};

export type DefaultSheetPreferencesSettingsEditor = SettingsEditor<
  SheetPreferenceOption[]
>;

export function getDefaultSheetPreferencesSettingsEditor(): DefaultSheetPreferencesSettingsEditor {
  const current = $state<SheetPreferenceOption[]>(getConfig());

  let initialSnapshot = $state<string>(snapshotConfig(current));

  const hasChanges = $derived(JSON.stringify(current) !== initialSnapshot);

  function snapshotConfig(config: SheetPreferenceOption[]) {
    return JSON.stringify($state.snapshot(config));
  }

  function getConfig() {
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

  async function save() {
    const changed = hasChanges;

    if (!changed) {
      return;
    }

    // We intend to adjust the existing settings.
    let settings = game.settings.get('core', 'sheetClasses');

    // Evaluate each option.
    current.forEach((o) => {
      // When selected, assign the Tidy class to the subtype of the document name.
      if (o.selected) {
        const documents = (settings[o.documentName] ??= {});
        documents[o.subType] = o.sheetClassIdentifier;
        return;
      }

      // When not selected, we want to remove any Tidy assignment.
      const currentSetting = settings[o.documentName]?.[o.subType];
      if (currentSetting !== o.sheetClassIdentifier) {
        // Unselected and the setting does not reference Tidy. Leave it.
        return;
      }

      // Unselected, but the setting currently points to Tidy. Clear it.
      delete settings[o.documentName][o.subType];

      // Prune document names that no longer have any subtype properties.
      if (Object.keys(settings[o.documentName]).length === 0) {
        delete settings[o.documentName];
      }
    });

    await game.settings.set('core', 'sheetClasses', settings);

    initialSnapshot = snapshotConfig(current);

    // Sheet class changes only take effect after a reload.
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

  return {
    get hasChanges() {
      return hasChanges;
    },

    resetToDefault() {
      this.value.forEach((o) => {
        o.selected = false;
      });
    },

    save() {
      return save();
    },

    undoChanges() {
      this.value = JSON.parse(initialSnapshot);
    },

    get canUndo() {
      return this.hasChanges;
    },

    canUseDefault: true,

    useDefaultLabel: 'TIDY5E.Settings.SheetPreferences.RevertToSystemSheets',

    get value() {
      return current;
    },

    async useDefault() {
      this.resetToDefault();
    },

    set value(value) {
      current.length = 0;
      current.push(...value);
    },
  };
}
