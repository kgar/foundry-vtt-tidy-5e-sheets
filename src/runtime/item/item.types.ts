import type { TidyTableAction } from 'src/components/table-quadrone/table-buttons/table.types';
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
  ItemFilter[] | ((document: any) => ItemFilter[])
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

export type ColumnSpecificationCalculatedWidthArgs = {
  rowActions: TidyTableAction<any, any, any>[];
};

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
  widthRems:
    | number
    | ((section: ColumnSpecificationCalculatedWidthArgs) => number); // default: 5 (rem)
  priority: number;
  order: number;
  headerClasses?: string;
  cellClasses?: string;
  condition?: <TSection extends TidySectionBase>(
    data: ColumnSpecificationConditionArgs<any, TSection>
  ) => boolean;
};

/** Column specification whose optionally calculable width has been calculated and which has a key for uniquely identifying it. */
export type ConfiguredColumnSpecification = ColumnSpecification & { key: string, widthRems: number; };

export type ColumnHeaderProps<TDocument = any, TContext = any> = {
  sheetDocument: TDocument;
  sheetContext: TContext;
  section: TidySectionBase;
};

export type ColumnCellProps<TDocument = any, TContext = any> = {
  rowDocument: TDocument;
  rowContext: TContext;
  section: TidySectionBase;
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
