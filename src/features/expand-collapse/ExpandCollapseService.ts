import { getContext, setContext } from 'svelte';
import { writable, type Readable, type Writable } from 'svelte/store';
import type { OnItemTableToggleFn } from '../caching/ItemTableToggleCacheService';
import { CONSTANTS } from 'src/constants';

export type ExpandCollapseServiceState = {
  expanded: boolean;
  toggleable: boolean;
};

export class ExpandCollapseService {
  static readonly contextKey = 'expandCollapseService';

  private _onItemTableToggle: OnItemTableToggleFn | undefined | null;
  private _location: string | undefined | null;
  private _state: Writable<ExpandCollapseServiceState>;
  state: Readable<ExpandCollapseServiceState>;

  constructor(
    initialState: ExpandCollapseServiceState = {
      expanded: true,
      toggleable: true,
    }
  ) {
    this._state = writable({ ...initialState });
    this.state = this._state;
    this._onItemTableToggle = getContext<OnItemTableToggleFn>(
      CONSTANTS.SVELTE_CONTEXT.ON_ITEM_TABLE_TOGGLE
    );
    this._location = getContext<string>(CONSTANTS.SVELTE_CONTEXT.LOCATION);
  }

  toggle() {
    this._state.update((current) => {
      const newState = !current.expanded;
      this._tryCacheExpandedState(newState);
      return {
        ...current,
        expanded: newState,
      };
    });
  }

  private _tryCacheExpandedState(newState: boolean) {
    if (!!this._location) {
      this._onItemTableToggle?.(this._location, newState);
    }
  }

  set(expanded: boolean) {
    this._state.update((current) => {
      return {
        ...current,
        expanded: expanded,
      };
    });
    this._tryCacheExpandedState(expanded);
  }

  static initService(toggleable: boolean) {
    const itemTableToggles = getContext<Map<string, boolean>>(
      CONSTANTS.SVELTE_CONTEXT.ITEM_TABLE_TOGGLES
    );
    const location =
      getContext<string>(CONSTANTS.SVELTE_CONTEXT.LOCATION) ?? '';

    const service = new ExpandCollapseService({
      expanded: itemTableToggles?.get(location) ?? true,
      toggleable,
    });
    setContext(ExpandCollapseService.contextKey, service);
    return service;
  }

  static getService() {
    return getContext<ExpandCollapseService>(ExpandCollapseService.contextKey);
  }
}
