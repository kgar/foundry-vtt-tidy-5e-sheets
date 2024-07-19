import type { SvelteComponent } from 'svelte';
import SvelteFormApplicationBase from '../SvelteFormApplicationBase';
import MaxPreparedSpellsConfig from './MaxPreparedSpellsConfig.svelte';
import type { Actor5e, MaxPreparedSpellFormula } from 'src/types/types';
import { get, writable, type Writable } from 'svelte/store';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { CONSTANTS } from 'src/constants';
import { getMaxPreparedSpellsSampleFormulas } from 'src/utils/formula';
import { TidyFlags } from 'src/foundry/TidyFlags';

export type MaxPreparedSpellsConfigContext = {
  maxPreparedSpells: string;
  formulas: MaxPreparedSpellFormula[];
  actor: Actor5e;
};

export class MaxPreparedSpellsConfigFormApplication extends SvelteFormApplicationBase {
  context: Writable<MaxPreparedSpellsConfigContext>;
  actor: Actor5e;

  constructor(actor: Actor5e, ...args: any[]) {
    super(...args);
    this.actor = actor;

    this.context = writable({
      maxPreparedSpells: '',
      formulas: getMaxPreparedSpellsSampleFormulas(),
      actor,
    });
  }

  createComponent(node: HTMLElement): SvelteComponent<any, any, any> {
    this.context.set(this.getData());

    return new MaxPreparedSpellsConfig({
      target: node,
      context: new Map<any, any>([
        ['context', this.context],
        ['appId', this.appId],
      ]),
    });
  }

  getData(): MaxPreparedSpellsConfigContext {
    return {
      maxPreparedSpells: TidyFlags.maxPreparedSpells.get(this.actor) ?? '',
      formulas: getMaxPreparedSpellsSampleFormulas(),
      actor: this.actor,
    };
  }

  static get defaultOptions() {
    return FoundryAdapter.mergeObject(super.defaultOptions, {
      width: 500,
      height: 'auto',
      sheetConfig: false,
      resizable: false,
    });
  }

  get title() {
    return FoundryAdapter.localize('TIDY5E.MaxPreparedSpellsConfig.Title', {
      actorName: this.actor.name,
    });
  }

  async _updateObject(): Promise<void> {
    const data = get(this.context);
    await this.actor.update({
      [TidyFlags.maxPreparedSpells.prop]: data?.maxPreparedSpells ?? '',
    });
  }
}
