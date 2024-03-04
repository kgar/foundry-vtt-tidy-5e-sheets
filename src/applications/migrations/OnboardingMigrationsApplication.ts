import type { SvelteComponent } from 'svelte';
import SvelteFormApplicationBase from '../SvelteFormApplicationBase';
import OnboardingMigrations from './OnboardingMigrations.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export type ConfirmMigrationFunction = (onYes: () => void) => void;

interface ConfirmsMigrations {
  confirm: ConfirmMigrationFunction;
}

export class OnboardingMigrationsApplication
  extends SvelteFormApplicationBase
  implements ConfirmsMigrations
{
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
    return new OnboardingMigrations({
      target: node,
      context: new Map<any, any>([['confirm', this.confirm]]),
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
