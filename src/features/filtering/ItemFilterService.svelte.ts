import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime.svelte';
import type {
  DocumentFilters,
  FilterTabsToCategories,
  ItemFilter,
} from 'src/runtime/item/item.types';
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
type ItemFilterChoices = Record<ItemFilterName, boolean | undefined>;
type ItemFilterGroupName = string; // usually a Tab ID
type ItemFilterChoicesByGroup = Record<ItemFilterGroupName, ItemFilterChoices>;

export class ItemFilterService {
  private _filterGroupChoices = $state<ItemFilterChoicesByGroup>({});
  private _filters = $state<FilterTabsToCategories>({});
  private _filterData = $derived.by(() => this.#createDocumentItemFilterData());
  private _flattenedFilterData = $derived(
    Object.entries(this._filterData).reduce<
      Record<string, Record<string, ItemFilter>>
    >((prev, [groupName, filterGroup]) => {
      prev[groupName] = Object.values(filterGroup ?? {}).reduce<
        Record<string, ItemFilter>
      >((prev, curr) => {
        curr.forEach((filter) => {
          prev[filter.name] = filter;
        });
        return prev;
      }, {});

      return prev;
    }, {})
  );
  private _document: any;
  private _documentFilterProvider = ItemFilterRuntime.getDocumentFilters;

  // TODO: Have sheets send in what they have in session storage upon construction
  constructor(
    filterGroupChoices: ItemFilterChoicesByGroup = {},
    document: any,
    documentFilterProvider?: typeof ItemFilterRuntime.getDocumentFilters
  ) {
    this._filterGroupChoices = filterGroupChoices;
    this._document = document;

    if (documentFilterProvider) {
      this._documentFilterProvider = documentFilterProvider;
    }
  }

  compose(filterGroup: ItemFilterGroupName) {
    const choices = this._getGroupChoices(filterGroup) ?? {};
    const filters = this._flattenedFilterData[filterGroup] ?? {};

    const composition = Object.entries(choices)
      .map(([filterName, value]) => {
        return {
          filter: filters[filterName],
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
          filters: choices,
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
      let group = this._getGroupChoices(filterGroup);

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
      delete this._filterGroupChoices[filterGroup!];
    } else {
      this._filterGroupChoices = {};
    }

    this._document.render();
  }

  private _getGroupChoices(filterGroup: ItemFilterGroupName) {
    let group = this._filterGroupChoices[filterGroup];

    if (!group) {
      this._filterGroupChoices[filterGroup] = group = {};
    }

    return group;
  }

  getFilterData() {
    return this._filterData;
  }

  refreshFilters() {
    this._filters = this._documentFilterProvider(this._document);
  }

  #createDocumentItemFilterData(): DocumentFilters {
    const documentItemFilterData: DocumentFilters = {};

    for (let [tab, categories] of Object.entries(this._filters)) {
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
              value: this._filterGroupChoices[tab]?.[filter.name] ?? null,
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
    return this._filterGroupChoices;
  }
}
