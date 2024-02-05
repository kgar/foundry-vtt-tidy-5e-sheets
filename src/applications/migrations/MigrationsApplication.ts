import type { SvelteComponent } from 'svelte';
import SvelteFormApplicationBase from '../SvelteFormApplicationBase';
import Migrations from './Migrations.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export class MigrationsApplication extends SvelteFormApplicationBase {
  static get defaultOptions() {
    return FoundryAdapter.mergeObject(super.defaultOptions, {
      title: FoundryAdapter.localize('TIDY5E.Settings.Migrations.dialogTitle'),
      width: 650,
      height: 500,
    });
  }

  createComponent(node: HTMLElement): SvelteComponent<any, any, any> {
    return new Migrations({
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
