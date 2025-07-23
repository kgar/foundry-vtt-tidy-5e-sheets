import { CONSTANTS } from 'src/constants';
import type { ColumnSpecDocumentTypesToTabs, ColumnSpecificationCalculatedWidthArgs } from '../types';
import { TableColumnRuntimeBase } from './TableColumnRuntimeBase.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import EffectActionsColumnHeader from 'src/sheets/quadrone/item/columns/EffectActionsColumnHeader.svelte';
import DocumentActionsColumn from 'src/sheets/quadrone/item/columns/DocumentActionsColumn.svelte';
import EffectSourceColumn from 'src/sheets/quadrone/item/columns/EffectSourceColumn.svelte';
import EffectDurationColumn from 'src/sheets/quadrone/item/columns/EffectDurationColumn.svelte';

class EffectColumnRuntimeImpl extends TableColumnRuntimeBase {
  getDefaultColumns(): ColumnSpecDocumentTypesToTabs {
    // TODO

    return {
      [CONSTANTS.COLUMN_SPEC_TYPE_KEY_DEFAULT]: {
        [CONSTANTS.COLUMN_SPEC_TAB_KEY_DEFAULT]: {
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: {
            source: {
              headerContent: {
                type: 'html',
                html: FoundryAdapter.localize(
                  'DND5E.SOURCE.FIELDS.source.label'
                ),
              },
              cellContent: {
                type: 'component',
                component: EffectSourceColumn,
              },
              widthRems: 8,
              order: 100,
              priority: 100,
            },
            duration: {
              headerContent: {
                type: 'html',
                html: FoundryAdapter.localize(
                  'DND5E.SOURCE.FIELDS.source.label'
                ),
              },
              cellContent: {
                type: 'component',
                component: EffectDurationColumn,
              },
              widthRems: 6,
              order: 200,
              priority: 200,
            },
            actions: {
              headerClasses: 'header-cell-actions',
              headerContent: {
                type: 'component',
                component: EffectActionsColumnHeader,
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
            },
          },
        },
      },
    };
  }
}

export const EffectColumnRuntime = new EffectColumnRuntimeImpl();
