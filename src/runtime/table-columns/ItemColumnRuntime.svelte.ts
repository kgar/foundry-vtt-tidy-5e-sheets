import type {
  ColumnSpecDocumentTypesToTabs,
  ColumnSpecification,
} from 'src/types/columns.types';
import { CONSTANTS } from 'src/constants';
import { getDefaultItemColumns } from './default-item-columns';
import { TableColumnRuntimeBase } from './TableColumnRuntimeBase.svelte';

class ItemColumnRuntimeImpl extends TableColumnRuntimeBase {
  getDefaultColumns(): ColumnSpecDocumentTypesToTabs {
    const columns = getDefaultItemColumns();

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
        ...columns.time,
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
        ...columns.roll,
        order: 600,
        priority: 700,
      },
    } satisfies Record<string, ColumnSpecification>;

    return {
      [CONSTANTS.SHEET_TYPE_CHARACTER]: {
        // Feature
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
          },
        },
      },
      [CONSTANTS.SHEET_TYPE_NPC]: {
        [CONSTANTS.TAB_STATBLOCK]: {
          // inventory, spell, and feature
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: {
            recovery: { ...columns.recovery, order: 100, priority: 400 },
            uses: { ...columns.uses, order: 200, priority: 600 },
            roll: { ...columns.roll, order: 300, priority: 800 },
            formula: { ...columns.formula, order: 400, priority: 700 },
            range: { ...columns.range, order: 500, priority: 300 },
            target: { ...columns.target, order: 600, priority: 800 },
            time: { ...columns.time, order: 700, priority: 800 },
          },
        },
        [CONSTANTS.TAB_ACTOR_SPELLBOOK]: {
          // Spell
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: standardSpellColumns,
        },
      },
      [CONSTANTS.SHEET_TYPE_VEHICLE]: {
        [CONSTANTS.TAB_STATBLOCK]: {
          // Spell
          [CONSTANTS.ITEM_TYPE_SPELL]: standardSpellColumns,
          // Inventory and features
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: {
            recovery: { ...columns.recovery, order: 100, priority: 400 },
            uses: { ...columns.uses, order: 200, priority: 600 },
            roll: { ...columns.roll, order: 300, priority: 800 },
            formula: { ...columns.formula, order: 400, priority: 700 },
            range: { ...columns.range, order: 500, priority: 300 },
            target: { ...columns.target, order: 600, priority: 800 },
            time: { ...columns.time, order: 700, priority: 800 },
          },
        },
      },
      [CONSTANTS.COLUMN_SPEC_TYPE_KEY_DEFAULT]: {
        [CONSTANTS.TAB_ACTOR_ACTIONS]: {
          // Feature
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: {
            charges: { ...columns.uses, order: 100, priority: 500 },
            roll: { ...columns.roll, order: 200, priority: 400 },
            formula: { ...columns.formula, order: 300, priority: 600 },
            range: { ...columns.range, order: 400, priority: 300 },
            target: { ...columns.target, order: 500, priority: 200 },
            time: { ...columns.time, order: 600, priority: 250 },
          },
        },
      },
    };
  }
}

export const ItemColumnRuntime = new ItemColumnRuntimeImpl();
