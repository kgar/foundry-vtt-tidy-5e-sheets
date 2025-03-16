import type { Item5e } from 'src/types/item.types';
import type { SortGroup, SortMethodScheme } from 'src/types/sort.types';
import type { ColumnSpecification } from 'src/types/types';

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
export type ColumnSpecSectionKeysToColumns = Record<string, ColumnSpecification[]>;

export type ColumnSpecTabIdsToSectionKeys = Record<string, ColumnSpecSectionKeysToColumns>;

export type ColumnSpecDocumentTypesToTabs = Record<string, ColumnSpecTabIdsToSectionKeys>;

export type DefaultColumnSpecTabsToColumns = Record<string, ColumnSpecification[]>;

export type DefeaultColumnSpecDocumentTypesToTabs = Record<string, DefaultColumnSpecTabsToColumns>;