import { FoundryAdapter } from "src/foundry/foundry-adapter";

export class MigrationUtilities {
  static confirmMigration(onYes: () => void) {
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
