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
import { buildMcdmPowersSettingsTab } from './settings/McdmPowersSettingsTab';
import { loadConditionalStyles } from 'src/utils/css-loading';
import type { Tidy5eSheetsApi } from 'src/api/Tidy5eSheetsApi';
import type {
  ConfiguredColumnSpecification,
  ItemColumnSpec,
  SectionColumnSpecifications,
} from 'src/types/columns.types';
import HtmlColumn from 'src/sheets/quadrone/item/columns/HtmlColumn.svelte';
import ItemUsesColumn from 'src/sheets/quadrone/item/columns/ItemUsesColumn.svelte';
import McdmPowerSpecialtyColumn from './McdmPowerSpecialtyColumn.svelte';
import ItemTimeColumn from 'src/sheets/quadrone/item/columns/ItemTimeColumn.svelte';
import ItemDamageFormulasColumn from 'src/sheets/quadrone/item/columns/ItemDamageFormulasColumn.svelte';
import ItemTargetColumn from 'src/sheets/quadrone/item/columns/ItemTargetColumn.svelte';
import ItemRangeColumn from 'src/sheets/quadrone/item/columns/ItemRangeColumn.svelte';
import ItemRollColumn from 'src/sheets/quadrone/item/columns/ItemRollColumn.svelte';

declare global {
  interface CONFIG extends OriginalConfig {
    MCDM: {
      powerOrders: Record<number, string>;
      specialties: Record<
        string,
        {
          label: string;
          icon: string;
          fullKey: string;
        }
      >;
      strainTypes: Record<
        string,
        {
          effects: {
            label: string;
            tooltip: string;
          }[];
          header: string;
          label: string;
        }
      >;
    };
  }
}

