import { mount } from 'svelte';
import BulkMigrations from './BulkMigrations.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type { ApplicationConfiguration } from 'src/types/application.types';
import { CONSTANTS } from 'src/constants';

export type ConfirmMigrationFunction = (onYes: () => void) => void;

interface ConfirmsMigrations {
  confirm: ConfirmMigrationFunction;
}

export class BulkMigrationsApplication
  extends SvelteApplicationMixin<
    Partial<ApplicationConfiguration> | undefined,
    {}
  >(foundry.applications.api.ApplicationV2)
  implements ConfirmsMigrations
{
  static DEFAULT_OPTIONS = {
    classes: [
      CONSTANTS.MODULE_ID,
      'application',
      CONSTANTS.SHEET_LAYOUT_QUADRONE,
    ],
    id: 'tidy-5e-sheets-bulk-migrations',
    window: {
      title: 'TIDY5E.Settings.Migrations.dialogTitle',
    },
    position: {
      width: 650,
      height: 500,
    },
  };

  constructor(args?: Partial<ApplicationConfiguration>) {
    super(args);
  }

  _createComponent(node: HTMLElement): Record<string, any> {
    return mount(BulkMigrations, {
      target: node,
      context: new Map<any, any>([['confirm', this.confirm]]),
    });
  }

  async confirm(onYes: () => void) {
    const proceed = await foundry.applications.api.DialogV2.confirm({
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
      yes: {
        icon: '<i class="fas fa-right-left"></i>',
        label: FoundryAdapter.localize(
          'TIDY5E.Settings.Migrations.migrateConfirmButtonYes'
        ),
        default: true,
      },
      no: {
        icon: '<i class="fas fa-times"></i>',
        label: FoundryAdapter.localize(
          'TIDY5E.Settings.Migrations.migrateConfirmButtonNo'
        ),
      },
      close: () => {},
    });

    if (proceed) {
      onYes();
    }
  }
}
