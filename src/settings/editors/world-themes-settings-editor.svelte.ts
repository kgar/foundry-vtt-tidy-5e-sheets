import type {
  ThemeColorSettingOption,
  WorldThemeSetting,
  WorldThemesSetting,
} from '../settings.types';
import type { SettingsEditor } from './settings-editors.svelte';
import {
  getCompendia,
  getDocumentTypeTree,
  getRarities,
  getSpellMethods,
  type ThemeDocumentTypeNode,
} from './shared/theme-setting-functions';
import { SettingsProvider } from '../settings.svelte';
import { removeEmptyProperties } from 'src/utils/data';
import { nilToUndefined } from 'src/utils/formatting';
import type { FilterDescription } from 'src/foundry/dnd5e.types';
import { DialogService } from 'src/features/dialog/DialogService';
import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';

export type WorldThemeSettingEntry = WorldThemeSetting & {
  folder: string;
  /** Limits the theme to compendium documents, excluding the sidebar, unlinked tokens, etc. */
  compendiumOnly: boolean;
  /** Compendium pack IDs whose documents are included. */
  compendia: string[];
  themeMode?: string;
};

export type WorldThemesSettingsContext = {
  settings: WorldThemeSettingEntry[];
};

export type WorldThemesSettingsEditor =
  SettingsEditor<WorldThemesSettingsContext> & {
    addTheme(): any;
    applyPreset(): Promise<void>;
    deleteTheme(id: string): any;
    rarities: ThemeColorSettingOption[];
    spellMethods: ThemeColorSettingOption[];
    compendia: { text: string; value: string }[];
    addCompendium(packId: string): void;
    removeCompendium(packId: string): void;
    documentTypeTree: ThemeDocumentTypeNode[];
    applyBasicFilters(): void;
    setFilter(filter: string | undefined): void;
    selectTheme(id: string | undefined): void;
    /** Returns to the theme list. */
    closeTheme(): void;
    get selectedTheme(): WorldThemeSettingEntry | undefined;
    get updateSignal(): string;
  };

