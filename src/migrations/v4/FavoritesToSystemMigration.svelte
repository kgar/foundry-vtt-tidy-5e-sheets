<script lang="ts">
  import { MigrationSelectionApplication } from '../migration-selection/MigrationSelectionApplication';
  import type { Actor5e } from 'src/types/types';
  import { migrateFavoritesToSystem } from './favorites-to-system';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';

  let migrating = false;
  let deleteFlags = false;

  const localize = FoundryAdapter.localize;

  async function migrate() {
    const actorsToMigrate = Array.from<Actor5e>(game.actors).filter(
      (a) => a.isOwner && a.type === CONSTANTS.SHEET_TYPE_CHARACTER,
    );

    new MigrationSelectionApplication<{ item: Actor5e }>({
      onConfirm: async (selected) => {
        migrating = true;

        ui.notifications.info(
          localize('TIDY5E.Settings.Migrations.migrationBeginningMessage'),
        );

        for (let choice of selected) {
          await migrateFavoritesToSystem({
            pc: choice,
            clearFavoriteFlagData: deleteFlags,
          });
        }

        ui.notifications.info(
          localize('TIDY5E.Settings.Migrations.migrationCompleteMessage'),
        );

        resetOptions();

        migrating = false;
      },
      columns: [
        {
          cellWidth: 'primary',
          field: {
            type: 'simple',
            propPath: 'name',
            onClick: (target: Actor5e) => target.sheet.render(true),
          },
          name: localize('TIDY5E.Settings.Migrations.Selection.ToMigrate'),
        },
      ],
      documents: actorsToMigrate,
      title: FoundryAdapter.localize(
        'TIDY5E.Settings.Migrations.FavoritesToSystem.selectionDialogTitle',
      ),
    }).render(true);

    function resetOptions() {
      deleteFlags = false;
    }
  }
</script>

<section>
  <h2>
    {localize('TIDY5E.Settings.Migrations.FavoritesToSystem.sectionTitle')}
  </h2>
  <h3>{localize('TIDY5E.Settings.Migrations.OptionsHeader')}</h3>
  <div class="options grid-auto-columns">
    <label
      class="green-checkbox"
      data-tooltip={localize(
        'TIDY5E.Settings.Migrations.OptionDeleteFlags.Tooltip',
      )}
    >
      <input type="checkbox" bind:checked={deleteFlags} disabled={migrating} />

      {localize('TIDY5E.Settings.Migrations.OptionDeleteFlags.Text')}
    </label>
  </div>

  <footer class="flex-row extra-small-gap">
    <button type="button" on:click={(ev) => migrate()} disabled={migrating}
      >{localize('TIDY5E.Settings.Migrations.ButtonMigration.Text')}</button
    >
  </footer>
</section>

<style lang="scss">
  section {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .options {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  footer {
    margin-top: auto;
  }
</style>
