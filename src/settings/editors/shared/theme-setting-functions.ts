import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { ThemeColorSettingOption } from 'src/settings/settings.types';
import { Theme, getThemeV2 } from 'src/theme/theme';
import { ThemeStylesProvider } from 'src/theme/theme-styles-provider';
import type { ThemeSettings } from 'src/theme/theme.types';

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
    .map((c) => {
      const folders = c.folder ? [c.folder, ...(c.folder.ancestors ?? [])] : [];
      const path = folders
        .reverse()
        .map((f) => f.name)
        .join('/');
      return {
        text: path ? `${path}/${c.metadata.label}` : c.metadata.label,
        value: c.metadata.id,
      };
    })
    .sort((a, b) => a.text.localeCompare(b.text));
}

export type ThemeDocumentTypeOption = {
  text: string;
  value: string;
};

export type ThemeDocumentNameNode = {
  documentName: string;
  label: string;
  types: ThemeDocumentTypeOption[];
};

export type ThemeDocumentFilterSelections = {
  documentNames?: string[];
  types?: string[];
};

// Foundry's placeholder type and dnd5e's legacy container type.
const hiddenThemeTypes = new Set(['base', 'backpack']);

export function getDocumentTypeTree(): ThemeDocumentNameNode[] {
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
  node: ThemeDocumentNameNode,
  selection: ThemeDocumentFilterSelections,
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
  tree: ThemeDocumentNameNode[],
  node: ThemeDocumentNameNode,
  selection: ThemeDocumentFilterSelections,
  selected: string[],
): Required<ThemeDocumentFilterSelections> {
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

/** Localizes a `.one` / `.other` key for `count`. */
export function localizeCount(
  key: string,
  count: number,
  data: Record<string, string> = {},
): string {
  return FoundryAdapter.localize(
    dnd5e.utils.getPluralLocalizationKey(count, (pr: string) => `${key}.${pr}`),
    { ...data, count: dnd5e.utils.formatNumber(count) },
  );
}

/** One phrase per document, e.g. "1 Actor sheet (Non-Player Character)", "all 15 Item sheets". */
export function getAppliesToSegments(
  tree: ThemeDocumentNameNode[],
  selection: ThemeDocumentFilterSelections,
): string[] {
  return tree.flatMap((node) => {
    const selected = getEffectiveTypeSelection(node, selection);

    if (!selected.length) {
      return [];
    }

    if (selected.length === node.types.length) {
      return localizeCount(
        'TIDY5E.COMMON.Theme.Summary.AllSheets',
        node.types.length,
        { document: node.label },
      );
    }

    return localizeCount(
      'TIDY5E.COMMON.Theme.Summary.SomeSheets',
      selected.length,
      {
        document: node.label,
        types: node.types
          .filter((t) => selected.includes(t.value))
          .map((t) => t.text)
          .join(', '),
      },
    );
  });
}

/** Joins summary phrases into a sentence-case line. */
export function joinSummarySegments(segments: string[]): string {
  return segments.join(', ').capitalize();
}

/** Summarizes which sheet types a theme applies to, e.g. "1 Actor sheet (Non-Player Character), all 15 Item sheets". */
export function getAppliesToSummary(
  tree: ThemeDocumentNameNode[],
  selection: ThemeDocumentFilterSelections,
): string {
  return joinSummarySegments(getAppliesToSegments(tree, selection));
}

export type ThemePreview = {
  /** Inline CSS custom properties, the same ones a themed sheet receives. */
  style: string;
  isParchment: boolean;
  themeMode: 'light' | 'dark';
};

/** Styles a theme preview card to get a sense of the sheet style. */
export function getThemePreview(
  settings: Partial<ThemeSettings>,
  themeMode?: string,
): ThemePreview {
  // Fill out all the necessary style fields by falling back to the default
  // theme settings if one isn't set in the Theme.
  const effectiveStyles = Theme.getDefaultThemeSettings(
    Object.fromEntries(
      Object.entries(settings).filter(([, value]) => value !== undefined),
    ),
  );

  const style = ThemeStylesProvider.create(effectiveStyles, {})
    .flatMap((declaration) => declaration.ruleset)
    .filter(
      (rule) => rule.property !== ThemeStylesProvider.worldSettingIdentifierKey,
    )
    .map((rule) => `${rule.property}: ${rule.value}`)
    .join('; ');

  // Themed = dark. Parchment (which basic includes) = light/dark.
  const isParchment =
    !effectiveStyles.useHeaderBackground || effectiveStyles.useBasicTheme;
  const mode = isParchment ? themeMode || getThemeV2() : 'dark';

  return {
    style,
    isParchment,
    themeMode: mode === 'dark' ? 'dark' : 'light',
  };
}

export function getSupportedDocuments() {
  return [...Theme.supportedDocumentNames]
    .map((s) => ({
      text: FoundryAdapter.localize(`DOCUMENT.${s}`),
      value: s,
    }))
    .sort((a, b) => a.text.localeCompare(b.text));
}
