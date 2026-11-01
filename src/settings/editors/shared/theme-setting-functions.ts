import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { ThemeColorSettingOption } from 'src/settings/settings.types';
import { Theme } from 'src/theme/theme';

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

export function getCompendia(): { text: string; value: string }[] {
  return [...game.packs.values()]
    .map((c) => ({
      // TODO: need a util for getting full folder path
      text: `${[c.folder, ...c.folder.ancestors]
        .reverse()
        .map((f) => f.name)
        .join('/')}/${c.metadata.label}`,
      value: c.metadata.id,
    }))
    .sort((a, b) => a.text.localeCompare(b.text));
}

export function getSupportedDocuments() {
  return [...Theme.supportedDocumentNames]
    .map((s) => ({
      text: FoundryAdapter.localize(`DOCUMENT.${s}`),
      value: s,
    }))
    .sort((a, b) => a.text.localeCompare(b.text));
}
