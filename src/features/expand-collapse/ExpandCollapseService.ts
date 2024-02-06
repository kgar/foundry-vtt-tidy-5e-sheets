import type { OnItemTableToggleFn } from 'src/types/types';
import { getContext, setContext } from 'svelte';
import { writable, type Readable, type Writable } from 'svelte/store';

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
    this._onItemTableToggle =
      getContext<OnItemTableToggleFn>('onItemTableToggle');
    this._location = getContext<string>('location');
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
    const itemTableToggles =
      getContext<Map<string, boolean>>('itemTableToggles');
    const location = getContext<string>('location') ?? '';

    const service = new ExpandCollapseService({
      expanded: itemTableToggles?.get(location) ?? true,
      toggleable,
    });
    setContext(ExpandCollapseService.contextKey, service);
    return service;
  }
}
