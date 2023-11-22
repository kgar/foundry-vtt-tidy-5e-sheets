import type { SvelteComponent } from 'svelte';
import SvelteFormApplicationBase from '../SvelteFormApplicationBase';
import Test from './Test.svelte';
import type { Actor5e } from 'src/types/types';
import { writable } from 'svelte/store';

type TabSelectionItem = {
  id: string;
  label: string;
};

type TabSelectionContext = {
  available: TabSelectionItem[];
  selected: TabSelectionItem[];
};

export default class TabSelectionFormApplication extends SvelteFormApplicationBase {
  actor: Actor5e;
  context = writable<TabSelectionContext>({ available: [], selected: [] });

  constructor(actor: Actor5e, ...args: any[]) {
    super(...args);
    this.actor = actor;
  }

  createComponent(node: HTMLElement): SvelteComponent<any, any, any> {
    return new Test({
      target: node,
      context: new Map<any, any>([
        ['context', this.context],
        ['appId', this.appId],
      ]),
    });
  }

  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      title: 'T5EK.TabSelection.Title',
      height: 750,
      width: 750,
      classes: [...super.defaultOptions.classes, 'tab-selection'],
    };
  }

  getData() {
    return {
      available: [],
      selected: [],
    } satisfies TabSelectionContext;
  }

  async _updateObject(): Promise<void> {
    // await this.save();
  }

  refreshContext() {
    this.context.set(this.getData());
  }
}
