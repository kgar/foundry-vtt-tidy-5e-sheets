import { CONSTANTS } from 'src/constants';
import { isNil } from 'src/utils/data';
import { getContext, setContext } from 'svelte';

export type MaybeSearchResults = Set<string> | undefined;

export function createSearchResultsState() {
  let uuids = $state<MaybeSearchResults>();
  let search = $state<string>();

  return {
    get uuids() {
      return uuids;
    },
    set uuids(value: MaybeSearchResults) {
      uuids = value;
    },
    show(uuid: string) {
      return !uuids || uuids.has(uuid);
    },
    get hasActiveSearch() {
      return !isNil(search?.trim(), '');
    },
    set search(value: string) {
      search = value;
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
  value: ReturnType<typeof createSearchResultsState>,
) {
  setContext(searchKey, value);
}
