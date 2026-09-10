import type { CurrentSettings } from 'src/settings/settings.svelte';

export type ThemeColorSetting = {
  name: string;
  hint: string;
  key: keyof CurrentSettings;
  cssVariable: string;
};
