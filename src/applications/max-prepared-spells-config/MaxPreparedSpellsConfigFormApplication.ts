import type { SvelteComponent } from 'svelte';
import SvelteFormApplicationBase from '../SvelteFormApplicationBase';
import MaxPreparedSpellsConfig from './MaxPreparedSpellsConfig.svelte';
import type { Actor5e } from 'src/types/types';
import { get, writable, type Writable } from 'svelte/store';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { CONSTANTS } from 'src/constants';

export type MaxPreparedSpellFormula = {
  label: string;
  value: string;
};

export type MaxPreparedSpellsConfigContext = {
  maxPreparedSpells: string;
  formulas: MaxPreparedSpellFormula[];
  actor: Actor5e;
};

const classFormulas: MaxPreparedSpellFormula[] = [
  {
    label: 'T5EK.Class.Artificer',
    value: '@abilities.int.mod + floor(@classes.artificer.levels / 2)',
  },
  {
    label: 'T5EK.Class.Cleric',
    value: '@abilities.wis.mod + @classes.cleric.levels',
  },
  {
    label: 'T5EK.Class.Druid',
    value: '@abilities.wis.mod + @classes.druid.levels',
  },
  {
    label: 'T5EK.Class.Paladin',
    value: '@abilities.cha.mod + floor(@classes.paladin.levels / 2)',
  },
  { label: 'T5EK.Class.Ranger', value: 'ceil(@classes.rangers.levels/2)+1' },
  {
    label: 'T5EK.Class.Wizard',
    value: '@abilities.int.mod + @classes.wizard.levels',
  },
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
      maxPreparedSpells:
        FoundryAdapter.tryGetFlag(
          this.actor,
          'maxPreparedSpells'
        )?.toString() ?? '',
      formulas: classFormulas,
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
