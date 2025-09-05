import { foundryCoreSettings } from 'src/settings/settings.svelte';
import type { ColumnsLoadout } from '../item/ColumnsLoadout.svelte';
import type {
  ColumnSpecDocumentTypesToTabs,
  ConfiguredColumnSpecification,
  GetConfiguredColumnSpecificationsArgs,
} from '../types';
import { CONSTANTS } from 'src/constants';
import { SheetSections } from 'src/features/sections/SheetSections';

export abstract class TableColumnRuntimeBase {
  _registeredColumns: ColumnSpecDocumentTypesToTabs = $state({});

  #minWidthRems = $derived(CONSTANTS.COLUMN_PRIMARY_MIN_WIDTH_REMS);

  initOnReady() {
    this._registeredColumns = this.getDefaultColumns();
  }

  abstract getDefaultColumns(): ColumnSpecDocumentTypesToTabs;

  getConfiguredColumnSpecifications(
    args: GetConfiguredColumnSpecificationsArgs
  ): ConfiguredColumnSpecification[] {
    for (let type of [args.sheetType, CONSTANTS.COLUMN_SPEC_TYPE_KEY_DEFAULT]) {
      for (let tab of [args.tabId, CONSTANTS.COLUMN_SPEC_TAB_KEY_DEFAULT]) {
        for (let section of [
          args.sectionKey,
          CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT,
        ]) {
          const specs = this._registeredColumns[type]?.[tab]?.[section];
          if (specs) {
            return Object.entries(specs)
              .filter((spec) =>
                spec[1].condition
                  ? spec[1].condition({
                      section: args.section ?? SheetSections.EMPTY,
                      sheetDocument: args.sheetDocument,
                    })
                  : true
              )
              .map(([key, spec]) => ({
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
