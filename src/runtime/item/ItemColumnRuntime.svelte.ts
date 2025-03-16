import type { ColumnSpecification, TidySectionBase } from 'src/types/types';
import type {
  ColumnSpecDocumentTypesToTabs,
  ColumnSpecTabIdsToSectionKeys,
  DefeaultColumnSpecDocumentTypesToTabs,
} from './item.types';
import { CONSTANTS } from 'src/constants';
import { defaultItemColumns } from './dault-item-columns';

export class ItemColumnRuntime {
  static _registeredItemColumns: Record<string, ColumnSpecification> = {};

  static init() {
    ItemColumnRuntime._registeredItemColumns = {
      ...defaultItemColumns,
      // Add more later; include ability to add them through the API and load from world/client settings.
      // TODO: When there are world/client settings, use an effect to refresh the collection on settings changes.
    };
  }

  /**
   * The global column specifications for all sheet tab sections.
   * This object should be updated with any world settings for user-defined default section config.
   * Likewise, any API calls that intend to adjust section column selection
   * defaults for all eligible content would go here.
   */
  static documentTabSectionColumnsQuadrone: ColumnSpecDocumentTypesToTabs = {
    [CONSTANTS.ITEM_TYPE_CONTAINER]: {
      [CONSTANTS.TAB_CONTAINER_CONTENTS]: {
        [CONSTANTS.ITEM_TYPE_CONTAINER]: [
          defaultItemColumns.inventoryContainerCapacity,
        ],
        [CONSTANTS.COLUMN_SPEC_SECTION_KEY_FALLBACK]: [
          defaultItemColumns.inventoryCharges,
          defaultItemColumns.inventoryPrice,
          defaultItemColumns.inventoryQuantity,
          defaultItemColumns.inventoryWeight,
        ],
      },
    },
  };

  static getDocumentColumnsQuadrone(
    document: any,
    tabId: string,
    section: TidySectionBase
  ): ColumnSpecification[] {
    const sections =
      ItemColumnRuntime.documentTabSectionColumnsQuadrone[document.type]?.[
        tabId
      ];
    return (
      sections?.[section.key] ??
      sections?.[CONSTANTS.COLUMN_SPEC_SECTION_KEY_FALLBACK] ??
      []
    );
  }
}
