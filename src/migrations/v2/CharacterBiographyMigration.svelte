<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Actor5e } from 'src/types/types';
  import { debug, error } from 'src/utils/logging';
  import { migrateBiographicalFlagsToV2Data } from './biographical-flags-to-v2';
  import { CONSTANTS } from 'src/constants';

  import { MigrationSelectionApplication } from '../migration-selection/MigrationSelectionApplication';

  let migrating = false;
  let overwrite = false;
  let deleteFlags = false;

  const localize = FoundryAdapter.localize;

  async function migrate() {
    try {
      const actorsToMigrate = Array.from<any>(game.actors).filter(
        (a) => a.type === CONSTANTS.SHEET_TYPE_CHARACTER,
      );
      new MigrationSelectionApplication<Actor5e>(
        {
          onConfirm: async (selected) => {
            migrating = true;
            ui.notifications.info(
              localize('TIDY5E.Settings.Migrations.migrationBeginningMessage'),
            );
            migrateActors(selected);
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
            'TIDY5E.Settings.Migrations.CharacterBiography.selectionDialogTitle',
          ),
        },
        () => {
          migrating = false;
        },
      ).render(true);
    } catch (e) {
      error('An error occurred while preparing a bulk migration', false, e);
    }
  }

  async function migrateActors(actors: Actor5e[]) {
    try {
      for (let actorToMigrate of actors) {
        await migrateActor(actorToMigrate);
      }
    } finally {
      migrating = false;
      ui.notifications.info(
        FoundryAdapter.localize(
          'TIDY5E.Settings.Migrations.migrationCompleteMessage',
        ),
      );
      resetOptions();
    }
  }

  function resetOptions() {
    overwrite = false;
    deleteFlags = false;
  }

  async function migrateActor(actor: Actor5e) {
    try {
      debug(`Migrating actor ${actor?.name}...`);
      migrateBiographicalFlagsToV2Data({
        document: actor,
        clearBiographicalFlagData: deleteFlags,
        overwrite: overwrite,
      });
      debug(`Actor ${actor?.name} migration successful!`);
    } catch (e) {
      error(
        `An error occurred while migrating biographical data for ${actor?.name}`,
        false,
        e,
      );
      ui.notifications.error(
        FoundryAdapter.localize(
          'TIDY5E.Settings.Migrations.migrationErrorMessage',
        ),
        { permanent: true },
      );
    }
  }
</script>

<section>
  <h2>
    {localize('TIDY5E.Settings.Migrations.CharacterBiography.sectionTitle')}
  </h2>
  <ul>
    <li>{localize('DND5E.Age')}</li>
    <li>{localize('DND5E.Eyes')}</li>
    <li>{localize('DND5E.Gender')}</li>
    <li>{localize('DND5E.Hair')}</li>
    <li>{localize('DND5E.Height')}</li>
    <li>{localize('DND5E.Skin')}</li>
    <li>{localize('DND5E.Weight')}</li>
  </ul>
  <h3>{localize('TIDY5E.Settings.Migrations.OptionsHeader')}</h3>
  <div class="options grid-auto-columns">
    <label
      class="green-checkbox"
      data-tooltip={localize(
        'TIDY5E.Settings.Migrations.OptionOverwrite.Tooltip',
      )}
    >
      <input type="checkbox" bind:checked={overwrite} disabled={migrating} />
      {localize('TIDY5E.Settings.Migrations.OptionOverwrite.Text')}
    </label>

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

  <button type="button" on:click={(ev) => migrate()} disabled={migrating}
    >{localize('TIDY5E.Settings.Migrations.ButtonMigration.Text')}</button
  >
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

  button {
    margin-top: auto;
  }
</style>
