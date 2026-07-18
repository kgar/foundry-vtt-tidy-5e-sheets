import { foundryCoreSettings } from 'src/settings/settings.svelte';
import type {
  ColumnSpecDocumentTypesToTabs,
  ConfiguredSectionColumnSpecification,
  SectionColumnContext,
  SectionColumnSpecifications,
} from 'src/types/types';
import { CONSTANTS } from 'src/constants';

export abstract class TableColumnRuntimeBase {
  static readonly getEmptyColumnSpecs = () =>
    ({
      map: {},
      prioritized: [],
      sorted: [],
    }) satisfies SectionColumnContext;

  _registeredColumns: ColumnSpecDocumentTypesToTabs = $state({});

  _minWidthRems: number = CONSTANTS.COLUMN_PRIMARY_MIN_WIDTH_REMS;

  initOnReady() {
    this._registeredColumns = this.getDefaultColumns();
  }

  abstract getDefaultColumns(): ColumnSpecDocumentTypesToTabs;

  getColumnSpecifications(
    sheetDocument: any,
    tabId: string,
    sectionKey: string,
  ): SectionColumnSpecifications {
    const map: Record<string, ConfiguredSectionColumnSpecification> = {};
    const allSpecs: ConfiguredSectionColumnSpecification[] = [];

    for (let type of [
      sheetDocument.type,
      CONSTANTS.COLUMN_SPEC_TYPE_KEY_DEFAULT,
    ]) {
      for (let tab of [tabId, CONSTANTS.COLUMN_SPEC_TAB_KEY_DEFAULT]) {
        for (let section of [
          sectionKey,
          CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT,
        ]) {
          const specs = this._registeredColumns[type]?.[tab]?.[section];

          if (!specs) {
            continue;
          }

          for (const [key, spec] of Object.entries(specs)) {
            const configuredSpec: ConfiguredSectionColumnSpecification = {
              key,
              ...spec,
            };
            map[key] = configuredSpec;

            allSpecs.push(configuredSpec);
          }

          const sorted = allSpecs
            .toSorted((a, b) => a.order - b.order)
            .map((s) => s.key);
          const prioritized = allSpecs
            .toSorted((a, b) => b.priority - a.priority)
            .map((s) => s.key);

          return {
            sorted,
            prioritized,
            map,
          };
        }
      }
    }

    return {
      sorted: [],
      map: {},
      prioritized: [],
    };
  }

  determineHiddenColumns(
    inlineSizePx: number,
    schematics: SectionColumnContext,
    minWidthRemsOverride?: number,
  ): Set<string> {
    let minWidthRems = minWidthRemsOverride ?? this._minWidthRems;
    let availableRems = inlineSizePx / foundryCoreSettings.value.fontSizePx;

    let toHide = new Set<string>();

    for (const key of schematics.prioritized) {
      const col = schematics.map[key];
      availableRems -= col.widthRems;

      if (availableRems < minWidthRems) {
        toHide.add(col.key);
      }
    }

    return toHide;
  }
}
