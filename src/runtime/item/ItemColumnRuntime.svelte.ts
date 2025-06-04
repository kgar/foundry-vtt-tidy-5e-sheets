import type { TidySectionBase } from 'src/types/types';
import type {
  ColumnSpecDocumentTypesToTabs,
  ColumnSpecification,
  ColumnSpecificationSchematics,
  SectionColumnSpecificationSchematics,
  SheetColumnSpecificationSchematics,
  TabColumnSpecificationSchematics,
} from './item.types';
import { CONSTANTS } from 'src/constants';
import ItemQuantityColumn from 'src/sheets/quadrone/item/columns/ItemQuantityColumn.svelte';
import InlineCapacityBarColumn from 'src/sheets/quadrone/item/columns/InlineCapacityBarColumn.svelte';
import ItemPriceColumn from 'src/sheets/quadrone/item/columns/ItemPriceColumn.svelte';
import ItemChargesColumn from 'src/sheets/quadrone/item/columns/ItemChargesColumn.svelte';
import ItemWeightColumn from 'src/sheets/quadrone/item/columns/ItemWeightColumn.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import InlineCapacityTrackerColumn from 'src/sheets/quadrone/item/columns/InlineCapacityTrackerColumn.svelte';
import ItemTimeColumn from 'src/sheets/quadrone/item/columns/ItemTimeColumn.svelte';
import ItemRollColumn from 'src/sheets/quadrone/item/columns/ItemRollColumn.svelte';
import ItemDamageFormulasColumn from 'src/sheets/quadrone/item/columns/ItemDamageFormulasColumn.svelte';

const ENTRY_NAME_MIN_WIDTH_PX = 200;

class ItemColumnRuntime {
  /**
   * The global column specifications for all sheet tab sections.
   * This object should be updated with any world settings for user-defined default section config.
   * Likewise, any API calls that intend to adjust section column selection
   * defaults for all eligible content would go here.
   */
  _registeredItemColumns: ColumnSpecDocumentTypesToTabs = $state({});
  #uiScale = $state(1);
  #minWidth = $derived(this.#uiScale * ENTRY_NAME_MIN_WIDTH_PX);

  initOnReady() {
    const standardContainerColumns = {
      capacityTracker: {
        cellContent: {
          type: 'component',
          component: InlineCapacityTrackerColumn,
        },
        width: 112,
        cellClasses: 'text-cell',
        order: 100,
        priority: 100,
      },
      capacityBar: {
        cellContent: {
          type: 'component',
          component: InlineCapacityBarColumn,
        },
        width: 112,
        cellClasses: 'text-cell',
        order: 200,
        priority: 200,
      },
    } satisfies Record<string, ColumnSpecification>;

    const standardInventoryColumns = {
      charges: {
        headerContent: {
          type: 'html',
          html: FoundryAdapter.localize('DND5E.Charges'),
        },
        cellContent: {
          type: 'component',
          component: ItemChargesColumn,
        },
        width: 80,
        cellClasses: 'inline-uses',
        order: 100,
        priority: 300,
      },
      time: {
        headerContent: {
          type: 'html',
          html: FoundryAdapter.localize('DND5E.SpellHeader.Time'),
        },
        cellContent: {
          type: 'component',
          component: ItemTimeColumn,
        },
        width: 80,
        order: 200,
        priority: 500,
      },
      price: {
        headerContent: {
          type: 'html',
          html: FoundryAdapter.localize('DND5E.Price'),
        },
        cellContent: {
          type: 'component',
          component: ItemPriceColumn,
        },
        width: 88,
        order: 300,
        priority: 100,
      },
      quantity: {
        headerContent: {
          type: 'html',
          html: FoundryAdapter.localize('DND5E.Quantity'),
        },
        cellContent: {
          type: 'component',
          component: ItemQuantityColumn,
        },
        width: 80,
        order: 400,
        priority: 400,
      },
      weight: {
        headerContent: {
          type: 'html',
          html: FoundryAdapter.localize('DND5E.Weight'),
        },
        cellContent: {
          type: 'component',
          component: ItemWeightColumn,
        },
        width: 80,
        order: 500,
        priority: 200,
      },
    } satisfies Record<string, ColumnSpecification>;

    const standardWeaponColumns = {
      charges: {
        ...standardInventoryColumns.charges,
        order: 100,
        priority: 300,
      },
      time: {
        ...standardInventoryColumns.time,
        order: 200,
        priority: 500,
      },
      roll: {
        headerContent: {
          type: 'html',
          html: FoundryAdapter.localize('DND5E.SpellHeader.Roll'),
        },
        cellContent: {
          type: 'component',
          component: ItemRollColumn,
        },
        order: 300,
        width: 40,
        priority: 700,
      },
      formula: {
        headerContent: {
          type: 'html',
          html: FoundryAdapter.localize('DND5E.SpellHeader.Formula'),
        },
        cellContent: {
          type: 'component',
          component: ItemDamageFormulasColumn,
        },
        order: 400,
        width: 80,
        priority: 600,
      },
      price: {
        ...standardInventoryColumns.price,
        order: 500,
        priority: 100,
      },
      quantity: {
        ...standardInventoryColumns.quantity,
        order: 600,
        priority: 400,
      },
      weight: {
        ...standardInventoryColumns.weight,
        order: 700,
        priority: 200,
      },
    } satisfies Record<string, ColumnSpecification>;

    this._registeredItemColumns = {
      [CONSTANTS.SHEET_TYPE_CONTAINER]: {
        [CONSTANTS.TAB_CONTAINER_CONTENTS]: {
          [CONSTANTS.ITEM_TYPE_CONTAINER]: standardContainerColumns,
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: standardInventoryColumns,
        },
      },
      [CONSTANTS.SHEET_TYPE_CHARACTER]: {
        [CONSTANTS.TAB_ACTOR_INVENTORY]: {
          [CONSTANTS.ITEM_TYPE_WEAPON]: standardWeaponColumns,
          [CONSTANTS.ITEM_TYPE_CONTAINER]: standardContainerColumns,
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: standardInventoryColumns,
        },
      },
    };

    this.refreshUiScale();

    Hooks.on('clientSettingChanged', () => {
      this.refreshUiScale();
    });
  }

