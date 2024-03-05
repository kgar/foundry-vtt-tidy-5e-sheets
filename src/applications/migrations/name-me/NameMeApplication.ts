import type { SvelteComponent } from 'svelte';
import SvelteFormApplicationBase from '../../SvelteFormApplicationBase';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import NameMe from './NameMe.svelte';
import type { FigureItOut } from './FigureItOut';

export class NameMeApplication<T> extends SvelteFormApplicationBase {
  _targets: FigureItOut<T>;
  _onClose?: Function;

  constructor(targets: FigureItOut<T>, onClose?: Function) {
    super();
    this._targets = targets;
    this._onClose = onClose;
  }

  static get defaultOptions() {
    return FoundryAdapter.mergeObject(super.defaultOptions, {
      title: FoundryAdapter.localize('TIDY5E.Settings.Migrations.dialogTitle'),
      width: 650,
      height: 500,
      id: 'tidy-5e-sheets-migrations',
      popOut: true,
    });
  }

  createComponent(node: HTMLElement): SvelteComponent<any, any, any> {
    return new NameMe({
      target: node,
      props: {
        figureItOut: this._targets,
      },
    });
  }

  close(...args: any[]) {
    this._onClose?.();
    super.close(...args);
  }
}
