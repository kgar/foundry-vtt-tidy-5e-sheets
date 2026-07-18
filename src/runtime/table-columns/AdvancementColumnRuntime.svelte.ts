import { CONSTANTS } from 'src/constants';
import type { ColumnSpecDocumentTypesToTabs } from 'src/types/types';
import { TableColumnRuntimeBase } from './TableColumnRuntimeBase.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import AdvancementValueColumn from 'src/sheets/quadrone/item/columns/AdvancementValueColumn.svelte';

class AdvancementColumnRuntimeImpl extends TableColumnRuntimeBase {
  getDefaultColumns(): ColumnSpecDocumentTypesToTabs {
    return {
      [CONSTANTS.COLUMN_SPEC_TYPE_KEY_DEFAULT]: {
        [CONSTANTS.COLUMN_SPEC_TAB_KEY_DEFAULT]: {
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: {
            value: {
              headerContent: {
                type: 'html',
                html: FoundryAdapter.localize('DND5E.Value'),
              },
              cellContent: {
                type: 'component',
                component: AdvancementValueColumn,
              },
              widthRems: 4,
              order: 600,
              priority: 250,
            },
          },
        },
      },
    };
  }
}

export const AdvancementColumnRuntime = new AdvancementColumnRuntimeImpl();
