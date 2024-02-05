import { writable, type Readable, type Writable } from 'svelte/store';

export type ExpandCollapseServiceState = {
  expanded: boolean;
  toggleable: boolean;
};

export class ExpandCollapseService {
  static readonly contextKey = 'expandCollapseService';

  protected _state: Writable<ExpandCollapseServiceState>;
  state: Readable<ExpandCollapseServiceState>;

  constructor(
    initialState: ExpandCollapseServiceState = {
      expanded: true,
      toggleable: true,
    }
  ) {
    this._state = writable({ ...initialState });
    this.state = this._state;
  }

  toggle() {
    this._state.update((current) => {
      return {
        ...current,
        expanded: !current.expanded,
      };
    });
  }

  set(expanded: boolean) {
    this._state.update((current) => {
      return {
        ...current,
        expanded: expanded,
      };
    });
  }
}
