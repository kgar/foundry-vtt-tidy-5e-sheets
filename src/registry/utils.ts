import { CONSTANTS } from 'src/constants';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { ActorInspirationRuntime } from 'src/runtime/actor/ActorInspirationRuntime.svelte';
import {
  getEffectiveWorldThemesSetting,
  SettingsProvider,
} from 'src/settings/settings.svelte';
import type { WorldThemeSetting } from 'src/settings/settings.types';
import { getThemeV2, Theme } from 'src/theme/theme';
import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
import type {
  ThemeFilterData,
  ThemeSettings,
} from 'src/theme/theme-quadrone.types';
import type { Item5e } from 'src/types/item.types';
import {
  SYMBOLS,
  type TidyPublicUtils,
  type WorldThemeSettingConfig,
} from 'src/types/registry.types';
import type { Actor5e, InspirationSource } from 'src/types/types';
import { isNil } from 'src/utils/data';
import { debug, error, warn } from 'src/utils/logging';

const getTabIdFromElement: TidyPublicUtils['getTabIdFromElement'] = (
  element,
) => {
  const tabDataEl = element?.closest<HTMLElement>(
    '[data-tab-contents-for], [data-tab-id]',
  );

  return (
    tabDataEl?.getAttribute('data-tab-contents-for') ??
    tabDataEl?.getAttribute('data-tab-id') ??
    null
  );
};

const getTabIdFromEvent: TidyPublicUtils['getTabIdFromEvent'] = (event) => {
  // svelte likes to eschew event.target, but we need it here
  return getTabIdFromElement((event as Event & { target: HTMLElement }).target);
};

const tryGetInspirationSource = async (
  actor: Actor5e,
): Promise<InspirationSource | undefined> => {
  let apiConfig = ActorInspirationRuntime.bankedInspirationConfig;

  if (!!apiConfig?.change && !!apiConfig?.getData) {
    try {
      let data = await apiConfig.getData(actor.sheet, actor);

      return {
        change: async (delta) => {
          await apiConfig.change!(actor.sheet, actor, delta);
          actor.render(); // calling render() on the document itself triggers all subscribing applications to re-render
        },
        value: data?.value ?? 0,
        max: data?.max ?? 0,
      };
    } catch (e) {
      error(
        'An error occurred while attempting to get data for custom inspiration',
        false,
        e,
      );
    }
  }

  if (!SettingsProvider.settings.enableBankedInspiration.get()) {
    return;
  }

  let inspirationSourceId = TidyFlags.inspirationSource.get(actor);
  let inspirationSourceItem = actor.items.get(inspirationSourceId);

  let inspirationSource: InspirationSource | undefined;

  if (inspirationSourceItem?.system?.uses.max) {
    inspirationSource = {
      change: async (delta: number) => {
        let newValue = inspirationSourceItem.system.uses.value + delta;

        const max = inspirationSourceItem.system.uses.max;
        let uses = Math.clamp(0, newValue, max);

        return await inspirationSourceItem.update({
          ['system.uses.spent']: max - uses,
        });
      },
      itemId: inspirationSourceItem.id,
      max: inspirationSourceItem.system.uses.max,
      value: inspirationSourceItem.system.uses.value,
    };
  }

  return inspirationSource;
};

