import type { ThemeColorSettingOption } from 'src/applications/settings/world/TempWorldThemesApplication.svelte';
import type { WorldThemeSetting, WorldThemesSetting } from '../settings.types';
import type { SettingsEditor } from './settings-editors.svelte';
import { getRarities, getSpellMethods } from './shared/theme-setting-functions';
import { SettingsProvider } from '../settings.svelte';
import { removeEmptyProperties } from 'src/utils/data';
import { nilToUndefined } from 'src/utils/formatting';

export type WorldThemeSettingsContext = {
  rarities: ThemeColorSettingOption[];
  spellMethods: ThemeColorSettingOption[];
  settings: WorldThemeSetting[];
};

export type WorldThemeSettingsEditor =
  SettingsEditor<WorldThemeSettingsContext> & {
    // TODO
  };

export function getWorldThemesSettingsEditor(): WorldThemeSettingsEditor {
  const current = $state<WorldThemeSettingsContext>(getSettings());

  let initialSnapshot = $state<WorldThemeSettingsContext>(
    foundry.helpers.duplicate(current),
  );

  const hasChanges = $derived(foundry.helpers.equals(current, initialSnapshot));

  function mapFromSettings(
    source: WorldThemesSetting,
  ): WorldThemeSettingsContext {
    return {
      rarities: getRarities(),
      spellMethods: getSpellMethods(),
      settings: Object.values(source ?? {}),
    };
  }

  function getSettings(): WorldThemeSettingsContext {
    const source = SettingsProvider.settings.worldThemes.get() ?? {};

    return mapFromSettings(source);
  }

  function mapContextToChangedSettings(
    context: WorldThemeSettingsContext,
  ): WorldThemesSetting {
    return context.settings.reduce<WorldThemesSetting>((prev, curr) => {
      const changed: WorldThemeSetting = foundry.settings.duplicate(curr);
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

    async save() {},

    undoChanges() {
      this.value = { ...initialSnapshot };
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
      ) as (keyof WorldThemeSettingsContext['settings'])[];

      for (const key of keys) {
        delete current.settings[key];
      }

      Object.assign(current.settings, value);
    },
  };
}
