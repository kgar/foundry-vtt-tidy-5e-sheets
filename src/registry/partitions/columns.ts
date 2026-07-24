import { CONSTANTS } from 'src/constants';
import type { TidyPartitionRegistry } from 'src/types/registry.types';

export function getColumnPartitions(): TidyPartitionRegistry['columns'] {
  return {
    activity: {
      [CONSTANTS.COLUMN_SPEC_TYPE_KEY_DEFAULT]: {
        [CONSTANTS.COLUMN_SPEC_TAB_KEY_DEFAULT]: {
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: {
            uses: {
              order: 100,
              priority: 500,
            },
            time: {
              order: 200,
              priority: 400,
            },
            formulas: {
              order: 300,
              priority: 300,
            },
          },
        },
      },
    },
    itemAdvancement: {
      [CONSTANTS.COLUMN_SPEC_TYPE_KEY_DEFAULT]: {
        [CONSTANTS.COLUMN_SPEC_TAB_KEY_DEFAULT]: {
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: {
            value: {
              order: 600,
              priority: 250,
            },
          },
        },
      },
    },
  };
}
