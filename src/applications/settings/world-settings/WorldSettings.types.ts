import type { CurrentSettings } from 'src/settings/settings.svelte';

export type WorldSettingsContext = {
  settings: {
    defaultDeathSaveRoll: CurrentSettings['defaultDeathSaveRoll'];
    allowCantripsToBePrepared: CurrentSettings['allowCantripsToBePrepared'];
    lockMoneyChanges: CurrentSettings['lockMoneyChanges'];
    itemIdentificationPermission: CurrentSettings['itemIdentificationPermission'];
    includeFlagsInSpellScrollCreation: CurrentSettings['includeFlagsInSpellScrollCreation'];
    globalCustomSections: CurrentSettings['globalCustomSections'];
  };
};

export type DefaultTabSelectionItem = {
  id: string;
  label: string;
};

export type DefaultTabSelectionFields = {
  available: DefaultTabSelectionItem[];
  selected: DefaultTabSelectionItem[];
};

export type WorldSettingsFunctions = {
  save(): Promise<void>;
  apply(): Promise<boolean>;
  resetDefaultTabs(sheetType: string): void;
};
