import type { SvelteComponent } from 'svelte';
import SvelteFormApplicationBase from '../SvelteFormApplicationBase';
import MaxPreparedSpellsConfig from './MaxPreparedSpellsConfig.svelte';
import type { Actor5e } from 'src/types/types';
import { get, writable, type Writable } from 'svelte/store';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { CONSTANTS } from 'src/constants';

export type MaxPreparedSpellFormula = {
  label: string;
  formula: string;
};

export type MaxPreparedSpellsConfigContext = {
  maxPreparedSpells: string;
  formulas: MaxPreparedSpellFormula[];
};

const classFormulas = [
  {
    label: 'T5EK.Class.Artificer',
    formula: '@abilities.int.mod + floor(@classes.artificer.levels / 2)',
  },
  { label: 'T5EK.Class.Barbarian', formula: '' },
  { label: 'T5EK.Class.Bard', formula: '' },
  { label: 'T5EK.Class.Cleric', formula: '' },
  { label: 'T5EK.Class.Custom', formula: '' },
  { label: 'T5EK.Class.Druid', formula: '' },
  { label: 'T5EK.Class.Fighter', formula: '' },
  { label: 'T5EK.Class.Monk', formula: '' },
  { label: 'T5EK.Class.Paladin', formula: '' },
  { label: 'T5EK.Class.Ranger', formula: '' },
  { label: 'T5EK.Class.Rogue', formula: '' },
  { label: 'T5EK.Class.Sorcerer', formula: '' },
  { label: 'T5EK.Class.Warlock', formula: '' },
  { label: 'T5EK.Class.Wizard', formula: '' },
];
export class MaxPreparedSpellsConfigFormApplication extends SvelteFormApplicationBase {
  context: Writable<MaxPreparedSpellsConfigContext>;
  actor: Actor5e;

  constructor(actor: Actor5e, ...args: any[]) {
    super(...args);
    this.actor = actor;

    this.context = writable({
      maxPreparedSpells: '',
      formulas: classFormulas,
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
      maxPreparedSpells:
        FoundryAdapter.tryGetFlag(
          this.actor,
          'maxPreparedSpells'
        )?.toString() ?? '',
      formulas: classFormulas,
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
    return FoundryAdapter.localize('T5EK.MaxPreparedSpellsConfig.Title', {
      actorName: this.actor.name,
    });
  }

  async _updateObject(): Promise<void> {
    const data = get(this.context);
    await this.actor.update({
      [`flags.${CONSTANTS.MODULE_ID}.maxPreparedSpells`]:
        data?.maxPreparedSpells ?? '',
    });
  }
}
