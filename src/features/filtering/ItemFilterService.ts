import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime';
import type { ActorFilters, ItemFilter } from 'src/runtime/types';
import type { Item5e } from 'src/types/item';
import type { Actor5e } from 'src/types/types';
import { isNil } from 'src/utils/data';
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

type ItemFilterName = ItemFilter['name'];
export type ItemFilters = Record<ItemFilterName, boolean | undefined>;

type ItemFilterGroupName = string;
export type ItemFilterData = Record<ItemFilterGroupName, ItemFilters>;

export class ItemFilterService {
  // Maybe svelte runes will make this easier?
  private _filterData: ItemFilterData;

  private _filterDataStore: Writable<ItemFilterData>;

  private _actor: Actor5e;

  get filterData$(): Readable<ItemFilterData> {
    return this._filterDataStore;
  }

  // TODO: Have sheets send in what they have in session storage upon construction
  constructor(filterData: ItemFilterData = {}, actor: Actor5e) {
    this._filterData = filterData;
    this._filterDataStore = writable(this._filterData);
    this._actor = actor;
  }

  includeItem(item: Item5e, filterGroup: ItemFilterGroupName): boolean {
    const group = this._getGroup(filterGroup);

    for (let [filterName, value] of Object.entries(group)) {
      if (value === null) {
        continue;
      }

      const filter = ItemFilterRuntime.getFilter(filterName);

      if (!filter) {
        continue;
      }

      if (filter.predicate(item) !== value) {
        return false;
      }
    }

    return true;
  }

  onFilter(
    filterGroup: ItemFilterGroupName,
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

  onFilterClearAll(filterGroup?: ItemFilterGroupName) {
    if (!isNil(filterGroup, '')) {
      delete this._filterData[filterGroup!];
    } else {
      this._filterData = {};
    }

    this._notifyOfChange();
  }

  private _getGroup(filterGroup: ItemFilterGroupName) {
    let group = this._filterData[filterGroup];

    if (!group) {
      this._filterData[filterGroup] = group = {};
    }

    return group;
  }

  private _notifyOfChange() {
    this._filterDataStore.set(this._filterData);
  }

  getActorItemFilterData(): ActorFilters {
    const actorFilters = ItemFilterRuntime.getActorFilters(this._actor);
    const actorItemFilterData: ActorFilters = {};
    for (let [tab, categories] of Object.entries(actorFilters)) {
      actorItemFilterData[tab] ??= {};
      for (let [category, filters] of Object.entries(categories)) {
        actorItemFilterData[tab][category] ??= [];
        for (let filter of filters) {
          actorItemFilterData[tab][category].push({
            ...filter,
            value: this._filterData[tab]?.[filter.name] ?? null,
          });
        }
      }
    }

    return actorItemFilterData;
  }
}
