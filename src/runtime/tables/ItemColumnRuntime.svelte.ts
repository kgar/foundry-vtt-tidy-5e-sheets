import type {
  ColumnSpecDocumentTypesToTabs,
  ColumnSpecification,
} from '../types';
import { CONSTANTS } from 'src/constants';
import { getDefaultItemColumns } from './default-item-columns';
import { TableColumnRuntimeBase } from './TableColumnRuntimeBase.svelte';

class ItemColumnRuntimeImpl extends TableColumnRuntimeBase {
  getDefaultColumns(): ColumnSpecDocumentTypesToTabs {
    const columns = getDefaultItemColumns();

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
      uses: {
        ...columns.uses,
        order: 100,
        priority: 200,
      },
      components: {
        ...columns.components,
        order: 100,
        priority: 400,
      },
      school: {
        ...columns.school,
        order: 200,
        priority: 100,
      },
      time: {
        ...standardInventoryColumns.time,
        order: 300,
        priority: 500,
      },
      target: {
        ...columns.target,
        order: 400,
        priority: 300,
      },
      range: {
        ...columns.range,
        order: 500,
        priority: 600,
      },
      roll: {
        ...standardWeaponColumns.roll,
        order: 600,
        priority: 700,
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

    const standardConsumableColumns = {
      uses: {
        ...columns.uses,
        order: 100,
        priority: 300,
      },
      time: {
        ...columns.time,
        order: 200,
        priority: 500,
      },
      price: {
        ...columns.price,
        order: 300,
        priority: 200,
      },
      quantity: {
        ...columns.quantity,
        order: 400,
        priority: 400,
      },
      weight: {
        ...columns.weight,
        order: 500,
        priority: 100,
      },
      actions: standardItemActionsColumn,
    } satisfies Record<string, ColumnSpecification>;

    const creatureInventorySections = {
      [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: standardInventoryColumns,
      [CONSTANTS.ITEM_TYPE_CONSUMABLE]: standardConsumableColumns,
      [CONSTANTS.ITEM_TYPE_CONTAINER]: standardContainerColumns,
      [CONSTANTS.ITEM_TYPE_LOOT]: standardLootColumns,
      [CONSTANTS.ITEM_TYPE_WEAPON]: standardWeaponColumns,
    };

    return {
      [CONSTANTS.SHEET_TYPE_CONTAINER]: {
        [CONSTANTS.TAB_CONTAINER_CONTENTS]: {
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: standardInventoryColumns,
          [CONSTANTS.ITEM_TYPE_CONSUMABLE]: standardConsumableColumns,
          [CONSTANTS.ITEM_TYPE_CONTAINER]: standardContainerColumns,
          [CONSTANTS.ITEM_TYPE_LOOT]: standardLootColumns,
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
        [CONSTANTS.TAB_NPC_STATBLOCK]: {
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: {
            recovery: { ...columns.recovery, order: 100, priority: 400 },
            uses: { ...columns.uses, order: 200, priority: 600 },
            roll: { ...columns.roll, order: 300, priority: 800 },
            formula: { ...columns.formula, order: 400, priority: 700 },
            range: { ...columns.range, order: 500, priority: 300 },
            target: { ...columns.target, order: 600, priority: 800 },
            time: { ...columns.time, order: 700, priority: 800 },
            actions: { ...columns.actions, order: 1000, priority: 1000 },
          },
        },
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
            range: { ...columns.range, order: 400, priority: 300 },
            target: { ...columns.target, order: 500, priority: 200 },
            actions: { ...columns.actions, order: 1000, priority: 1000 },
          },
        },
      },
    };
  }
}

export const ItemColumnRuntime = new ItemColumnRuntimeImpl();
