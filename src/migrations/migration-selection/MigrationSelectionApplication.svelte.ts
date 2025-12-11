import { mount } from 'svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import MigrationSelection from './MigrationSelection.svelte';
import type {
  MigrationSelectionParams,
  SelectableMigrationSelectionParams,
} from './migration-selection.types';
import type { ApplicationConfiguration } from 'src/types/application.types';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import { CONSTANTS } from 'src/constants';

export class MigrationSelectionApplication<T> extends SvelteApplicationMixin<
  Partial<ApplicationConfiguration> | undefined,
  {}
>(foundry.applications.api.ApplicationV2) {
  _params = $state<SelectableMigrationSelectionParams<T>>()!;
  _onApplicationClosed?: Function;
  _title?: string;

  static DEFAULT_OPTIONS = {
    classes: [
      CONSTANTS.MODULE_ID,
      'application',
      CONSTANTS.SHEET_LAYOUT_QUADRONE,
    ],
    id: 'tidy-5e-sheets-migration-selection',
    tag: 'form',
    form: {
      closeOnSubmit: true,
    },
    position: {
      width: 650,
      height: 500,
    },
  };

  constructor(
    params: MigrationSelectionParams<T>,
    onClose?: Function,
    options?: Partial<ApplicationConfiguration>
  ) {
    super(options);

    this._params = {
      ...params,
      selectables: params.documents.map((d) => ({
        document: d,
        selected: true,
      })),
    };

    this._title = params.title;

    this._onApplicationClosed = onClose;
  }

  get title() {
    return (
      this._title ??
      FoundryAdapter.localize('TIDY5E.Settings.Migrations.dialogTitle')
    );
  }

  _createComponent(node: HTMLElement): Record<string, any> {
    return mount(MigrationSelection, {
      target: node,
      props: {
        params: this._params,
      },
    });
  }

  async close(...args: any[]) {
    await this._onApplicationClosed?.();
    await super.close(...args);
  }
}
