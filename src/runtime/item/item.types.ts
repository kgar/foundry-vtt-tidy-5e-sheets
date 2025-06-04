import type { Item5e } from 'src/types/item.types';
import type { SortGroup, SortMethodScheme } from 'src/types/sort.types';
import type { TidySectionBase } from 'src/types/types';
import type { Component } from 'svelte';

// Filtering
export type ItemFilter = {
  name: string;
  predicate: (item: Item5e) => boolean;
  text: string;
  /** Used for scenarios where space is limited and an abbreviation is available. */
  abbreviation?: string;
  pinnedFilterClass?: string;
};

type Category = string;
type TabId = string;
type DocumentType = string;
export type FilterCategoriesToFilters = Record<
  Category,
  ItemFilter[] | (() => ItemFilter[])
>;

export type FilterTabsToCategories = Record<TabId, FilterCategoriesToFilters>;
export type DocumentTypesToFilterTabs = Record<
  DocumentType,
  FilterTabsToCategories
>;

// TODO: Find a better name for this
export type ConfiguredItemFilter = ItemFilter & {
  value: boolean | null;
};
export type DocumentFilterCategories = Record<Category, ConfiguredItemFilter[]>;
export type DocumentFilters = Record<TabId, DocumentFilterCategories>;

export type RegisteredEquipmentTypeGroup = {
  label: string;
  types: Record<string, string>;
};

// Sorting
export type SortTabsToSortSchemes = Record<TabId, SortMethodScheme[]>;

export type DocumentTypesToSortMethodTabs = Record<
  DocumentType,
  SortTabsToSortSchemes
>;

export type SortTabsToSortGroups = Record<TabId, SortGroup[]>;
export type DocumentTypesToSortGroupTabs = Record<
  DocumentType,
  SortTabsToSortGroups
>;

// Columns
export type ColumnSpecification = {
  headerContent?:
    | {
        type: 'component';
        component: Component<ColumnHeaderProps>;
      }
    | {
        type: 'callback';
        callback: (sheetDocument: any, sheetContext: any) => string;
      }
    | {
        type: 'html';
        html: string;
      };
  cellContent:
    | {
        type: 'component';
        component: Component<ColumnCellProps>;
      }
    | {
        type: 'callback';
        callback: (rowDocument: any, rowContext: any) => string;
      };
  width: number; // default: "80" (px)
  priority: number;
  order: number;
  headerClasses?: string;
  cellClasses?: string;
  condition?: <TSection extends TidySectionBase>(
    data: ColumnSpecificationConditionArgs<any, TSection>
  ) => boolean;
};

export type KeyedColumnSpecification = ColumnSpecification & { key: string };

export type ColumnSpecificationSchematics = {
  ordered: KeyedColumnSpecification[];
  prioritized: KeyedColumnSpecification[];
};

export type SectionColumnSpecificationSchematics = Record<
  string,
  ColumnSpecificationSchematics
>;

export type TabColumnSpecificationSchematics = Record<
  string,
  SectionColumnSpecificationSchematics
>;

export type SheetColumnSpecificationSchematics = Record<
  string,
  TabColumnSpecificationSchematics
>;

export type ColumnHeaderProps<TDocument = any, TContext = any> = {
  sheetDocument: TDocument;
  sheetContext: TContext;
};

export type ColumnCellProps<TDocument = any, TContext = any> = {
  rowDocument: TDocument;
  rowContext: TContext;
};

export type ColumnSpecificationConditionArgs<
  TDocument = any,
  TSection = TidySectionBase
> = {
  sheetDocument: TDocument;
  section: TSection;
};

export type ColumnSpecSectionKeysToColumns = Record<
  string | symbol,
  Record<string, ColumnSpecification>
>;

export type ColumnSpecTabIdsToSectionKeys = Record<
  string,
  ColumnSpecSectionKeysToColumns
>;

export type ColumnSpecDocumentTypesToTabs = Record<
  string,
  ColumnSpecTabIdsToSectionKeys
>;

export type DefaultColumnSpecTabsToColumns = Record<
  string,
  ColumnSpecification[]
>;

export type DefeaultColumnSpecDocumentTypesToTabs = Record<
  string,
  DefaultColumnSpecTabsToColumns
>;
