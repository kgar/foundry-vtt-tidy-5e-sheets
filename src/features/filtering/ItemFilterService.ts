import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime';
import type { ActorFilters, ItemFilter } from 'src/runtime/item/item.types';
import type { Item5e } from 'src/types/item';
import type { Actor5e } from 'src/types/types';
import { isNil } from 'src/utils/data';
import { debug, error } from 'src/utils/logging';
import { writable, type Readable, type Writable } from 'svelte/store';

/*
// Filter Data
{
  inventory: {
    action: true,
    reaction: false,
    // nulls are just excluded
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
type ItemFilters = Record<ItemFilterName, boolean | undefined>;
type ItemFilterGroupName = string;
type ItemFilterData = Record<ItemFilterGroupName, ItemFilters>;

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

  filter(items: Item5e[], filterGroup: ItemFilterGroupName): Item5e[] {
    const group = this._getGroup(filterGroup) ?? {};

    const filterConfigs = Object.entries(group)
      .map(([filterName, value]) => {
        return {
          filter: ItemFilterRuntime.getFilter(filterName),
          value,
        };
      })
      .filter((f) => typeof f.filter?.predicate === 'function');

    if (!filterConfigs.length) {
      return items;
    }

    return items.filter((item) => {
      try {
        // TODO: Expand this for allowing for different modes (AND, OR, NOR, XOR, etc.) for advanced users.
        let include = true;
        for (let filterConfig of filterConfigs) {
          include &&=
            filterConfig.filter?.predicate(item) === filterConfig.value;
        }
        return include;
      } catch (e) {
        error('An error occurred while filtering an item', false, e);
        debug('Item filtering error troubleshooting info', {
          item,
          filters: filterConfigs,
        });
      }

      return true;
    });
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
        const effectiveFilters = Array.isArray(filters) ? filters : filters();

        for (let filter of effectiveFilters) {
          try {
            actorItemFilterData[tab][category].push({
              ...filter,
              value: this._filterData[tab]?.[filter.name] ?? null,
            });
          } catch (e) {
            error(
              'An error occurred while setting up actor item filter data',
              false,
              e
            );
            debug('Actor item filter data error troubleshooting info', {
              tab,
              category,
              filter,
              effectiveFilters,
            });
          }
        }
      }
    }

    return actorItemFilterData;
  }
}
