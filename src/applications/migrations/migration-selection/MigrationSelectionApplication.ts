import type { SvelteComponent } from 'svelte';
import SvelteFormApplicationBase from '../../SvelteFormApplicationBase';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import MigrationSelection from './MigrationSelection.svelte';
import type {
  MigrationSelectionParams,
  SelectableMigrationSelectionParams,
} from './migration-selection.types';

export class MigrationSelectionApplication<
  T
> extends SvelteFormApplicationBase {
  _params: MigrationSelectionParams<T>;
  _onClose?: Function;

  constructor(
    params: MigrationSelectionParams<T>,
    onClose?: Function,
    options?: any
  ) {
    super(
      FoundryAdapter.mergeObject(
        MigrationSelectionApplication.defaultOptions,
        options
      )
    );
    this._params = params;
    this._onClose = onClose;
  }

  static get defaultOptions() {
    return FoundryAdapter.mergeObject(super.defaultOptions, {
      width: 650,
      height: 500,
      id: 'tidy-5e-sheets-migration-selection',
      popOut: true,
    });
  }

  get title() {
    return (
      this._params.title ??
      FoundryAdapter.localize('TIDY5E.Settings.Migrations.dialogTitle')
    );
  }

  createComponent(node: HTMLElement): SvelteComponent<any, any, any> {
    const selectableParams: SelectableMigrationSelectionParams<T> = {
      ...this._params,
      selectables: this._params.documents.map((d) => ({
        document: d,
        selected: true,
      })),
    };
    return new MigrationSelection({
      target: node,
      props: {
        params: selectableParams,
      },
    });
  }

  close(...args: any[]) {
    this._onClose?.();
    super.close(...args);
  }
}