  refreshUiScale() {
    const newScale = game.settings.get('core', 'uiConfig')?.uiScale ?? 1;
    if (newScale !== this.#uiScale) {
      this.#uiScale = newScale;
    }
  }

  get minWidth() {
    return this.#minWidth;
  }

  columnSchematics = $derived.by<SheetColumnSpecificationSchematics>(() => {
    let sheetSchematics: SheetColumnSpecificationSchematics = {};

    for (let [sheetType, tabSpecs] of Object.entries(
      this._registeredItemColumns
    )) {
      const tabSchematics: TabColumnSpecificationSchematics = {};
      sheetSchematics[sheetType] = tabSchematics;

      for (let [tabId, sectionSpecs] of Object.entries(tabSpecs)) {
        const sectionSchematics: SectionColumnSpecificationSchematics = {};
        tabSchematics[tabId] = sectionSchematics;

        for (let [sectionKey, entryTypeSpecs] of Object.entries(sectionSpecs)) {
          sectionSchematics[sectionKey] = {
            ordered: Object.entries(entryTypeSpecs)
              .map((x) => ({
                ...x[1],
                key: x[0],
              }))
              .sort((a, b) => a.order - b.order),
            prioritized: Object.entries(entryTypeSpecs)
              .map((x) => ({
                ...x[1],
                key: x[0],
              }))
              .sort((a, b) => b.priority - a.priority),
          };
        }
      }
    }

    return sheetSchematics;
  });

  getSheetTabSectionColumnsQuadrone(
    document: any,
    tabId: string,
    section: TidySectionBase
  ): ColumnSpecificationSchematics {
    const sections = this.columnSchematics[document.type]?.[tabId];
    var specs = sections?.[section.key] ??
      sections?.[CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT] ?? {
        ordered: [],
        prioritized: [],
      };

    return specs;
  }

  determineHiddenColumns(
    inlineSize: number,
    schematics: ColumnSpecificationSchematics
  ): Set<string> {
    console.log('determining hidden columns');

    let available = inlineSize;

    let toHide = new Set<string>();

    for (const f of schematics.prioritized) {
      const scaledWidth = f.width * this.#uiScale;

      available -= scaledWidth;

      if (available < this.#minWidth) {
        toHide.add(f.key);
      }
    }

    return toHide;
  }
}

const singleton = new ItemColumnRuntime();

export default singleton;
