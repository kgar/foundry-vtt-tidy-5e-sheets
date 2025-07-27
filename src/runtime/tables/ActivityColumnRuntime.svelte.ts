import { CONSTANTS } from 'src/constants';
import type { ColumnSpecDocumentTypesToTabs } from '../types';
import { getDefaultActivityColumns } from './default-activity-columns';
import { TableColumnRuntimeBase } from './TableColumnRuntimeBase.svelte';

class ActivityColumnRuntimeImpl extends TableColumnRuntimeBase {
  getDefaultColumns(): ColumnSpecDocumentTypesToTabs {
    let columns = getDefaultActivityColumns();

    return {
      [CONSTANTS.COLUMN_SPEC_TYPE_KEY_DEFAULT]: {
        [CONSTANTS.COLUMN_SPEC_TAB_KEY_DEFAULT]: {
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: {
            uses: {
              ...columns.uses,
              order: 100,
              priority: 500,
            },
            time: {
              ...columns.time,
              order: 200,
              priority: 400,
            },
            formulas: {
              ...columns.formulas,
              order: 300,
              priority: 300,
            },
            actions: {
              ...columns.actions,
              order: 1000,
              priority: 1000,
            },
          },
        },
      },
    };
  }
}

export const ActivityColumnRuntime = new ActivityColumnRuntimeImpl();
