import { VisibilityLevels } from 'src/features/visibility-levels/VisibilityLevels';
import type {
  SheetTabConfigEntry,
  SheetTabsConfiguration,
  SheetTabsConfigurationLegacyV1,
  TabConfiguration,
} from './settings.types';

export const SettingsShims = {
  tabConfiguration(setting: Partial<TabConfiguration>): TabConfiguration {
    const shimmed = (setting ?? {}) as TabConfiguration;

    for (const [docName, docNameValue] of Object.entries(shimmed ?? {})) {
      for (const [docType, docTypeValue] of Object.entries(
        docNameValue ?? {},
      )) {
        shimmed[docName] ??= {};
        shimmed[docName][docType] ??= { tabs: {} };
        shimmed[docName][docType] =
          this.tryMapSheetTabConfigurationFromLegacyV1(docTypeValue, docName);
      }
    }

    return shimmed;
  },

  /**
   * Return current settings, if present, without the legacy arrays.
   * Else, if the setting has legacy arrays and no current version
   * of the setting, then map to the current setting format and return.
   *
   * The fields which are being mapped to the current shape:
   * - `selected: string[];`
   * - `visibilityLevels: Record<string, number | null>;`
   */
  tryMapSheetTabConfigurationFromLegacyV1(
    config: Partial<
      SheetTabsConfiguration & Partial<SheetTabsConfigurationLegacyV1>
    >,
    documentName: string,
  ): SheetTabsConfiguration {
    // If has the new tabs prop, return only that prop.
    if (config.tabs) {
      return { tabs: config.tabs };
    }

    const defaultVisibility =
      VisibilityLevels.getDefaultLevelValue(documentName);

    // If has original arrays and not the new tabs prop, map.
    const tabs = config.selected
      ?.entries()
      .reduce<Record<string, SheetTabConfigEntry>>((obj, [index, tabId]) => {
        obj[tabId] = {
          key: tabId,
          order: index,
          show: true,
          visibilityLevel:
            config.visibilityLevels?.[tabId] ?? defaultVisibility,
        };

        return obj;
      }, {});

    // Return mapped settings or empty object to represent no settings
    return { tabs: tabs ?? {} };
  },
};
