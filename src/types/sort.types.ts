import type { Item5e } from './item.types';

/** A grouping of sort methods. E.g., 'a' (Alpha) encompasses sort methods alpha ascending and alpha descending */
export type SortGroup = {
  key: string;
  label: string;
  onSelect: (doc: any, currentTabId: string, group: SortGroup) => Promise<any>;
  subtitle?: string;
};

/** The content needed to manage interactions with a sort method. */
export type SortMethodOption = {
  key: string;
  name: string;
  onClick:
    | 'menu'
    | ((
        ev: MouseEvent,
        doc: any,
        currentTabId: string,
        mode: SortMethodOption
      ) => Promise<any>);
  icon: string;
  tooltip: string;
};

export type ItemSortComparator = (a: Item5e, b: Item5e) => number;

export type SortMethodScheme = SortMethodOption & {
  comparator: ItemSortComparator;
  group: string;
};
