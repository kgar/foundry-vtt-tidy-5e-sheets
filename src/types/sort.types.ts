import type { Item5e } from './item.types';

export type SortMethodKeyManual = 'm';
export type SortMethodKeyAlphaAscending = 'a';
export type SortMethodKeyAlphaDescending = 'd';
export type SortMethodKeyPriority = 'priority';
export type SortMethodKeyEquipped = 'equipped';
export type SortMethodKeyPrepared = 'prepared';

/** The supported methods of sorting for Classic sheets. */
export type SortMethodKeyClassic =
  | SortMethodKeyAlphaAscending
  | SortMethodKeyManual;

/** The supported methods of sorting for Quadrone sheets. */
export type SortMethodKeyQuadrone =
  | SortMethodKeyAlphaAscending
  | SortMethodKeyAlphaDescending
  | SortMethodKeyManual
  | SortMethodKeyPriority
  | SortMethodKeyEquipped
  | SortMethodKeyPrepared
  | (string & {});

export type SortGroupKeyAlpha = 'a';
export type SortGroupKeyPriority = 'priority';
export type SortGroupKeyManual = 'm';
export type SortGroupKeyEquipped = 'equipped';
export type SortGroupKeyPrepared = 'prepared';

/** The supported groups of sort methods for Quadrone sheets. */
export type SortGroupKeyQuadrone =
  | SortGroupKeyAlpha
  | SortGroupKeyManual
  | SortGroupKeyPriority
  | SortGroupKeyEquipped
  | SortGroupKeyPrepared;

/** A grouping of sort methods. E.g., 'a' (Alpha) encompasses sort methods alpha ascending and alpha descending */
export type SortGroup = {
  key: SortGroupKeyQuadrone;
  label: string;
  onSelect: (doc: any, group: SortGroup) => Promise<any>;
};

/** The content needed to manage interactions with a sort method. */
export type SortMethodOption = {
  key: SortMethodKeyQuadrone;
  name: string;
  onClick:
    | 'menu'
    | ((ev: MouseEvent, doc: any, mode: SortMethodOption) => Promise<any>);
  icon: string;
  tooltip: string;
};

export type ItemSortComparator = (a: Item5e, b: Item5e) => number;

export type SortMethodScheme = SortMethodOption & {
  comparator: ItemSortComparator;
};

export type SortParametersQuadrone = {
  method: SortMethodKeyQuadrone;
  group: SortGroupKeyQuadrone;
  methods: SortMethodOption[];
  groups: SortGroup[];
};
