import type { Item5e } from 'src/types/item';
import { writable, type Readable, type Writable } from 'svelte/store';

/*
// Filter Data
{
  inventory: {
    action: true,
    reaction: false,
    bonus: null, // Just exclude nulls
    equipped: true,
  },
  spellbook: {
    canCast: true,
  },
  features: {
    action: true,
  },
}
*/

type ItemFilter = {
  name: string;
  predicate: (item: Item5e) => boolean;
};
type ItemFilterName = ItemFilter['name'];
type FilterGroup = Record<ItemFilterName, boolean | undefined>;
type FilterGroupName = string;
type FilterData = Record<FilterGroupName, FilterGroup>;

export class ItemFilterService {
  private _filterData: FilterData;

  private _itemFilterChange$: Writable<number>;

  get itemFilterChange$(): Readable<number> {
    return this._itemFilterChange$;
  }

  // TODO: Have sheets send in what they have in session storage upon construction
  constructor(filterData: FilterData = {}) {
    this._filterData = filterData;
    this._itemFilterChange$ = writable(Math.random());
  }

  includeItem(item: Item5e, filterGroup: FilterGroupName): boolean {
    const group = this._getGroup(filterGroup);

    for (let [filterName, value] of Object.entries(group)) {
      if (value === null) {
        continue;
      }

      const filter = getFilter(filterName);
      if (filter.predicate(item) !== value) {
        return false;
      }
    }

    return true;
  }

  onFilter(
    filterGroup: FilterGroupName,
    filterName: ItemFilterName,
    value: boolean | null
  ) {
    try {
      let group = this._getGroup(filterGroup);

      if (value === null) {
        delete group[filterName];
        return;
      }

      group[filterName] = value;
    } finally {
      this._notifyOfChange();
    }
  }

  private _getGroup(filterGroup: FilterGroupName) {
    let group = this._filterData[filterGroup];

    if (!group) {
      this._filterData[filterGroup] = group = {};
    }

    return group;
  }

  private _notifyOfChange() {
    this._itemFilterChange$.set(Math.random());
  }
}

// TODO: Move to Item Filter Runtime
function getFilter(filterName: ItemFilterName): ItemFilter {
  throw new Error('implement');
}
