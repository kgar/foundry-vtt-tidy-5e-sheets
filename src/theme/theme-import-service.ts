import { downloadTextFile, readFileAsText } from "src/utils/file";
import type { ThemeSettingsV2 } from "./theme-quadrone.types";
import { ThemeQuadrone } from "./theme-quadrone.svelte";
import { FoundryAdapter } from "src/foundry/foundry-adapter";
import { error } from "src/utils/logging";
import { CONSTANTS } from "src/constants";

export class ThemeQuadroneImportService {
  static readonly CURRENT_THEME_VERSION = 2;

  static async import(file: File): Promise<ThemeSettingsV2 | undefined> {
    try {
      let result = await readFileAsText(file);

      const toImport = JSON.parse(result) as ThemeSettingsV2 & {
        version: number;
      };

      const isValid = this.validateImportFile(toImport);

      if (!isValid) {
        throw new Error(`Theme file ${file.name} is in an invalid format.`);
      }

      let { version, ...theme } = toImport;

      const settings = foundry.utils.mergeObject(
        ThemeQuadrone.getDefaultThemeSettings(),
        theme
      );

      ui.notifications.info(
        FoundryAdapter.localize('TIDY5E.ThemeSettings.Sheet.importSuccess')
      );

      return settings;
    } catch (e) {
      ui.notifications.error(
        FoundryAdapter.localize('TIDY5E.ThemeSettings.Sheet.importError')
      );
      error(
        'An error occurred while attempting to import a theme file. See the devtools console for more details.',
        true,
        e
      );
    }
  }

  static validateImportFile(theme: ThemeSettingsV2 & { version: number }) {
    return theme.version === this.CURRENT_THEME_VERSION;
  }

  static async export(data: ThemeSettingsV2) {
    const toExport: Record<string, any> = {
      version: this.CURRENT_THEME_VERSION,
      ...data,
    };

    downloadTextFile(
      'theme' + CONSTANTS.THEME_EXTENSION_WITH_DOT,
      JSON.stringify(toExport, null, ' ')
    );
  }
}
