import type { SvelteComponent } from 'svelte';
import SvelteFormApplicationBase from 'src/applications/SvelteFormApplicationBase';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import MigrationNotification from './MigrationNotification.svelte';
import { MigrationTally } from 'src/migrations/MigrationTally';
import { CONSTANTS } from 'src/constants';

export default class MigrationNotificationFormApplication extends SvelteFormApplicationBase {
  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      height: 'auto',
      width: 400,
      classes: [
        ...super.defaultOptions.classes,
        'migration-notifications',
        'app-v1',
        CONSTANTS.SHEET_LAYOUT_CLASSIC,
      ],
      resizable: true,
    };
  }

  get title() {
    return FoundryAdapter.localize(
      'TIDY5E.Settings.Migrations.Notification.Title'
    );
  }

  createComponent(node: HTMLElement): SvelteComponent<any, any, any> {
    return new MigrationNotification({
      target: node,
      context: new Map<string, any>([['confirm', this.confirm.bind(this)]]),
    });
  }

  confirm() {
    FoundryAdapter.setTidySetting(
      'migrationsConfirmationTally',
      MigrationTally
    );

    this.close();

    ui.notifications.info(
      FoundryAdapter.localize(
        'TIDY5E.Settings.Migrations.Notification.DoNotShowAgain.ConfirmMessage'
      ),
      { permanent: true }
    );
  }
}
