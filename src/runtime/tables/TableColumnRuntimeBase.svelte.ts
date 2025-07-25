import { foundryCoreSettings } from 'src/settings/settings.svelte';
import type { ColumnsLoadout } from '../item/ColumnsLoadout.svelte';
import type {
  ColumnSpecDocumentTypesToTabs,
  ColumnSpecificationCalculatedWidthArgs,
  ConfiguredColumnSpecification,
} from '../types';
import { CONSTANTS } from 'src/constants';

export abstract class TableColumnRuntimeBase {
  _registeredColumns: ColumnSpecDocumentTypesToTabs = $state({});

  #minWidthRems = $derived(CONSTANTS.COLUMN_PRIMARY_MIN_WIDTH_REMS);

  initOnReady() {
    this._registeredColumns = this.getDefaultColumns();
  }

  abstract getDefaultColumns(): ColumnSpecDocumentTypesToTabs;

  getConfiguredColumnSpecifications(
    sheetType: string,
    tabId: string,
    sectionKey: string,
    args: ColumnSpecificationCalculatedWidthArgs
  ): ConfiguredColumnSpecification[] {
    for (let type of [sheetType, CONSTANTS.COLUMN_SPEC_TYPE_KEY_DEFAULT]) {
      for (let tab of [tabId, CONSTANTS.COLUMN_SPEC_TAB_KEY_DEFAULT]) {
        for (let section of [
          sectionKey,
          CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT,
        ]) {
          const specs = this._registeredColumns[type]?.[tab]?.[section];
          if (specs) {
            return Object.entries(specs).map(([key, spec]) => ({
              key,
              ...spec,
              widthRems:
                typeof spec.widthRems === 'number'
                  ? spec.widthRems
                  : spec.widthRems(args),
            }));
          }
        }
      }
    }

    return [];
  }

  determineHiddenColumns(
    inlineSizePx: number,
    schematics: ColumnsLoadout,
    minWidthRemsOverride?: number
  ): Set<string> {
    let minWidthRems = minWidthRemsOverride ?? this.#minWidthRems;
    let availableRems = inlineSizePx / foundryCoreSettings.value.fontSizePx;

    let toHide = new Set<string>();

    for (const col of schematics.prioritized) {
      availableRems -= col.widthRems;

      if (availableRems < minWidthRems) {
        toHide.add(col.key);
      }
    }

    return toHide;
  }
}
