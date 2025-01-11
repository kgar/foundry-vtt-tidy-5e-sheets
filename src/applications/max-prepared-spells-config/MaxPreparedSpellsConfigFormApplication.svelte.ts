import { mount } from 'svelte';
import SvelteFormApplicationBase from '../SvelteFormApplicationBase';
import MaxPreparedSpellsConfig from './MaxPreparedSpellsConfig.svelte';
import type { Actor5e, MaxPreparedSpellFormula } from 'src/types/types';
import type { Item5e } from 'src/types/item.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { getMaxPreparedSpellsSampleFormulas } from 'src/utils/formula';

export type MaxPreparedSpellsConfigContext = {
  maxPreparedSpells: string;
  formulas: MaxPreparedSpellFormula[];
};

export class MaxPreparedSpellsConfigFormApplication extends SvelteFormApplicationBase {
  context = $state<MaxPreparedSpellsConfigContext>();
  actor: Actor5e;
  classToUpdate: Item5e;

  constructor(documentName: string, classToUpdate: Item5e, ...args: any[]) {
    super(...args);
    this.documentName = documentName;
    this.classToUpdate = classToUpdate;

    this.context = {
      maxPreparedSpells: '',
      formulas: getMaxPreparedSpellsSampleFormulas(),
    };
  }

  createComponent(node: HTMLElement): Record<string, any> {
    this.context = this.getData();

    return mount(MaxPreparedSpellsConfig, {
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
        this.classToUpdate?.system?.spellcasting?.preparation?.formula ?? '',
      formulas: getMaxPreparedSpellsSampleFormulas(),
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
      documentName: this.documentName,
    });
  }

  async _updateObject(): Promise<void> {
    await this.classToUpdate.update({
      'system.spellcasting.preparation.formula':
        this.context?.maxPreparedSpells ?? '',
    });
    this.close();
  }
}
