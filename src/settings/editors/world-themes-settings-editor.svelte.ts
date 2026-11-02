import type {
  ThemeColorSettingOption,
  WorldThemeSetting,
  WorldThemesSetting,
} from '../settings.types';
import type { SettingsEditor } from './settings-editors.svelte';
import {
  getCompendia,
  getRarities,
  getSpellMethods,
  getSupportedDocuments,
} from './shared/theme-setting-functions';
import { SettingsProvider } from '../settings.svelte';
import { removeEmptyProperties } from 'src/utils/data';
import { nilToUndefined } from 'src/utils/formatting';
import type { FilterDescription } from 'src/foundry/dnd5e.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

type WorldThemeSettingEntry = WorldThemeSetting & {
  folder: string;
  compendium?: string;
  themeMode?: string;
};

export type WorldThemesSettingsContext = {
  settings: WorldThemeSettingEntry[];
};

export type WorldThemesSettingsEditor =
  SettingsEditor<WorldThemesSettingsContext> & {
    addTheme(): any;
    deleteTheme(id: string): any;
    rarities: ThemeColorSettingOption[];
    spellMethods: ThemeColorSettingOption[];
    compendia: { text: string; value: string }[];
    supportedDocuments: { text: string; value: string }[];
    applyBasicFilters(): void;
    clearFilter(): void;
    selectTheme(id: string | undefined): void;
    get selectedTheme(): WorldThemeSettingEntry | undefined;
    get availableTypes(): { text: string; value: string }[];
    get updateSignal(): string;
  };

export function getWorldThemesSettingsEditor(): WorldThemesSettingsEditor {
  const current = $state<WorldThemesSettingsContext>(getSettings());

  let initialSnapshot = $state<string>(JSON.stringify(snapshotConfig(current)));

  let selectedTheme = $state<WorldThemeSettingEntry | undefined>(
    current.settings[0],
  );

  const typeDenylist = new Set(['base', 'backpack']);

  const availableTypes = $derived(
    (selectedTheme?.documentNames ?? [])
      .flatMap(
        (docName: any) =>
          foundry.documents[docName]?.TYPES.filter(
            (t: string) =>
              !!CONFIG[docName as keyof typeof CONFIG]?.typeLabels[t] &&
              !typeDenylist.has(t),
          ).map((t: string) => ({
            text: FoundryAdapter.localize(
              CONFIG[docName as keyof typeof CONFIG].typeLabels[t],
            ),
            value: t,
          })) ?? [],
      )
      .sort((a, b) => a.text.localeCompare(b.text)),
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
      const formData: WorldThemeSettingEntry = {
        ...setting,
        folder: '',
        compendium: undefined,
        themeMode: undefined,
      };

      refreshBasicFilterFields(formData);

      return formData;
    });

    const context: WorldThemesSettingsContext = {
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

  function refreshBasicFilterFields(selectedTheme: WorldThemeSettingEntry) {
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
    dispose() {
      // TODO: Dispose of effects related to managing automatic filter value management.
      ui.notifications.info('disposed!');
    },

    addTheme(): any {
      const maxSort = this.value.settings.reduce(
        (prev, curr) => Math.max(prev, curr.sort),
        0,
      );

      const settingId = foundry.utils.randomID();

      this.value.settings.push({
        filterMode: 'basic',
        id: settingId,
        name: 'TODO: New Name Here',
        settings: {},
        sort: maxSort + 1,
        documentNames: [],
        filter: undefined,
        types: [],
        folder: '',
        compendium: undefined,
        themeMode: undefined,
      });

      this.selectTheme(settingId);
    },

    applyBasicFilters() {
      if (!selectedTheme) {
        return;
      }

      const filter: FilterDescription[] = [];

      if (selectedTheme.folder.trim() !== '') {
        filter.push({
          k: 'folder',
          v: selectedTheme.folder,
        });
      }

      if (selectedTheme.themeMode) {
        filter.push({
          k: 'themeMode',
          v: selectedTheme.themeMode,
        });
      }

      if (selectedTheme.compendium) {
        filter.push({
          k: 'document.pack',
          v: selectedTheme.compendium,
        });
      }

      selectedTheme.filter = JSON.stringify(filter, null, '  ');
    },

    clearFilter() {
      if (!selectedTheme) {
        return;
      }

      selectedTheme.filter = undefined;
      selectedTheme.themeMode = undefined;
      selectedTheme.compendium = undefined;
      selectedTheme.folder = '';
    },

    deleteTheme(id: string): any {
      const selectedId = this.selectedTheme?.id;

      this.value.settings = this.value.settings
        .filter((t) => t.id !== id)
        .sort((a, b) => a.sort - b.sort);

      for (let i = 0; i < this.value.settings.length; i++) {
        this.value.settings[i].sort = i + 1;
      }

      this.selectTheme(selectedId);
    },

    rarities: getRarities(),

    spellMethods: getSpellMethods(),

    compendia: getCompendia(),

    get availableTypes() {
      return availableTypes;
    },

    get hasChanges() {
      return hasChanges;
    },

    resetToDefault() {
      this.value = mapFromSettings({});
    },

    get selectedTheme() {
      return selectedTheme;
    },

    selectTheme(id: string | undefined) {
      const themeOfId = this.value.settings.find((t) => t.id === id);

      const fallback = this.value.settings.some(
        (theme) => theme.id === this.selectedTheme?.id,
      )
        ? this.selectedTheme
        : this.value.settings[0];

      selectedTheme = themeOfId ?? fallback;
    },

    async save() {
      const toSave = mapContextToChangedSettings(this.value);

      game.settings.set('tidy5e-sheet', 'worldThemes', toSave);
    },

    supportedDocuments: getSupportedDocuments(),

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
