import type {
  ColumnSpecDocumentTypesToTabs,
  ColumnSpecification,
  ColumnSpecificationCalculatedWidthArgs,
  ConfiguredColumnSpecification,
} from '../types';
import { CONSTANTS } from 'src/constants';
import { getDefaultColumns } from './default-item-columns';
import { foundryCoreSettings } from 'src/settings/settings.svelte';
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

  initOnReady() {
    const columns = getDefaultColumns();
    // TODO: Remove the width callback and have the actions column created when we have access to the configured section.
    const standardItemActionsColumn: ColumnSpecification = {
      ...columns.actions,
      order: 1000,
      priority: 1000,
    };

    const standardContainerColumns = {
      capacityTracker: {
        ...columns.capacityTracker,
        order: 100,
        priority: 200,
      },
      capacityBar: { ...columns.capacityBar, order: 200, priority: 100 },
      actions: standardItemActionsColumn,
    } satisfies Record<string, ColumnSpecification>;

    const standardInventoryColumns = {
      uses: {
        ...columns.uses,
        order: 100,
        priority: 400,
      },
      time: {
        ...columns.time,
        order: 200,
        priority: 500,
      },
      price: {
        ...columns.price,
        order: 300,
        priority: 100,
      },
      quantity: {
        ...columns.quantity,
        order: 400,
        priority: 300,
      },
      weight: {
        ...columns.weight,
        order: 500,
        priority: 200,
      },
      actions: standardItemActionsColumn,
    } satisfies Record<string, ColumnSpecification>;

    const standardWeaponColumns = {
      charges: {
        ...columns.uses,
        order: 100,
        priority: 400,
      },
      time: {
        ...columns.time,
        order: 200,
        priority: 500,
      },
      roll: {
        ...columns.roll,
        order: 300,
        priority: 700,
      },
      formula: {
        ...columns.formula,
        order: 400,
        priority: 600,
      },
      price: {
        ...columns.price,
        order: 500,
        priority: 100,
      },
      quantity: {
        ...columns.quantity,
        order: 600,
        priority: 300,
      },
      weight: {
        ...columns.weight,
        order: 700,
        priority: 200,
      },
      actions: standardInventoryColumns.actions,
    } satisfies Record<string, ColumnSpecification>;

    const standardSpellColumns = {
      components: {
        ...columns.components,
        order: 100,
        priority: 300,
      },
      school: {
        ...columns.school,
        order: 200,
        priority: 100,
      },
      time: {
        ...standardInventoryColumns.time,
        order: 300,
        priority: 400,
      },
      target: {
        ...columns.target,
        order: 400,
        priority: 200,
      },
      range: {
        ...columns.range,
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

    const standardLootColumns = {
      price: {
        ...columns.price,
        order: 100,
        priority: 200,
      },
      quantity: {
        ...columns.quantity,
        order: 200,
        priority: 300,
      },
      weight: {
        ...columns.weight,
        order: 300,
        priority: 100,
      },
      actions: standardInventoryColumns.actions,
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
        [CONSTANTS.TAB_CHARACTER_FEATURES]: {
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: {
            uses: { ...columns.uses, order: 100, priority: 500 },
            time: { ...columns.time, order: 200, priority: 400 },
            recovery: { ...columns.recovery, order: 400, priority: 200 },
            featureSource: {
              ...columns.featureSource,
              order: 500,
              priority: 100,
            },
            actions: { ...columns.actions, order: 1000, priority: 1000 },
          },
        },
      },
      [CONSTANTS.SHEET_TYPE_NPC]: {
        [CONSTANTS.TAB_ACTOR_INVENTORY]: creatureInventorySections,
        [CONSTANTS.TAB_ACTOR_SPELLBOOK]: {
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: standardSpellColumns,
        },
      },
      [CONSTANTS.COLUMN_SPEC_TYPE_KEY_DEFAULT]: {
        [CONSTANTS.TAB_ACTOR_ACTIONS]: {
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: {
            charges: { ...columns.uses, order: 100, priority: 500 },
            roll: { ...columns.roll, order: 200, priority: 400 },
            formula: { ...columns.formula, order: 300, priority: 600 },
            range: {...columns.range, order: 400, priority: 300},
            target: { ...columns.target, order: 500, priority: 200},
            actions: { ...columns.actions, order: 1000, priority: 1000 },
          },
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
    const specs =
      // Section-specific specs for the target sheet type
      this._registeredItemColumns[sheetType]?.[tabId]?.[sectionKey] ??
      // Default specs for tab for the target sheet type
      this._registeredItemColumns[sheetType]?.[tabId]?.[
        CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT
      ] ??
      // Section-specific specs for any sheet type
      this._registeredItemColumns[CONSTANTS.COLUMN_SPEC_TYPE_KEY_DEFAULT]?.[
        tabId
      ]?.[sectionKey] ??
      // Default specs for tab for any sheet type
      this._registeredItemColumns[CONSTANTS.COLUMN_SPEC_TYPE_KEY_DEFAULT]?.[
        tabId
      ]?.[CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT] ??
      [];

    return Object.entries(specs).map(([key, spec]) => ({
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
