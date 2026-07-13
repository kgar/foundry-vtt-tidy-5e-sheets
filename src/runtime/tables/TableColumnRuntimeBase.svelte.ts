import { foundryCoreSettings } from 'src/settings/settings.svelte';
import type { ColumnsLoadout } from '../item/ColumnsLoadout.svelte';
import type {
  ColumnSpecDocumentTypesToTabs,
  ConfiguredColumnSpecification,
  ConfiguredSectionColumnSpecification,
  GetConfiguredColumnSpecificationsArgs,
  SectionColumnContext,
  SectionColumnSpecifications,
} from '../types';
import { CONSTANTS } from 'src/constants';
import type { TidySectionBase } from 'src/types/types';
import type { TidyTableAction } from 'src/components/table-quadrone/table-buttons/table.types';

export abstract class TableColumnRuntimeBase {
  static readonly getEmptyColumnSpecs = () =>
    ({
      map: {},
      prioritized: [],
      sorted: [],
      maxRowActionsCount: 0,
    }) satisfies SectionColumnContext;

  _registeredColumns: ColumnSpecDocumentTypesToTabs = $state({});

  _minWidthRems: number = CONSTANTS.COLUMN_PRIMARY_MIN_WIDTH_REMS;

  initOnReady() {
    this._registeredColumns = this.getDefaultColumns();
  }

  abstract getDefaultColumns(): ColumnSpecDocumentTypesToTabs;

  applyRowActionColumnWidth(
    section: TidySectionBase,
    rowActions: TidyTableAction<any, any>[] = [],
  ) {
    section.columns.maxRowActionsCount = Math.max(
      section.columns.maxRowActionsCount,
      rowActions.length,
    );
  }

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
              widthRems: spec.widthRems,
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
            maxRowActionsCount: 1,
          };
        }
      }
    }

    return {
      sorted: [],
      map: {},
      prioritized: [],
      maxRowActionsCount: 1,
    };
  }

  // TODO: Eliminate
  getConfiguredColumnSpecifications(
    args: GetConfiguredColumnSpecificationsArgs,
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
              .filter(
                ([_, spec]) =>
                  spec.condition?.({
                    sheetDocument: args.sheetDocument,
                  }) ?? true,
              )
              .map(([key, spec]) => ({
                key,
                ...spec,
                widthRems: spec.widthRems,
              }));
          }
        }
      }
    }

    return [];
  }

  // TODO: Eliminate
  determineHiddenColumns(
    inlineSizePx: number,
    schematics: ColumnsLoadout,
    minWidthRemsOverride?: number,
  ): Set<string> {
    let minWidthRems = minWidthRemsOverride ?? this._minWidthRems;
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

  determineHiddenColumnsV2(
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
