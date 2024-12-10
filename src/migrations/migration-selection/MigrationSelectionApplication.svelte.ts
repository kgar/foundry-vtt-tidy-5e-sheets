import { mount } from 'svelte';
import SvelteFormApplicationBase from 'src/applications/SvelteFormApplicationBase';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import MigrationSelection from './MigrationSelection.svelte';
import type {
  MigrationSelectionParams,
  SelectableMigrationSelectionParams,
} from './migration-selection.types';

export class MigrationSelectionApplication<
  T
> extends SvelteFormApplicationBase {
  _params = $state<SelectableMigrationSelectionParams<T>>()!;
  _onClose?: Function;
  _title?: string;

  constructor(
    params: MigrationSelectionParams<T>,
    onClose?: Function,
    options?: any
  ) {
    super(
      {},
      FoundryAdapter.mergeObject(
        MigrationSelectionApplication.defaultOptions,
        options
      )
    );

    this._params = {
      ...params,
      selectables: params.documents.map((d) => ({
        document: d,
        selected: true,
      })),
    };

    this._title = params.title;

    this._onClose = onClose;
  }

  static get defaultOptions() {
    return FoundryAdapter.mergeObject(super.defaultOptions, {
      width: 650,
      height: 500,
      id: 'tidy-5e-sheets-migration-selection',
      popOut: true,
      closeOnSubmit: true,
    });
  }

  get title() {
    return (
      this._title ??
      FoundryAdapter.localize('TIDY5E.Settings.Migrations.dialogTitle')
    );
  }

  createComponent(node: HTMLElement): Record<string, any> {
    return mount(MigrationSelection, {
      target: node,
      props: {
        params: this._params,
      },
    });
  }

  close(...args: any[]) {
    this._onClose?.();
    super.close(...args);
  }
}
