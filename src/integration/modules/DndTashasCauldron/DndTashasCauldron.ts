import type { Tidy5eSheetsApi } from 'src/api';
import { CONSTANTS } from 'src/constants';
import type { ModuleIntegrationBase } from 'src/integration/integration-classes';
import { ItemSheetRuntime } from 'src/runtime/item/ItemSheetRuntime';
import { settings } from 'src/settings/settings.svelte';
import { Tidy5eItemSheetQuadrone } from 'src/sheets/quadrone/Tidy5eItemSheetQuadrone.svelte';
import TattooSheetQuadrone from './TattooSheetQuadrone.svelte';
import itemSheetTabs from 'src/runtime/item/item-sheet-tabs';
import ItemTattooDetailsQuadroneTab from './ItemTattooDetailsQuadroneTab.svelte';
import type { CONFIG as OriginalConfig } from 'src/foundry/config.types';

declare global {
  interface CONFIG extends OriginalConfig {
    TCOE: {
      spellwrought: Array<{
        rarity: string;
        mod: number;
        dc: number;
        attack: number;
      }>;
      tattooTypes: {
        permanent: {
          label: string;
        };
        spellwrought: {
          label: string;
        };
      } & Record<string, { label: string }>;
    };
  }
}

export class DndTashasCauldronModuleIntegration
  implements ModuleIntegrationBase
{
  static ITEM_TYPE_TATTOO = 'dnd-tashas-cauldron.tattoo';

  static get tcoeTattooTypes() {
    return CONFIG.TCOE.tattooTypes;
  }

  static get tcoeSpellwroughtOptions() {
    return CONFIG.TCOE.spellwrought.length;
  }

  get moduleId(): string {
    return 'dnd-tashas-cauldron';
  }

  init(api: Tidy5eSheetsApi): void {
    if (settings.value.truesight) {
      const documentSheetConfig =
        game.release.generation < 13
          ? DocumentSheetConfig
          : foundry.applications.apps.DocumentSheetConfig;

      // Register the sheet
      documentSheetConfig.registerSheet(
        Item,
        CONSTANTS.DND5E_SYSTEM_ID,
        Tidy5eItemSheetQuadrone,
        {
          types: [DndTashasCauldronModuleIntegration.ITEM_TYPE_TATTOO],
          label: 'TIDY5E.Tidy5eItemSheetQuadrone',
        }
      );

      // Establish tattoo sheet tabs
      ItemSheetRuntime.quadroneSheets[
        DndTashasCauldronModuleIntegration.ITEM_TYPE_TATTOO
      ] = {
        Sheet: TattooSheetQuadrone,
        defaultTabs: () => [
          itemSheetTabs.quadroneDescriptions,
          {
            id: CONSTANTS.TAB_ITEM_DETAILS_ID,
            title: 'DND5E.Details',
            content: {
              component: ItemTattooDetailsQuadroneTab,
              type: 'svelte',
            },
          },
          itemSheetTabs.quadroneActivities,
          itemSheetTabs.quadroneEffects,
        ],
      };
    }
  }
}
