import { CONSTANTS } from 'src/constants';
import { getContext, setContext } from 'svelte';

export type MaybeSearchResults = Set<string> | undefined;

export function createSearchResultsState() {
  let uuids = $state<MaybeSearchResults>();

  return {
    get uuids() {
      return uuids;
    },
    set uuids(value: MaybeSearchResults) {
      uuids = value;
    },
    show(id: string) {
      return !uuids || uuids.has(id);
    },
  };
}

let searchKey = Symbol(CONSTANTS.SVELTE_CONTEXT.SEARCH_RESULTS_STATE);

export function getSearchResultsContext() {
  return (
    getContext<ReturnType<typeof createSearchResultsState>>(searchKey) ??
    createSearchResultsState()
  );
}

export function setSearchResultsContext(
  value: ReturnType<typeof createSearchResultsState>
) {
  setContext(searchKey, value);
}
