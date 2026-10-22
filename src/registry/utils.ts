import { TidyFlags } from 'src/foundry/TidyFlags';
import { ActorInspirationRuntime } from 'src/runtime/actor/ActorInspirationRuntime.svelte';
import { SettingsProvider } from 'src/settings/settings.svelte';
import type { ThemeSettingsV3 } from 'src/theme/theme-quadrone.types';
import type { Item5e } from 'src/types/item.types';
import type { TidyConfig, TidyPublicUtils } from 'src/types/registry.types';
import type { Actor5e, InspirationSource } from 'src/types/types';
import { error } from 'src/utils/logging';

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

const initWorldThemes = () => {
  if (!CONFIG.TIDY5E) {
    error(
      `Invalid setup. CONFIG.TIDY5E must be initialized before calling ${initWorldThemes.name}`,
      true,
    );

    return;
  }

  // const worldThemes = SettingsProvider.
  // TODO: Load up CONFIG.TIDY5E.worldThemes with what is stored in settings
  // TODO: call the Tidy hook `tidy5e-sheet.worldThemesConfig` before applying the end result
  throw Error('not implemented');
};

const getWorldTheme = (doc: Actor5e | Item5e | undefined): ThemeSettingsV3 => {
  throw Error('not implemented');
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
    },
  };
}
