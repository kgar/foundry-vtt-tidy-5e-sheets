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

export type ThemeDocumentTypeNode = {
  documentName: string;
  label: string;
  types: { text: string; value: string }[];
};

export type ThemeDocumentTypeSelection = {
  documentNames?: string[];
  types?: string[];
};

// Foundry's placeholder type and dnd5e's legacy container type.
const hiddenThemeTypes = new Set(['base', 'backpack']);

export function getDocumentTypeTree(): ThemeDocumentTypeNode[] {
  return getSupportedDocuments().map((doc) => {
    const types: string[] = foundry.documents[doc.value].TYPES;

    return {
      documentName: doc.value,
      label: doc.text,
      types: types
        .filter((type) => !hiddenThemeTypes.has(type))
        .map((type) => ({
          text: FoundryAdapter.localize(`TYPES.${doc.value}.${type}`),
          value: type,
        }))
        .sort((a, b) => a.text.localeCompare(b.text)),
    };
  });
}

/**
 * Matches how world themes apply. Nothing selected = every document.
 * No child document selected = all actors/items.
 */
export function getEffectiveTypeSelection(
  node: ThemeDocumentTypeNode,
  selection: ThemeDocumentTypeSelection,
): string[] {
  const allTypes = node.types.map((t) => t.value);
  const documentNames =
    selection.documentNames?.filter((d) =>
      Theme.supportedDocumentNames.has(d),
    ) ?? [];

  if (!documentNames.length) {
    return allTypes;
  }

  if (!documentNames.includes(node.documentName)) {
    return [];
  }

  const types = allTypes.filter((t) => selection.types?.includes(t));
  return types.length ? types : allTypes;
}

export function setEffectiveTypeSelection(
  tree: ThemeDocumentTypeNode[],
  node: ThemeDocumentTypeNode,
  selection: ThemeDocumentTypeSelection,
  selected: string[],
): Required<ThemeDocumentTypeSelection> {
  const result = { documentNames: [] as string[], types: [] as string[] };

  for (const n of tree) {
    const types =
      n.documentName === node.documentName
        ? n.types.map((t) => t.value).filter((t) => selected.includes(t))
        : getEffectiveTypeSelection(n, selection);

    if (!types.length) {
      continue;
    }

    result.documentNames.push(n.documentName);

    if (types.length < n.types.length) {
      result.types.push(...types);
    }
  }

  return result;
}

/** Summarizes which sheet types a theme applies to, e.g. "All Actor (5), Item (14) Sheets". */
export function getAppliesToSummary(
  tree: ThemeDocumentTypeNode[],
  selection: ThemeDocumentTypeSelection,
): string {
  const full: string[] = [];
  const segments: string[] = [];

  for (const node of tree) {
    const selected = getEffectiveTypeSelection(node, selection);

    if (!selected.length) {
      continue;
    }

    if (selected.length === node.types.length) {
      full.push(`${node.label} (${node.types.length})`);
      continue;
    }

    segments.push(
      FoundryAdapter.localize('TIDY5E.COMMON.Theme.AppliesToSome', {
        document: node.label,
        types: node.types
          .filter((t) => selected.includes(t.value))
          .map((t) => t.text)
          .join(', '),
        count: String(selected.length),
      }),
    );
  }

  if (full.length) {
    segments.unshift(
      FoundryAdapter.localize('TIDY5E.COMMON.Theme.AppliesToAll', {
        types: full.join(', '),
      }),
    );
  }

  return segments.join('; ');
}

export function getSupportedDocuments() {
  return [...Theme.supportedDocumentNames]
    .map((s) => ({
      text: FoundryAdapter.localize(`DOCUMENT.${s}`),
      value: s,
    }))
    .sort((a, b) => a.text.localeCompare(b.text));
}
