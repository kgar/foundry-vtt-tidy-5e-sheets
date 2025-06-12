import type {
  ColumnSpecDocumentTypesToTabs,
  ColumnSpecification,
  ColumnSpecificationCalculatedWidthArgs,
  ConfiguredColumnSpecification,
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
import DocumentActionsColumn from 'src/sheets/quadrone/item/columns/DocumentActionsColumn.svelte';
import ItemActionsColumnHeader from 'src/sheets/quadrone/item/columns/ItemActionsColumnHeader.svelte';
import ItemSpellComponentsColumn from 'src/sheets/quadrone/item/columns/ItemSpellComponentsColumn.svelte';
import ItemSpellSchoolColumn from 'src/sheets/quadrone/item/columns/ItemSpellSchoolColumn.svelte';
import ItemTargetColumn from 'src/sheets/quadrone/item/columns/ItemTargetColumn.svelte';
import ItemRangeColumn from 'src/sheets/quadrone/item/columns/ItemRangeColumn.svelte';
import { foundryCoreSettings, settings } from 'src/settings/settings.svelte';
import type { ColumnsLoadout } from './ColumnsLoadout.svelte';

const ENTRY_NAME_MIN_WIDTH_REMS = 12.5;

class ItemColumnRuntime {
  /**
   * The global column specifications for all sheet tab sections.
   * This object should be updated with any world settings for user-defined default section config.
   * Likewise, any API calls that intend to adjust section column selection
   * defaults for all eligible content would go here.
   */
  _registeredItemColumns: ColumnSpecDocumentTypesToTabs = $state({});

  // TODO: Switch to rems
  #minWidthRems = $derived(ENTRY_NAME_MIN_WIDTH_REMS);

  // TODO: derive the PX measurement based on core font size
  #minWidthPx = $derived(
    foundryCoreSettings.value.fontSizePx * this.#minWidthRems
  );

  initOnReady() {
    // TODO: Remove the width callback and have the actions column created when we have access to the configured section.
    const standardItemActionsColumn: ColumnSpecification = {
      headerClasses: 'header-cell-actions',
      headerContent: {
        type: 'component',
        component: ItemActionsColumnHeader,
      },
      cellClasses: 'tidy-table-actions',
      cellContent: {
        type: 'component',
        component: DocumentActionsColumn,
      },
      widthRems: (section: ColumnSpecificationCalculatedWidthArgs) => {
        let paddingX = 0.1875;
        let buttonWidth = 1.5;
        return buttonWidth * section.rowActions.length + paddingX;
      },
      order: 1000,
      priority: 1000,
    };

    const standardContainerColumns = {
      capacityTracker: {
        cellContent: {
          type: 'component',
          component: InlineCapacityTrackerColumn,
        },
        widthRems: 7,
        cellClasses: 'text-cell',
        order: 100,
        priority: 100,
      },
      capacityBar: {
        cellContent: {
          type: 'component',
          component: InlineCapacityBarColumn,
        },
        widthRems: 7,
        cellClasses: 'text-cell',
        order: 200,
        priority: 200,
      },
      actions: standardItemActionsColumn,
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
        widthRems: 5,
        cellClasses: 'inline-uses',
        order: 100,
        priority: 400,
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
        widthRems: 5,
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
        widthRems: 5.5,
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
        widthRems: 5,
        order: 400,
        priority: 300,
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
        widthRems: 5,
        order: 500,
        priority: 200,
      },
      actions: standardItemActionsColumn,
    } satisfies Record<string, ColumnSpecification>;

    const standardWeaponColumns = {
      charges: {
        ...standardInventoryColumns.charges,
        order: 100,
        priority: 400,
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
        widthRems: 3.125,
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
        widthRems: 5,
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
        priority: 300,
      },
      weight: {
        ...standardInventoryColumns.weight,
        order: 700,
        priority: 200,
      },
      actions: standardInventoryColumns.actions,
    } satisfies Record<string, ColumnSpecification>;

    const standardLootColumns = {
      price: {
        ...standardInventoryColumns.price,
        order: 100,
        priority: 200,
      },
      quantity: {
        ...standardInventoryColumns.quantity,
        order: 200,
        priority: 300,
      },
      weight: {
        ...standardInventoryColumns.weight,
        order: 300,
        priority: 100,
      },
      actions: standardInventoryColumns.actions,
    } satisfies Record<string, ColumnSpecification>;

    const standardSpellColumns = {
      components: {
        headerContent: {
          type: 'html',
          html: FoundryAdapter.localize('DND5E.Components'),
        },
        cellContent: {
          type: 'component',
          component: ItemSpellComponentsColumn,
        },
        widthRems: 5.625,
        order: 100,
        priority: 300,
      },
      school: {
        headerContent: {
          type: 'html',
          html: `<i class="fa-solid fa-cauldron" data-tooltip="DND5E.SpellSchool"></i>`,
        },
        cellContent: {
          type: 'component',
          component: ItemSpellSchoolColumn,
        },
        widthRems: 2.5,
        order: 200,
        priority: 100,
      },
      time: {
        ...standardInventoryColumns.time,
        order: 300,
        priority: 400,
      },
      target: {
        headerContent: {
          type: 'html',
          html: FoundryAdapter.localize('DND5E.SpellHeader.Target'),
        },
        cellContent: {
          type: 'component',
          component: ItemTargetColumn,
        },
        widthRems: 5,
        order: 400,
        priority: 200,
      },
      range: {
        headerContent: {
          type: 'html',
          html: FoundryAdapter.localize('DND5E.SpellHeader.Range'),
        },
        cellContent: {
          type: 'component',
          component: ItemRangeColumn,
        },
        widthRems: 5,
        order: 500,
        priority: 500,
      },
      roll: {
        ...standardWeaponColumns.roll,
        order: 600,
        priority: 600,
      },
      actions: standardItemActionsColumn,
    } satisfies Record<string, ColumnSpecification>;

    const creatureInventorySections = {
      [CONSTANTS.ITEM_TYPE_WEAPON]: standardWeaponColumns,
      [CONSTANTS.ITEM_TYPE_CONTAINER]: standardContainerColumns,
      [CONSTANTS.ITEM_TYPE_LOOT]: standardLootColumns,
      [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: standardInventoryColumns,
    };

    this._registeredItemColumns = {
      [CONSTANTS.SHEET_TYPE_CONTAINER]: {
        [CONSTANTS.TAB_CONTAINER_CONTENTS]: {
          [CONSTANTS.ITEM_TYPE_CONTAINER]: standardContainerColumns,
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: standardInventoryColumns,
        },
      },
      [CONSTANTS.SHEET_TYPE_CHARACTER]: {
        [CONSTANTS.TAB_ACTOR_INVENTORY]: creatureInventorySections,
        [CONSTANTS.TAB_ACTOR_SPELLBOOK]: {
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: standardSpellColumns,
        },
      },
      [CONSTANTS.SHEET_TYPE_NPC]: {
        [CONSTANTS.TAB_ACTOR_INVENTORY]: creatureInventorySections,
        [CONSTANTS.TAB_ACTOR_SPELLBOOK]: {
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: standardSpellColumns,
        },
      },
    };
  }

  getConfiguredColumnSpecifications(
    sheetType: string,
    tabId: string,
    sectionKey: string,
    args: ColumnSpecificationCalculatedWidthArgs
  ): ConfiguredColumnSpecification[] {
    const tab = this._registeredItemColumns[sheetType]?.[tabId];
    let columnKeysToColumnSpecs =
      tab?.[sectionKey] ??
      tab?.[CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT] ??
      [];
    return Object.entries(columnKeysToColumnSpecs).map(([key, spec]) => ({
      key,
      ...spec,
      widthRems:
        typeof spec.widthRems === 'number'
          ? spec.widthRems
          : spec.widthRems(args),
    }));
  }

  determineHiddenColumns(
    inlineSizePx: number,
    schematics: ColumnsLoadout
  ): Set<string> {

    let availableRems = inlineSizePx / foundryCoreSettings.value.fontSizePx;

    let toHide = new Set<string>();

    for (const col of schematics.prioritized) {
      availableRems -= col.widthRems;

      if (availableRems < this.#minWidthRems) {
        toHide.add(col.key);
      }
    }

    return toHide;
  }
}

const singleton = new ItemColumnRuntime();

export default singleton;
