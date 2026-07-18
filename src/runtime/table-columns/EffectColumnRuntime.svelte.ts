import { CONSTANTS } from 'src/constants';
import type { ColumnSpecDocumentTypesToTabs } from '../types';
import { TableColumnRuntimeBase } from './TableColumnRuntimeBase.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
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
                  'DND5E.SOURCE.FIELDS.source.label',
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
                html: FoundryAdapter.localize('DND5E.Duration'),
              },
              cellContent: {
                type: 'component',
                component: EffectDurationColumn,
              },
              widthRems: 6,
              order: 200,
              priority: 200,
            },
          },
        },
      },
    };
  }
}

export const EffectColumnRuntime = new EffectColumnRuntimeImpl();
