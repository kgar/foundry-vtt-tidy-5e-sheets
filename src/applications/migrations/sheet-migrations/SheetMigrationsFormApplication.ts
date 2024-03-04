import type { SvelteComponent } from 'svelte';
import SvelteFormApplicationBase from '../../SvelteFormApplicationBase';
import type { Actor5e } from 'src/types/types';
import SheetMigrations from './SheetMigrations.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export default class SheetMigrationsFormApplication extends SvelteFormApplicationBase {
  _actor: Actor5e;

  constructor(actor: Actor5e) {
    super();
    this._actor = actor;
  }

  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      height: 'auto',
      width: 750,
      classes: [...super.defaultOptions.classes, 'sheet-migrations'],
      resizable: true,
    };
  }

  get title() {
    return FoundryAdapter.localize('TIDY5E.SheetMigrations.Title', {
      documentNameOrType: this._actor.name,
    });
  }

  createComponent(node: HTMLElement): SvelteComponent<any, any, any> {
    return new SheetMigrations({
      target: node,
      props: {
        actor: this._actor,
      },
    });
  }
}