/** Trims, ensures a leading slash, and drops trailing slashes. Returns '' for no folder. */
function normalizeFolderPath(path: string): string {
  const trimmed = path.trim().replace(/\/+$/, '');
  if (!trimmed) {
    return '';
  }
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

/**
 * Matches the folder itself or anything nested beneath it.
 * The trailing slash on the prefix keeps "/Goblins" from matching a sibling like "/Goblins Elite".
 */
function buildFolderFilter(folder: string): FilterDescription {
  return {
    o: 'OR',
    v: [
      { k: 'folder', v: folder },
      { k: 'folder', o: 'startswith', v: `${folder}/` },
    ],
  };
}

function buildBasicFilter(entry: WorldThemeSettingEntry): FilterDescription[] {
  const filter: FilterDescription[] = [];

  const folder = normalizeFolderPath(entry.folder);
  if (folder) {
    filter.push(buildFolderFilter(folder));
  }

  if (entry.themeMode) {
    filter.push({ k: 'themeMode', v: entry.themeMode });
  }

  // Document sources are alternatives. `compendiumOnly` without any choices applies to all compendia.
  const sources: FilterDescription[] = [
    ...(entry.compendiumOnly ? [] : [{ k: 'inCompendium', v: false }]),
    ...entry.compendia.map((packId) => ({ k: 'document.pack', v: packId })),
  ];

  if (entry.compendiumOnly && !sources.length) {
    sources.push({ k: 'inCompendium', v: true });
  }

  if (sources.length === 1) {
    filter.push(sources[0]);
  } else if (sources.length > 1) {
    filter.push({ o: 'OR', v: sources });
  }

  return filter;
}

const documentSourceKeys = new Set(['inCompendium', 'document.pack']);

function toFilterList(
  filter: FilterDescription | FilterDescription[] | undefined,
): FilterDescription[] {
  return Array.isArray(filter) ? filter : filter ? [filter] : [];
}

/** Reads the document source fields back out of a basic filter. */
function findDocumentSources(
  filter: FilterDescription | FilterDescription[] | undefined,
): Pick<WorldThemeSettingEntry, 'compendiumOnly' | 'compendia'> {
  const entries = toFilterList(filter);

  const sources = entries.flatMap((entry) => {
    if (entry.k && documentSourceKeys.has(entry.k)) {
      return [entry];
    }

    const isSourceGroup =
      entry.o === 'OR' &&
      Array.isArray(entry.v) &&
      entry.v.every(
        (f: FilterDescription) => !!f.k && documentSourceKeys.has(f.k),
      );

    return isSourceGroup ? (entry.v as FilterDescription[]) : [];
  });

  return {
    compendiumOnly:
      sources.length > 0 &&
      !sources.some((f) => f.k === 'inCompendium' && f.v === false),
    compendia: sources
      .filter((f) => f.k === 'document.pack' && typeof f.v === 'string')
      .map((f) => f.v),
  };
}

function stringifyBasicFilter(entry: WorldThemeSettingEntry): string {
  return JSON.stringify(buildBasicFilter(entry), null, '  ');
}

/**
 * Finds the value for a key in a basic filter.
 * Also checks inside OR groups, which is where the folder check lives.
 */
function findBasicFilterValue(
  filter: FilterDescription | FilterDescription[] | undefined,
  key: string,
): any {
  for (const entry of toFilterList(filter)) {
    if (entry.k === key) {
      return entry.v;
    }

    if (entry.o === 'OR' && Array.isArray(entry.v)) {
      const nested = entry.v.find((f: FilterDescription) => f.k === key);
      if (nested) {
        return nested.v;
      }
    }
  }

  return undefined;
}

export function getWorldThemesSettingsEditor(): WorldThemesSettingsEditor {
  const current = $state<WorldThemesSettingsContext>(getSettings());

  let initialSnapshot = $state<string>(JSON.stringify(snapshotConfig(current)));

  function getFirstItemBySort(settings: WorldThemeSettingEntry[]) {
    return settings.toSorted((a, b) => a.sort - b.sort)[0];
  }

  let selectedTheme = $state<WorldThemeSettingEntry | undefined>();

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
        compendiumOnly: false,
        compendia: [],
        themeMode: undefined,
      };

      refreshBasicFilterFields(formData);

      if (formData.filterMode === 'basic') {
        formData.filter = stringifyBasicFilter(formData);
      }

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
      const { folder, compendiumOnly, compendia, themeMode, ...changed } =
        foundry.utils.duplicate(curr) as WorldThemeSettingEntry;
      // Basic mode always regenerates the filter from its fields, so new or
      // cleared themes still get the default "Non-Compendium Documents" scope.
      changed.filter =
        curr.filterMode === 'basic'
          ? stringifyBasicFilter(curr)
          : nilToUndefined(changed.filter);
      changed.documentNames = changed.documentNames?.length
        ? changed.documentNames
        : undefined;
      changed.types = changed.types?.length ? changed.types : undefined;
      changed.settings = removeEmptyProperties(changed.settings);

      prev[curr.id] = changed;

      return prev;
    }, {});
  }

  function parseFilter(
    raw: string | undefined,
  ): FilterDescription | FilterDescription[] | undefined {
    if (!raw) {
      return undefined;
    }

    try {
      return JSON.parse(raw);
    } catch {
      // Failure is an option. Ignore.
      return undefined;
    }
  }

  /** Populates the basic inputs as a facade over the filter, as best it can. */
  function refreshBasicFilterFields(
    entry: WorldThemeSettingEntry,
    filter = parseFilter(entry.filter),
  ) {
    entry.folder = findBasicFilterValue(filter, 'folder') ?? '';
    entry.themeMode = findBasicFilterValue(filter, 'themeMode');
    const sources = findDocumentSources(filter);
    entry.compendiumOnly = sources.compendiumOnly;
    entry.compendia = sources.compendia;
  }

  return {
    async applyPreset(): Promise<void> {
      if (!selectedTheme?.settings) {
        return;
      }

      const options = current.settings
        .map((s) => ({ id: s.id, label: s.name }))
        .toSorted((a, b) => a.label.localeCompare(b.label));

      const selectedId = await DialogService.chooseFromOptions({
        title: 'TIDY5E.COMMON.Theme.ChooseAPreset.Title',
        message: 'TIDY5E.COMMON.Theme.ChooseAPreset.Content',
        options,
      });

      const preset = this.value.settings.find((s) => s.id === selectedId);

      if (!preset) {
        return;
      }

      const snapshot = $state.snapshot(preset.settings);

      selectedTheme.settings = snapshot;
    },

    addTheme(): any {
      const maxSort = this.value.settings.reduce(
        (prev, curr) => Math.max(prev, curr.sort),
        0,
      );

      const settingId = foundry.utils.randomID();

      const entry: WorldThemeSettingEntry = {
        filterMode: 'basic',
        id: settingId,
        name: 'TODO: New Name Here',
        settings: ThemeQuadrone.getDefaultThemeSettings(),
        sort: maxSort + 1,
        documentNames: [],
        filter: undefined,
        types: [],
        folder: '',
        compendiumOnly: false,
        compendia: [],
        themeMode: undefined,
      };
      entry.filter = stringifyBasicFilter(entry);

      this.value.settings.push(entry);

      this.selectTheme(settingId);
    },

    applyBasicFilters() {
      if (!selectedTheme) {
        return;
      }

      selectedTheme.filterMode = 'basic';
      selectedTheme.filter = stringifyBasicFilter(selectedTheme);
    },

    setFilter(filter: string | undefined) {
      if (!selectedTheme) {
        return;
      }

      selectedTheme.filter = filter?.trim() || undefined;

      const parsed = parseFilter(selectedTheme.filter);
      refreshBasicFilterFields(selectedTheme, parsed);

      // If the fields can reproduce this filter exactly, keep them in charge.
      // Otherwise it's a custom filter, saved as-is until a field is changed.
      const reproducible =
        !!parsed &&
        JSON.stringify(buildBasicFilter(selectedTheme)) ===
          JSON.stringify(parsed);

      selectedTheme.filterMode = reproducible ? 'basic' : 'advanced';
    },

    deleteTheme(id: string): any {
      const selectedId = this.selectedTheme?.id;

      this.value.settings = this.value.settings
        .filter((t) => t.id !== id)
        .sort((a, b) => a.sort - b.sort);

      for (let i = 0; i < this.value.settings.length; i++) {
        this.value.settings[i].sort = i + 1;
      }

      // Go back to the theme list after deleting.
      selectedTheme = this.value.settings.find((t) => t.id === selectedId);
    },

    rarities: getRarities(),

    spellMethods: getSpellMethods(),

    compendia: getCompendia(),

    addCompendium(packId: string) {
      if (
        !selectedTheme ||
        !packId ||
        selectedTheme.compendia.includes(packId)
      ) {
        return;
      }

      selectedTheme.compendia = [...selectedTheme.compendia, packId];
      this.applyBasicFilters();
    },

    removeCompendium(packId: string) {
      if (!selectedTheme) {
        return;
      }

      selectedTheme.compendia = selectedTheme.compendia.filter(
        (c) => c !== packId,
      );
      this.applyBasicFilters();
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
        : getFirstItemBySort(this.value.settings);

      selectedTheme = themeOfId ?? fallback;
    },

    closeTheme() {
      selectedTheme = undefined;
    },

    async save() {
      const toSave = mapContextToChangedSettings(this.value);

      game.settings.set('tidy5e-sheet', 'worldThemes', toSave);
    },

    documentTypeTree: getDocumentTypeTree(),

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
