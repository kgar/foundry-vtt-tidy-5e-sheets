import { getContext, setContext } from 'svelte';
import { writable, type Readable, type Writable } from 'svelte/store';

export interface ExpandAllCollapseAllSignal {
  command?: 'expand' | 'collapse';
}

export class ExpandAllCollapseAllService {
  protected _state: Writable<ExpandAllCollapseAllSignal>;
  signal: Readable<ExpandAllCollapseAllSignal>;

  constructor() {
    this._state = writable<ExpandAllCollapseAllSignal>({});
    this.signal = this._state;
  }

  expandAll() {
    this._state.set({ command: 'expand' });
  }

  collapseAll() {
    this._state.set({ command: 'collapse' });
  }

  static initService() {
    const service = new this();
    setContext('expand-all-collapse-all-service', service);
    return service;
  }

  static getSignal(): Readable<ExpandAllCollapseAllSignal> | undefined {
    return getContext<ExpandAllCollapseAllService>(
      'expand-all-collapse-all-service'
    )?.signal;
  }
}
