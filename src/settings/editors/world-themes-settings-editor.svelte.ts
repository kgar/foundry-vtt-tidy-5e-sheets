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

export type WorldThemesSettingsContext = {
  rarities: ThemeColorSettingOption[];
  spellMethods: ThemeColorSettingOption[];
  settings: WorldThemeSetting[];
};

export type WorldThemesSettingsEditor =
  SettingsEditor<WorldThemesSettingsContext> & {
    // TODO
  };

export function getWorldThemesSettingsEditor(): WorldThemesSettingsEditor {
  const current = $state<WorldThemesSettingsContext>(getSettings());

  let initialSnapshot = $state<WorldThemesSettingsContext>(
    foundry.utils.duplicate(current),
  );

  const hasChanges = $derived(foundry.utils.equals(current, initialSnapshot));

  function mapFromSettings(
    source: WorldThemesSetting,
  ): WorldThemesSettingsContext {
    return {
      rarities: getRarities(),
      spellMethods: getSpellMethods(),
      settings: Object.values(source ?? {}),
    };
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

  return {
    get hasChanges() {
      return hasChanges;
    },

    resetToDefault() {
      this.value = mapFromSettings({});
    },

    async save() {
      const toSave = mapContextToChangedSettings(this.value);

      game.settings.set('tidy5e-sheet', 'worldThemes', toSave);
    },

    undoChanges() {
      this.value = foundry.utils.duplicate(initialSnapshot);
    },

    get canUndo() {
      return this.hasChanges;
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

      for (const key of keys) {
        delete current.settings[key];
      }

      Object.assign(current.settings, value);
    },
  };
}
