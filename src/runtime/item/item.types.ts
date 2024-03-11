import type { Item5e } from 'src/types/item.types';

export type ItemFilter = {
  name: string;
  predicate: (item: Item5e) => boolean;
  text: string;
};

type Category = string;
type TabId = string;
type ActorType = string;
export type FilterCategoriesToFilters = Record<
  Category,
  ItemFilter[] | (() => ItemFilter[])
>;

export type FilterTabsToCategories = Record<TabId, FilterCategoriesToFilters>;
export type ActorTypesToFilterTabs = Record<ActorType, FilterTabsToCategories>;

// TODO: Find a better name for this
export type ConfiguredItemFilter = ItemFilter & {
  value: boolean | null;
};
export type ActorFilterCategories = Record<Category, ConfiguredItemFilter[]>;
export type ActorFilters = Record<TabId, ActorFilterCategories>;

export type RegisteredEquipmentTypeGroup = {
  label: string;
  types: Record<string, string>;
};