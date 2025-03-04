import type { Item5e } from 'src/types/item.types';

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
export type DocumentTypesToFilterTabs = Record<DocumentType, FilterTabsToCategories>;

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