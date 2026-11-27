import { downloadTextFile, readFileAsText } from 'src/utils/file';
import type { ThemeBundle, ThemeData, ThemeSettings } from './theme.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { error } from 'src/utils/logging';
import { CONSTANTS } from 'src/constants';
import type { WorldThemeSetting } from 'src/settings/settings.types';

export class ThemeImportService {
  static readonly MIN_SUPPORTED_THEME_VERSION = 2;
  static readonly CURRENT_THEME_VERSION = 3;

  static async import(file: File): Promise<WorldThemeSetting | undefined> {
    try {
      let result = await readFileAsText(file);

      const toImport = JSON.parse(result) as ThemeData;

      const worldThemeSetting = ThemeImportService.mapThemeData(toImport);

      if (!worldThemeSetting) {
        error(`Theme file ${file.name} is in an invalid format.`);
        return undefined;
      }

      ui.notifications.info(
        FoundryAdapter.localize(
          'TIDY5E.SETTINGS.Theme.Notification.ImportSuccess',
        ),
      );

      return worldThemeSetting;
    } catch (e) {
      ui.notifications.error(
        FoundryAdapter.localize(
          'TIDY5E.SETTINGS.Theme.Notification.ImportError',
        ),
      );
      error(
        'An error occurred while attempting to import a theme file. See the devtools console for more details.',
        true,
        e,
      );
    }
  }

  static mapThemeData(data: ThemeData): WorldThemeSetting | undefined {
    var result: WorldThemeSetting = {
      documentNames: undefined,
      filter: undefined,
      filterMode: 'basic',
      id: foundry.utils.randomID(),
      name: '',
      settings: {},
      sort: 0,
      types: undefined,
    };

    if (data.version === ThemeImportService.MIN_SUPPORTED_THEME_VERSION) {
      const { version, ...settings } = data;
      foundry.utils.mergeObject(result.settings, settings);

      return result;
    }

    if (data.version === ThemeImportService.CURRENT_THEME_VERSION) {
      const { version, ...theme } = data;
      foundry.utils.mergeObject(result, theme);

      return result;
    }

    return undefined;
  }

  static async export(data: WorldThemeSetting | ThemeSettings) {
    const restData: WorldThemeSetting =
      'settings' in data
        ? data
        : {
            filterMode: 'basic',
            id: foundry.utils.randomID(),
            name: '',
            settings: data,
            sort: 1,
            documentNames: undefined,
            filter: undefined,
            types: undefined,
          };

    const toExport: Record<string, any> = {
      version: ThemeImportService.CURRENT_THEME_VERSION,
      ...restData,
    };

    downloadTextFile(
      'theme' + CONSTANTS.THEME_EXTENSION_WITH_DOT,
      JSON.stringify(toExport, null, ' '),
    );
  }

  static async importBundle(file: File) {
    try {
      const fileText = await readFileAsText(file);
      const bundle = JSON.parse(fileText) as ThemeBundle;

      if (!Array.isArray(bundle)) {
        error('Unable to import. Invalid file format.', false, bundle);
        return [];
      }

      const toImport = bundle.reduce<WorldThemeSetting[]>(
        (result, entry, index) => {
          const settings = ThemeImportService.mapThemeData(entry);

          if (settings) {
            result.push(settings);
          } else {
            error(
              `Part of theme file ${file.name} is in an invalid format.`,
              false,
              { index, entry },
            );
          }

          return result;
        },
        [],
      );

      return toImport;
    } catch (e) {
      ui.notifications.error(
        FoundryAdapter.localize(
          'TIDY5E.SETTINGS.Theme.Notification.ImportError',
        ),
      );
      error(
        'An error occurred while attempting to import a theme file. See the devtools console for more details.',
        true,
        e,
      );
    }

    return [];
  }

  static async exportBundle(themes: WorldThemeSetting[]) {
    const content = themes.map((theme) => ({
      version: ThemeImportService.CURRENT_THEME_VERSION,
      ...theme,
    }));

    downloadTextFile(
      'themes' + CONSTANTS.THEME_BUNDLE_EXTENSION_WITH_DOT,
      JSON.stringify(content, null, ' '),
    );
  }
}
