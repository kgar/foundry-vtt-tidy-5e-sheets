import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime.svelte';
import type { DocumentFilters, ItemFilter } from 'src/runtime/item/item.types';
import type { Item5e } from 'src/types/item.types';
import { isNil } from 'src/utils/data';
import { debug, error } from 'src/utils/logging';

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
type ItemFilterGroupName = string; // usually a Tab ID
type ItemFilterData = Record<ItemFilterGroupName, ItemFilters>;

export class ItemFilterService {
  private _filterData = $state<ItemFilterData>()!;
  private _document: any;
  private _documentFilterProvider = ItemFilterRuntime.getDocumentFilters;

  // TODO: Have sheets send in what they have in session storage upon construction
  constructor(
    filterData: ItemFilterData = {},
    document: any,
    documentFilterProvider?: typeof ItemFilterRuntime.getDocumentFilters
  ) {
    this._filterData = filterData;
    this._document = document;

    if (documentFilterProvider) {
      this._documentFilterProvider = documentFilterProvider;
    }
  }

  // TODO: Better yet, have composed store ready to use, and have it update whenever the filters update
  compose(filterGroup: ItemFilterGroupName) {
    const group = this._getGroup(filterGroup) ?? {};

    const composition = Object.entries(group)
      .map(([filterName, value]) => {
        return {
          filter: ItemFilterRuntime.getFilter(filterName),
          value,
        };
      })
      .filter((f) => typeof f.filter?.predicate === 'function')
      .reduce(
        (prev, curr) => {
          return (item: Item5e) =>
            prev(item) && curr.filter?.predicate?.(item) == curr.value;
        },
        (_item: Item5e) => true
      );

    return (item: Item5e) => {
      try {
        return composition(item);
      } catch (e) {
        error('An error occurred while filtering an item', false, e);
        debug('Item filtering error troubleshooting info', {
          item,
          filters: group,
        });
      }

      return true;
    };
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
      this._document.render();
    }
  }

  onFilterClearAll(filterGroup?: ItemFilterGroupName) {
    if (!isNil(filterGroup, '')) {
      delete this._filterData[filterGroup!];
    } else {
      this._filterData = {};
    }

    this._document.render();
  }

  private _getGroup(filterGroup: ItemFilterGroupName) {
    let group = this._filterData[filterGroup];

    if (!group) {
      this._filterData[filterGroup] = group = {};
    }

    return group;
  }

  getDocumentItemFilterData(): DocumentFilters {
    const documentFilters = this._documentFilterProvider(this._document);
    const documentItemFilterData: DocumentFilters = {};

    for (let [tab, categories] of Object.entries(documentFilters)) {
      documentItemFilterData[tab] ??= {};

      for (let [category, filters] of Object.entries(categories)) {
        documentItemFilterData[tab][category] ??= [];
        const effectiveFilters = Array.isArray(filters)
          ? filters
          : filters(this._document);

        for (let filter of effectiveFilters) {
          try {
            documentItemFilterData[tab][category].push({
              ...filter,
              value: this._filterData[tab]?.[filter.name] ?? null,
            });
          } catch (e) {
            error(
              'An error occurred while setting up document item filter data',
              false,
              e
            );
            debug('Document item filter data error troubleshooting info', {
              tab,
              category,
              filter,
              effectiveFilters,
            });
          }
        }
      }
    }

    return documentItemFilterData;
  }

  get filterData() {
    return this._filterData;
  }
}
