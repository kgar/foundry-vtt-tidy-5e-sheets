import { CONSTANTS } from 'src/constants';
import { foundryCoreSettings } from 'src/settings/settings.svelte';
import type {
  ColumnSpecificationV2,
  ColumnPartitionOptions,
  SectionColumnSpecificationsV2,
  ConfiguredColumnSpecificationV2,
} from 'src/types/columns.types';
import type { ColumnRegistryDomain, ColumnOf } from 'src/types/registry.types';

export abstract class ColumnRuntimeBase<
  TDomain extends ColumnRegistryDomain,
  TColumnSpecification extends ColumnSpecificationV2<any, any, any, any> =
    ColumnOf<TDomain>,
> {
  abstract readonly domain: TDomain;

  _minWidthRems: number = CONSTANTS.COLUMN_PRIMARY_MIN_WIDTH_REMS;

  getColumnSpecifications(
    options: ColumnPartitionOptions,
  ): SectionColumnSpecificationsV2 {
    for (let type of [
      options.sheetDocumentType,
      CONSTANTS.COLUMN_SPEC_TYPE_KEY_DEFAULT,
    ]) {
      if (!type) {
        continue;
      }

      for (let tab of [
        options.tabId,
        CONSTANTS.COLUMN_SPEC_TAB_KEY_DEFAULT,
      ].filter((o) => !!o)) {
        if (!tab) {
          continue;
        }

        for (let section of [
          options.sectionKey,
          CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT,
        ].filter((o) => !!o)) {
          if (!section) {
            continue;
          }

          const partitionData =
            CONFIG.TIDY5E.partitions.columns?.[this.domain]?.[type]?.[tab]?.[
              section
            ];

          if (!partitionData) {
            continue;
          }

          const map: Record<string, ConfiguredColumnSpecificationV2> = {};
          const allSpecs: ConfiguredColumnSpecificationV2[] = [];

          for (const [key, data] of Object.entries(partitionData)) {
            const spec = CONFIG.TIDY5E.features.columns[this.domain][key] as
              TColumnSpecification | undefined;

            if (!spec) {
              continue;
            }

            const configuredSpec: ConfiguredColumnSpecificationV2 = {
              key,
              ...spec,
              ...data,
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
    schematics: SectionColumnSpecificationsV2,
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
