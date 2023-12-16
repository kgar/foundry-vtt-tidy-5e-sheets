import type { CurrentSettings } from 'src/settings/settings';

export type Tidy5eTheme = {
  id: string;
  name: string;
  description: string;
  variables: Record<string, string>;
  /**
   * Determines whether this theme is considered a dark-oriented theme or a light-oriented theme.
   */
  type: 'dark' | 'light';
};

export type ThemeColorSetting = {
  name: string;
  hint: string;
  key: keyof CurrentSettings;
  cssVariable: string;
};

export type Tidy5eThemeDataV1 = {
  version: 1;
  variables: Record<string, string>;
};
