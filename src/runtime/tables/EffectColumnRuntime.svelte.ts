import { CONSTANTS } from 'src/constants';
import type { ColumnSpecDocumentTypesToTabs } from '../types';
import { TableColumnRuntimeBase } from './TableColumnRuntimeBase.svelte';

class EffectColumnRuntimeImpl extends TableColumnRuntimeBase {
  getDefaultColumns(): ColumnSpecDocumentTypesToTabs {
        // TODO

    return {
      [CONSTANTS.COLUMN_SPEC_TYPE_KEY_DEFAULT]: {
        [CONSTANTS.COLUMN_SPEC_TAB_KEY_DEFAULT]: {
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: {
            // TODO
          },
        },
      },
    };
  }
}

export const EffectColumnRuntime = new EffectColumnRuntimeImpl();
