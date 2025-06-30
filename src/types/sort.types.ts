import type { Item5e } from './item.types';

/** The content needed to manage interactions with a sort method. */
export type SortMethodOption = {
  key: string;
  icon: string;
  label: string;
  tooltip: string;
  onClick: (doc: any, currentTabId: string) => Promise<any>;
};

export type ItemSortComparator = (a: Item5e, b: Item5e) => number;

export type SortMethodScheme = SortMethodOption & {
  comparator: ItemSortComparator;
};
