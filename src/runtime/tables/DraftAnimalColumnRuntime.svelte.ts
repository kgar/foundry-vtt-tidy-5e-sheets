import { CONSTANTS } from 'src/constants';
import type {
  ColumnSpecDocumentTypesToTabs,
  ColumnSpecification,
} from '../types';
import { TableColumnRuntimeBase } from './TableColumnRuntimeBase.svelte';
import { getDefaultItemColumns } from './default-item-columns';
import DraftAnimalTestColumn from 'src/sheets/quadrone/item/columns/DraftAnimalTestColumn.svelte';

class DraftAnimalColumnRuntimeImpl extends TableColumnRuntimeBase {
  getDefaultColumns(): ColumnSpecDocumentTypesToTabs {
    const defaultItemColumns = getDefaultItemColumns();

    return {
      [CONSTANTS.SHEET_TYPE_VEHICLE]: {
        [CONSTANTS.TAB_STATBLOCK]: {
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: {
            draftAnimalTestColumn: {
              cellContent: {
                type: 'component',
                component: DraftAnimalTestColumn,
              },
              headerContent: {
                type: 'html',
                html: 'Sample Column',
              },
              order: 900,
              priority: 900,
              widthRems: 8,
            },
            actions: {
              ...defaultItemColumns.actions,
              order: 1000,
              priority: 1000,
            },
          },
        },
      },
    };
  }
}

export const DraftAnimalColumnRuntime = new DraftAnimalColumnRuntimeImpl();