export type PowersSection = {
  type: 'powers';
  order?: number | string;
  items: Item5e[];
  uses?: number;
  canCreate: boolean;
  columns: SectionColumnSpecifications<
    ConfiguredColumnSpecification<ItemColumnSpec>
  >;
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
    import('./McdmPowersTab.less');
    loadConditionalStyles('McdmPowersTab');

    const powersTab = new api.models.SvelteTab({
      title: () =>
        FoundryAdapter.localize('TYPES.Item.mcdm-class-bundle.powerPl'),
      tabId: this.powersTabId,
      component: McdmPowersTab,
      iconClass: 'fa-solid fa-brain',
      tabOptionsBuilder: buildMcdmPowersSettingsTab,
    });

    api.registerCharacterTab(powersTab, {
      layout: ['quadrone'],
    });
    api.registerNpcTab(powersTab, {
      layout: ['quadrone'],
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
      },
    );
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
      ],
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
      documentItemTypes: [MCDM_CLASS_BUNDLE_CONSTANTS.POWER_ITEM_TYPE],
    });

    const powerSpecialtyFilters = Object.entries(
      CONFIG.MCDM.specialties,
    ).map<ItemFilter>(([key, specialtyData]) => ({
      name: key,
      predicate: (item) => item.system.specialty === key,
      text: specialtyData.label,
    }));
    const filterTabs = {
      'DND5E.ItemActivationCost': [
        {
          ...defaultItemFilters.activationCostAction,
          pinnedFilterClass: 'hide-under-400',
        },
        {
          ...defaultItemFilters.activationCostBonus,
          pinnedFilterClass: 'hide-under-400',
        },
        {
          ...defaultItemFilters.activationCostReaction,
          pinnedFilterClass: 'hide-under-400',
        },
        {
          ...defaultItemFilters.concentration,
        },
      ],
      'MCDMCB.TALENT.POWERS.SPECIALTIES.Header': powerSpecialtyFilters,
    };

    // TODO: expose this via API
    ItemFilterRuntime._documentTabFiltersQuadrone[
      CONSTANTS.SHEET_TYPE_CHARACTER
    ][this.powersTabId] = filterTabs;
    ItemFilterRuntime._documentTabFiltersQuadrone[CONSTANTS.SHEET_TYPE_NPC][
      this.powersTabId
    ] = filterTabs;

    const filterPins = new Set(
      filterTabs['DND5E.ItemActivationCost'].map((i) => i.name),
    );
    // TODO: expose this via API
    ItemFilterRuntime.defaultFilterPinsQuadrone[CONSTANTS.SHEET_TYPE_CHARACTER][
      this.powersTabId
    ] = filterPins;
    ItemFilterRuntime.defaultFilterPinsQuadrone[CONSTANTS.SHEET_TYPE_NPC][
      this.powersTabId
    ] = filterPins;

    // Column Registration
    const columns = CONFIG.TIDY5E.features.columns.customItem;

    columns[`${this.moduleId}-powers-concentration`] = {
      cell: {
        component: HtmlColumn,
        props: (args) => {
          const html = !args.rowDocument.requiresConcentration
            ? ''
            : `
              <span class="concentration-icon">
                <dnd5e-icon src="systems/dnd5e/icons/svg/statuses/concentrating.svg">
              </span>
            `;

          return { html };
        },
      },
      widthRems: 2,
    } satisfies ItemColumnSpec<typeof HtmlColumn, typeof HtmlColumn>;
    columns[`${this.moduleId}-powers-uses`] = {
      header: {
        component: HtmlColumn,
        props: () => ({ html: FoundryAdapter.localize('DND5E.Uses') }),
      },
      cell: {
        component: ItemUsesColumn,
        props: (args) => ({
          rowDocument: args.rowDocument,
        }),
        classes: 'inline-uses',
      },
      widthRems: 4,
    } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemUsesColumn>;
    columns[`${this.moduleId}-powers-specialty`] = {
      header: {
        component: HtmlColumn,
        props: () => ({ html: FoundryAdapter.localize('DND5E.Uses') }),
      },
      cell: {
        component: McdmPowerSpecialtyColumn,
        props: (args) => ({
          rowDocument: args.rowDocument,
        }),
      },
      widthRems: 3.5,
    } satisfies ItemColumnSpec<
      typeof HtmlColumn,
      typeof McdmPowerSpecialtyColumn
    >;
    columns[`${this.moduleId}-powers-time`] = {
      header: {
        component: HtmlColumn,
        props: () => ({
          html: FoundryAdapter.localize('DND5E.SpellHeader.Time'),
        }),
      },
      cell: {
        component: ItemTimeColumn,
        props: (args) => ({
          rowDocument: args.rowDocument,
        }),
      },
      widthRems: 4,
    } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemTimeColumn>;
    columns[`${this.moduleId}-powers-formula`] = {
      header: {
        component: HtmlColumn,
        props: () => ({
          html: FoundryAdapter.localize('DND5E.SpellHeader.Formula'),
        }),
      },
      cell: {
        component: ItemDamageFormulasColumn,
        props: (args) => ({
          rowContext: args.rowContext,
          rowDocument: args.rowDocument,
        }),
      },
      widthRems: 5,
    } satisfies ItemColumnSpec<
      typeof HtmlColumn,
      typeof ItemDamageFormulasColumn
    >;
    columns[`${this.moduleId}-powers-target`] = {
      header: {
        component: HtmlColumn,
        props: () => ({
          html: FoundryAdapter.localize('DND5E.SpellHeader.Target'),
        }),
      },
      cell: {
        component: ItemTargetColumn,
        props: (args) => ({ rowDocument: args.rowDocument }),
      },
      widthRems: 5,
    } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemTargetColumn>;
    columns[`${this.moduleId}-powers-range`] = {
      header: {
        component: HtmlColumn,
        props: () => ({
          html: FoundryAdapter.localize('DND5E.SpellHeader.Range'),
        }),
      },
      cell: {
        component: ItemRangeColumn,
        props: (args) => ({ rowDocument: args.rowDocument }),
      },
      widthRems: 5,
    } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemRangeColumn>;
    columns[`${this.moduleId}-powers-roll`] = {
      header: {
        component: HtmlColumn,
        props: () => ({
          html: FoundryAdapter.localize('DND5E.SpellHeader.Roll'),
        }),
      },
      cell: {
        component: ItemRollColumn,
        props: (args) => ({
          rowContext: args.rowContext,
          rowDocument: args.rowDocument,
        }),
      },
      widthRems: 3.125,
    } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemRollColumn>;

    // Column Partitioning

    // TODO: CONFIG.TIDY5E.utils.setColumnPartition(myPartitionConfig, { tabId: this.powersTabId });
    const defaultTypePartitions = (CONFIG.TIDY5E.partitions.columns.customItem[
      CONSTANTS.COLUMN_SPEC_TYPE_KEY_DEFAULT
    ] ??= {});

    const powersTabPartitions = (defaultTypePartitions[this.powersTabId] ??=
      {});

    powersTabPartitions[CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT] = {
      [`${this.moduleId}-powers-concentration`]: { order: 100, priority: 900 },
      [`${this.moduleId}-powers-uses`]: { order: 200, priority: 200 },
      [`${this.moduleId}-powers-specialty`]: { order: 300, priority: 100 },
      [`${this.moduleId}-powers-time`]: { order: 400, priority: 500 },
      [`${this.moduleId}-powers-formula`]: { order: 500, priority: 300 },
      [`${this.moduleId}-powers-target`]: { order: 600, priority: 400 },
      [`${this.moduleId}-powers-range`]: { order: 700, priority: 600 },
      [`${this.moduleId}-powers-roll`]: { order: 800, priority: 700 },
    };
  }
}