// TODO: Consider moving the implementation details over into the theme script space and simply referencing here.
const initWorldThemes = () => {
  if (!CONFIG.TIDY5E) {
    error(
      `Invalid setup. CONFIG.TIDY5E must be initialized before calling ${initWorldThemes.name}`,
      true,
    );

    return;
  }

  // Reset worldThemes every time.
  CONFIG.TIDY5E.worldThemes = {
    [SYMBOLS.generated]:
      'This code is generated. To ensure external changes are included every time this is generated, use the hook "tidy5e-sheet.worldThemesConfigChanged"',
    [SYMBOLS.readme]:
      'Partitioned, priority-ordered, optionally filtered world theme settings used for determining the appropriate theme to use for a given document sheet.',
  };

  const themes = getEffectiveWorldThemesSetting();

  const prioritizedWorldThemes = Object.values(themes).sort(
    (a, b) => a.sort - b.sort,
  );

  for (const theme of prioritizedWorldThemes) {
    if (
      !theme.documentNames &&
      !theme.types &&
      isNil(theme.filter?.trim(), '')
    ) {
      // The first found world theme default is registered as the
      // world theme default in addition to permuting across
      // document world themes.
      CONFIG.TIDY5E.worldThemeDefault ??= mapToRegisteredTheme({
        ...theme,
        filter: undefined,
      });
    }

    const validDocumentNames =
      theme.documentNames?.filter((name) =>
        Theme.supportedDocumentNames.has(name),
      ) ?? [];

    const targetDocumentNames = validDocumentNames.length
      ? validDocumentNames
      : [...Theme.supportedDocumentNames];

    for (const targetDocumentName of targetDocumentNames) {
      const configDocumentNames = (CONFIG.TIDY5E.worldThemes[
        targetDocumentName
      ] ??= {});

      const documentTypes: string[] =
        foundry.documents[targetDocumentName]?.TYPES ?? [];
      const explicitTypes =
        theme.types?.filter((t) => documentTypes.includes(t)) ?? [];
      const targetTypes = explicitTypes.length ? explicitTypes : documentTypes;

      for (const targetType of targetTypes) {
        const themes = (configDocumentNames[targetType] ??= []);

        try {
          themes.push(mapToRegisteredTheme(theme));
        } catch (e) {
          warn(
            `Unable to parse filter for theme ${theme.name}. It has been excluded.`,
            false,
            {
              error: e,
              ...theme,
            },
          );
        }
      }
    }
  }

  // TODO: Extract to TidyHooks
  Hooks.callAll(
    'tidy5e-sheet.worldThemesConfigChanged',
    CONFIG.TIDY5E.worldThemes,
  );

  TidyHooks.tidy5eSheetsThemeSettingsChanged();
};

function mapToRegisteredTheme(
  theme: WorldThemeSetting,
): import('src/types/registry.types').WorldThemeSettingConfig {
  return {
    id: theme.id,
    name: theme.name,
    settings: theme.settings,
    sort: theme.sort,
    filter: theme.filter ? JSON.parse(theme.filter) : undefined,
  };
}

// TODO: Consider moving the implementation details over into the theme script space and simply referencing here.
const getWorldTheme = (document?: Actor5e | Item5e): ThemeSettings => {
  const worldDefaultSettings = foundry.utils.mergeObject(
    ThemeQuadrone.getDefaultThemeSettings(),
    CONFIG.TIDY5E.worldThemeDefault?.settings ?? {},
  );

  if (!document) {
    return worldDefaultSettings;
  }

  const filterData = CONFIG.TIDY5E.utils.theme.prepareThemeFilterData(document);
  const values = document
    ? Object.values(
        CONFIG.TIDY5E.worldThemes[document.documentName]?.[document.type] ?? [],
      )
    : [];

  for (const entry of values) {
    if (dnd5e.Filter.performCheck(filterData, entry.filter)) {
      return foundry.utils.mergeObject(worldDefaultSettings, entry.settings);
    }
  }

  return worldDefaultSettings;
};

// TODO: Consider moving the implementation details over into the theme script space and simply referencing here.
const prepareThemeFilterData = (
  doc: Actor5e | Item5e | undefined,
): ThemeFilterData => {
  const themeMode = getThemeV2(doc);

  const folder = doc?.folder
    ? '/' +
      [doc.folder, ...doc.folder.ancestors]
        .reverse()
        .map((f) => f.name)
        .join('/')
    : '';

  const data = {
    document: doc,
    folder,
    themeMode,
  };

  debug(`${prepareThemeFilterData.name} result`, data);

  return data;
};

export function getUtils(): TidyPublicUtils {
  return {
    actorInspiration: {
      tryGetInspirationSource,
    },
    getTabIdFromElement,
    getTabIdFromEvent,
    theme: {
      getWorldTheme,
      initWorldThemes,
      prepareThemeFilterData,
    },
  };
}
