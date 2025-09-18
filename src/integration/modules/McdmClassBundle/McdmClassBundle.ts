import type { Tidy5eSheetsApi } from 'src/api';
import type { ModuleIntegrationBase } from 'src/integration/integration-classes';
import McdmPowersTab from './McdmPowersTab.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { MCDM_CLASS_BUNDLE_CONSTANTS } from './McdmClassBundleConstants';
import type { CONFIG as OriginalConfig } from 'src/foundry/config.types';
import { CONSTANTS } from 'src/constants';
import { Tidy5eItemSheetQuadrone } from 'src/sheets/quadrone/Tidy5eItemSheetQuadrone.svelte';
import { ItemSheetQuadroneRuntime } from 'src/runtime/item/ItemSheetQuadroneRuntime.svelte';
import McdmPowerSheet from './McdmPowerSheet.svelte';
import McdmPowerDetailsTab from './McdmPowerDetailsTab.svelte';
import { TabDocumentItemTypesRuntime } from 'src/runtime/item/TabDocumentItemTypesRuntime';
import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime.svelte';
import { defaultItemFilters } from 'src/runtime/item/default-item-filters';
import type { ItemFilter } from 'src/runtime/item/item.types';
import type { Item5e } from 'src/types/item.types';
import type { TidySectionBase } from 'src/types/types';

declare global {
  interface CONFIG extends OriginalConfig {
    MCDM: {
      powerOrders: Record<number, string>;
      specialties: Record<string, {
        label: string;
        icon: string;
        fullKey: string;
      }>;
      strainTypes: Record<string, {
        effects: {
          label: string;
          tooltip: string;
        }[];
        header: string;
        label: string;
      }>;
    }
  }
}

export type PowersSection = {
  type: 'powers',
  order?: number | string;
  items: Item5e[];
  uses?: number;
  canCreate: boolean;
} & TidySectionBase;

export class McdmClassBundleModuleIntegration implements ModuleIntegrationBase {
  get moduleId(): string {
    return MCDM_CLASS_BUNDLE_CONSTANTS.MODULE_ID;
  }

  get powersTabId(): string {
    return 'mcdm-powers-tab';
  }

  init(api: Tidy5eSheetsApi): void {
    // Powers tab
    import('./McdmPowersTab.scss');
    const powersTab = new api.models.SvelteTab({
      title: () => FoundryAdapter.localize('TYPES.Item.mcdm-class-bundle.powerPl'),
      tabId: this.powersTabId,
      component: McdmPowersTab,
      iconClass: 'fa-solid fa-brain'
    });
    
    api.registerCharacterTab(powersTab, {
      layout: ['quadrone'],
    });
    api.registerNpcTab(powersTab, {
      layout: ['quadrone']
    });

    // Power item sheet
    const documentSheetConfig = foundry.applications.apps.DocumentSheetConfig;
    documentSheetConfig.registerSheet(
      Item,
      CONSTANTS.DND5E_SYSTEM_ID,
      Tidy5eItemSheetQuadrone,
      {
        types: [MCDM_CLASS_BUNDLE_CONSTANTS.POWER_ITEM_TYPE],
        label: 'TIDY5E.Tidy5eItemSheetQuadrone',
      }
    )
    ItemSheetQuadroneRuntime.registerItemSheet(
      MCDM_CLASS_BUNDLE_CONSTANTS.POWER_ITEM_TYPE,
      {
        component: McdmPowerSheet,
        defaultTabs: [
          CONSTANTS.TAB_DESCRIPTION,
          CONSTANTS.TAB_ITEM_DETAILS,
          CONSTANTS.TAB_ITEM_ACTIVITIES,
          CONSTANTS.TAB_EFFECTS,
        ],
      },
      [
        CONSTANTS.TAB_DESCRIPTION,
        CONSTANTS.TAB_ITEM_ACTIVITIES,
        CONSTANTS.TAB_EFFECTS,
      ]
    );
    ItemSheetQuadroneRuntime.registerTab({
      id: CONSTANTS.TAB_ITEM_DETAILS,
      title: 'DND5E.Details',
      content: {
        component: McdmPowerDetailsTab,
        type: 'svelte',
      },
      layout: 'quadrone',
      types: new Set([MCDM_CLASS_BUNDLE_CONSTANTS.POWER_ITEM_TYPE]),
    });
    TabDocumentItemTypesRuntime.registerTypes({
      tabId: this.powersTabId,
      documentItemTypes: [MCDM_CLASS_BUNDLE_CONSTANTS.POWER_ITEM_TYPE]
    });

    const powerSpecialtyFilters = Object.entries(CONFIG.MCDM.specialties).map<ItemFilter>(
      ([key, specialtyData]) =>
        ({
          name: key,
          predicate: (item) => item.system.specialty === key,
          text: specialtyData.label
        })
    );
    const filterTabs = {
      'DND5E.ItemActivationCost': [
        {
          ...defaultItemFilters.activationCostAction,
          pinnedFilterClass: 'hide-under-400'
        },
        {
          ...defaultItemFilters.activationCostBonus,
          pinnedFilterClass: 'hide-under-400'
        },
        {
          ...defaultItemFilters.activationCostReaction,
          pinnedFilterClass: 'hide-under-400'
        },
        {
          ...defaultItemFilters.concentration
        }
      ],
      'MCDMCB.TALENT.POWERS.SPECIALTIES.Header': powerSpecialtyFilters
    };

    // TODO: expose this via API
    ItemFilterRuntime._documentTabFiltersQuadrone[CONSTANTS.SHEET_TYPE_CHARACTER][this.powersTabId] = filterTabs;
    ItemFilterRuntime._documentTabFiltersQuadrone[CONSTANTS.SHEET_TYPE_NPC][this.powersTabId] = filterTabs;

    const filterPins = new Set(filterTabs['DND5E.ItemActivationCost'].map(i => i.name));
    // TODO: expose this via API
    ItemFilterRuntime.defaultFilterPinsQuadrone[CONSTANTS.SHEET_TYPE_CHARACTER][this.powersTabId] = filterPins;
    ItemFilterRuntime.defaultFilterPinsQuadrone[CONSTANTS.SHEET_TYPE_NPC][this.powersTabId] = filterPins;
  }
}