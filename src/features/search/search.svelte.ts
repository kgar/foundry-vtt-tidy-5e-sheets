import { CONSTANTS } from 'src/constants';
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
    /** The user-entered search text, if the owning sheet tracks it. */
    get criteria() {
      return criteria;
    },
    set criteria(value: string) {
      criteria = value;
    },
    get isSearching() {
      return criteria.trim() !== '';
    },
    show(uuid: string) {
      return !uuids || uuids.has(uuid);
    },
  };
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
