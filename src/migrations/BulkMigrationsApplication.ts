import { mount } from 'svelte';
import SvelteFormApplicationBase from 'src/applications/SvelteFormApplicationBase';
import BulkMigrations from './BulkMigrations.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export type ConfirmMigrationFunction = (onYes: () => void) => void;

interface ConfirmsMigrations {
  confirm: ConfirmMigrationFunction;
}

export class BulkMigrationsApplication
  extends SvelteFormApplicationBase
  implements ConfirmsMigrations
{
  _selectedTabId?: string;

  constructor(selectedTabId?: string) {
    super();

    this._selectedTabId = selectedTabId;
  }

  static get defaultOptions() {
    return FoundryAdapter.mergeObject(super.defaultOptions, {
      title: FoundryAdapter.localize('TIDY5E.Settings.Migrations.dialogTitle'),
      width: 650,
      height: 500,
      id: 'tidy-5e-sheets-bulk-migrations',
      popOut: true,
    });
  }

  createComponent(node: HTMLElement): Record<string, any> {
    return mount(BulkMigrations, {
      target: node,
      context: new Map<any, any>([['confirm', this.confirm]]),
      props: {
        selectedTabId: this._selectedTabId,
      },
    });
  }

  confirm(onYes: () => void) {
    const dlg = new Dialog({
      title: FoundryAdapter.localize(
        'TIDY5E.Settings.Migrations.migrateConfirmTitle'
      ),
      content: `
        <p>${FoundryAdapter.localize(
          'TIDY5E.Settings.Migrations.migrateConfirmMessage1'
        )}</p>
        <p><em>${FoundryAdapter.localize(
          'TIDY5E.Settings.Migrations.migrateConfirmMessage2',
          { boldStart: '<strong>', boldEnd: '</strong>' }
        )}</em></p>
      `,
      buttons: {
        yes: {
          icon: '<i class="fas fa-right-left"></i>',
          label: FoundryAdapter.localize(
            'TIDY5E.Settings.Migrations.migrateConfirmButtonYes'
          ),
          callback: () => {
            onYes();
          },
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: FoundryAdapter.localize(
            'TIDY5E.Settings.Migrations.migrateConfirmButtonNo'
          ),
        },
      },
      default: 'yes',
      close: () => {},
    });
    dlg.render(true);
  }
}
