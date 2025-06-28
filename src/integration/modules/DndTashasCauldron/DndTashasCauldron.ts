import type { Tidy5eSheetsApi } from 'src/api';
import { CONSTANTS } from 'src/constants';
import type { ModuleIntegrationBase } from 'src/integration/integration-classes';
import { ItemSheetQuadroneRuntime } from 'src/runtime/item/ItemSheetQuadroneRuntime.svelte';
import { Tidy5eItemSheetQuadrone } from 'src/sheets/quadrone/Tidy5eItemSheetQuadrone.svelte';
import TattooSheetQuadrone from './TattooSheetQuadrone.svelte';
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
    const documentSheetConfig = foundry.applications.apps.DocumentSheetConfig;

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

    // Establish tattoo sheet and custom detail tab

    ItemSheetQuadroneRuntime.registerItemSheet(
      DndTashasCauldronModuleIntegration.ITEM_TYPE_TATTOO,
      {
        component: TattooSheetQuadrone,
        defaultTabs: [
          CONSTANTS.TAB_ITEM_DESCRIPTION,
          CONSTANTS.TAB_ITEM_DETAILS,
          CONSTANTS.TAB_ITEM_ACTIVITIES,
          CONSTANTS.TAB_EFFECTS,
        ],
      },
      [
        CONSTANTS.TAB_ITEM_DESCRIPTION,
        CONSTANTS.TAB_ITEM_ACTIVITIES,
        CONSTANTS.TAB_EFFECTS,
      ]
    );

    ItemSheetQuadroneRuntime.registerTab({
      id: CONSTANTS.TAB_ITEM_DETAILS,
      title: 'DND5E.Details',
      content: {
        component: ItemTattooDetailsQuadroneTab,
        type: 'svelte',
      },
      layout: 'quadrone',
      types: new Set([DndTashasCauldronModuleIntegration.ITEM_TYPE_TATTOO]),
    });
  }
}
