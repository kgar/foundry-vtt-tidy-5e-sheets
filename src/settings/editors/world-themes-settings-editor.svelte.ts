import type {
  ThemeColorSettingOption,
  WorldThemeSetting,
  WorldThemesSetting,
} from '../settings.types';
import type { SettingsEditor } from './settings-editors.svelte';
import { getRarities, getSpellMethods } from './shared/theme-setting-functions';
import { SettingsProvider } from '../settings.svelte';
import { removeEmptyProperties } from 'src/utils/data';
import { nilToUndefined } from 'src/utils/formatting';
import type { FilterDescription } from 'src/foundry/dnd5e.types';

type WorldThemeSettingForm = WorldThemeSetting & {
  folder: string;
  compendium?: string;
  themeMode?: string;
};

export type WorldThemesSettingsContext = {
  rarities: ThemeColorSettingOption[];
  spellMethods: ThemeColorSettingOption[];
  settings: WorldThemeSettingForm[];
};

export type WorldThemesSettingsEditor =
  SettingsEditor<WorldThemesSettingsContext> & {
    selectTheme(id: string): void;
    get selectedTheme(): WorldThemeSettingForm | undefined;
    get updateSignal(): string;
  };

export function getWorldThemesSettingsEditor(): WorldThemesSettingsEditor {
  const current = $state<WorldThemesSettingsContext>(getSettings());

  let initialSnapshot = $state<string>(JSON.stringify(snapshotConfig(current)));

  let selectedTheme = $state<WorldThemeSettingForm | undefined>(
    current.settings[0],
  );

  let updateSignal = $state(foundry.utils.randomID());

  const hasChanges = $derived(
    JSON.stringify(snapshotConfig(current)) !== initialSnapshot,
  );

  function snapshotConfig(config: WorldThemesSettingsContext) {
    return $state.snapshot(config);
  }

  function mapFromSettings(
    source: WorldThemesSetting,
  ): WorldThemesSettingsContext {
    const settings = Object.values(source ?? {}).map((setting) => {
      const formData: WorldThemeSettingForm = {
        ...setting,
        folder: '',
        compendium: undefined,
        themeMode: undefined,
      };

      refreshBasicFilterFields(formData);

      return formData;
    });

    const context: WorldThemesSettingsContext = {
      rarities: getRarities(),
      spellMethods: getSpellMethods(),
      settings: settings,
    };

    return context;
  }

  function getSettings(): WorldThemesSettingsContext {
    const source = SettingsProvider.settings.worldThemes.get() ?? {};

    // TODO: When empty and there's a legacy world theme setting still stored, add it here.

    Object.values(source).forEach((s) => {
      s.settings.rarityColors ??= {};
      s.settings.spellPreparationMethodColors ??= {};
    });

    return mapFromSettings(source);
  }

  function mapContextToChangedSettings(
    context: WorldThemesSettingsContext,
  ): WorldThemesSetting {
    return context.settings.reduce<WorldThemesSetting>((prev, curr) => {
      const changed: WorldThemeSetting = foundry.utils.duplicate(curr);
      changed.filter = nilToUndefined(changed.filter);
      changed.types =
        changed.types && changed.types.length > 0 ? changed.types : undefined;
      changed.settings = removeEmptyProperties(changed.settings);

      prev[curr.id] = changed;

      return prev;
    }, {});
  }

  function refreshBasicFilterFields(selectedTheme: WorldThemeSettingForm) {
    if (selectedTheme.filterMode === 'basic' && !!selectedTheme.filter) {
      let filter: FilterDescription | FilterDescription[] | undefined =
        undefined;
      try {
        filter = JSON.parse(selectedTheme.filter);
      } catch {
        // Failure is an option. Ignore.
      }

      // TODO: Somehow clean this up and streamline the code
      // so it's easy to maintain and expand.
      // Populate Folder input as facade over filter
      selectedTheme.folder =
        filter && Array.isArray(filter)
          ? (filter.find((f) => f.k === 'folder')?.v ?? '')
          : typeof filter === 'object' && filter.k === 'folder'
            ? (filter.v ?? '')
            : '';

      // Populate Theme Mode input as facade over filter
      selectedTheme.themeMode =
        filter && Array.isArray(filter)
          ? filter.find((f) => f.k === 'themeMode')?.v
          : typeof filter === 'object' && filter.k === 'themeMode'
            ? filter.v
            : undefined;

      // Populate Compendium input as facade over filter
      selectedTheme.compendium =
        filter && Array.isArray(filter)
          ? filter.find((f) => f.k === 'document.pack')?.v
          : typeof filter === 'object' && filter.k === 'document.pack'
            ? filter.v
            : undefined;
    } else {
      selectedTheme.folder = '';
      selectedTheme.themeMode = undefined;
      selectedTheme.compendium = undefined;
    }
  }

  return {
    get hasChanges() {
      return hasChanges;
    },

    resetToDefault() {
      this.value = mapFromSettings({});
    },

    get selectedTheme() {
      return selectedTheme;
    },

    selectTheme(id: string) {
      const themeOfId = this.value.settings.find((t) => t.id === id);
      selectedTheme = themeOfId ?? this.selectedTheme;
    },

    async save() {
      const toSave = mapContextToChangedSettings(this.value);

      game.settings.set('tidy5e-sheet', 'worldThemes', toSave);
    },

    undoChanges() {
      if (!selectedTheme) {
        return;
      }

      const selectedId = selectedTheme.id;

      const selectedThemeInitialState = (
        JSON.parse(initialSnapshot) as WorldThemesSettingsContext
      ).settings.find((setting) => setting.id === selectedTheme?.id);

      if (!selectedThemeInitialState?.id) {
        return;
      }

      this.value.settings = this.value.settings.map((setting) =>
        setting.id === selectedThemeInitialState.id
          ? selectedThemeInitialState
          : setting,
      );

      updateSignal = foundry.utils.randomID();

      this.selectTheme(selectedId);
    },

    get canUndo() {
      return this.hasChanges;
    },

    get updateSignal() {
      return updateSignal;
    },

    canUseDefault: false,

    async useDefault() {},

    get value() {
      return current;
    },

    set value(value) {
      const keys = Object.keys(
        current.settings,
      ) as (keyof WorldThemesSettingsContext['settings'])[];

      current.settings = [...value.settings];
    },
  };
}
