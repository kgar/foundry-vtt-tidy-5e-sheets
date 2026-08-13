import { CONSTANTS } from 'src/constants';
import { ItemVisibility } from 'src/features/sections/ItemVisibility';
import type { ContainerContents, Item5e } from 'src/types/item.types';
import type { ActionItem } from 'src/types/types';
import { getContext, setContext } from 'svelte';

export type MaybeSearchResults = Set<string> | undefined;

export type SearchResultsState = ReturnType<typeof createSearchResultsState>;

export function createSearchResultsState() {
  let uuids = $state<MaybeSearchResults>();
  let criteria = $state('');

  return {
    get uuids() {
      return uuids;
    },
    set uuids(value: MaybeSearchResults) {
      uuids = value;
    },
    get criteria() {
      return criteria;
    },
    set criteria(value: string) {
      criteria = value;
    },
    get isActive() {
      return criteria.trim() !== '';
    },
    show(uuid: string) {
      if (!criteria.trim()) {
        return true;
      }

      return uuids?.has(uuid) ?? false;
    },
  };
}

export function getItemSectionSearchState(
  items: Item5e[],
  searchResults: SearchResultsState,
) {
  const isSearching = searchResults.isActive;
  const visibleItemCount = ItemVisibility.countVisibleItems(
    items,
    isSearching ? searchResults.uuids : undefined,
  );
  const hasViewableItems = visibleItemCount > 0;

  return {
    isSearching,
    hasViewableItems,
    visibleItemCount,
    expandedOverride: isSearching ? hasViewableItems : undefined,
  };
}

export function shouldShowItemSection(
  searchState: ReturnType<typeof getItemSectionSearchState>,
  options?: { unlocked?: boolean; hasSlots?: boolean },
) {
  if (searchState.hasViewableItems) {
    return true;
  }

  if (options?.hasSlots && !searchState.isSearching) {
    return true;
  }

  if (options?.unlocked && !searchState.isSearching) {
    return true;
  }

  return false;
}

export function getMemberSectionSearchState(
  members: { actor: { uuid: string } }[],
  searchResults: SearchResultsState,
) {
  const isSearching = searchResults.isActive;
  const visibleItemCount = isSearching
    ? members.filter((member) => searchResults.show(member.actor.uuid)).length
    : members.length;
  const hasViewableItems = visibleItemCount > 0;

  return {
    isSearching,
    hasViewableItems,
    visibleItemCount,
    expandedOverride: isSearching ? hasViewableItems : undefined,
  };
}

export function shouldShowMemberSection(
  searchState: ReturnType<typeof getMemberSectionSearchState>,
) {
  if (searchState.hasViewableItems) {
    return true;
  }

  return !searchState.isSearching;
}

export function syncItemTabSearch(
  searchResults: SearchResultsState,
  searchCriteria: string,
  args: {
    tabId: string;
    itemContext: Record<string, { containerContents?: ContainerContents }>;
    sections: ({ items: Item5e[] } | { actions: ActionItem[] })[];
  },
) {
  searchResults.criteria = searchCriteria;
  searchResults.uuids = ItemVisibility.getItemsToShowAtDepth({
    criteria: searchCriteria,
    ...args,
  });
}

let searchKey = Symbol(CONSTANTS.SVELTE_CONTEXT.SEARCH_RESULTS_STATE);

export function getSearchResultsContext() {
  return (
    getContext<SearchResultsState>(searchKey) ?? createSearchResultsState()
  );
}

export function setSearchResultsContext(value: SearchResultsState) {
  setContext(searchKey, value);
}
