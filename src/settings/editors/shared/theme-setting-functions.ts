import type { ThemeColorSettingOption } from 'src/applications/settings/world/TempWorldThemesApplication.svelte';

export function getRarities(): ThemeColorSettingOption[] {
  return Object.entries(CONFIG.DND5E.itemRarity).map(([key, label]) => ({
    label,
    key,
  }));
}

export function getSpellMethods(): ThemeColorSettingOption[] {
  return Object.entries(CONFIG.DND5E.spellcasting).map(([key, config]) => ({
    label: config.label,
    key,
  }));
}
