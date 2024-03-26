<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Actor5e } from 'src/types/types';
  import { debug, error } from 'src/utils/logging';
  import { migrateNpcDeathFlagsToV2 } from './npc-death-flags-to-v2';
  import { MigrationSelectionApplication } from '../migration-selection/MigrationSelectionApplication';
  import { CONSTANTS } from 'src/constants';

  let migrating = false;
  let overwrite = false;
  let deleteFlags = false;

  async function migrate() {
    try {
      const actorsToMigrate = Array.from<any>(game.actors).filter(
        (a) => a.type === CONSTANTS.SHEET_TYPE_NPC,
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
                propPath: 'name',
                onClick: (target: Actor5e) => target.sheet.render(true),
              },
              name: localize('TIDY5E.Settings.Migrations.Selection.ToMigrate'),
            },
            {
              cellWidth: '5rem',
              field: {
                propPath: `flags.${CONSTANTS.MODULE_ID}.death.success`,
              },
              name: localize('DND5E.DeathSaveSuccesses'),
            },
            {
              cellWidth: '5rem',
              field: {
                propPath: `flags.${CONSTANTS.MODULE_ID}.death.failure`,
              },
              name: localize('DND5E.DeathSaveFailures'),
            },
          ],
          documents: actorsToMigrate,
          title: FoundryAdapter.localize(
            'TIDY5E.Settings.Migrations.NpcDeathSaves.selectionDialogTitle',
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
  }

  async function migrateActor(actor: Actor5e) {
    try {
      debug(`Migrating actor ${actor?.name}...`);
      migrateNpcDeathFlagsToV2({
        document: actor,
        overwrite: overwrite,
        clearDeathFlagData: deleteFlags,
      });
      debug(`Actor ${actor?.name} migration successful!`);
    } catch (e) {
      error(
        `An error occurred while migrating NPC death save data for ${actor?.name}`,
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

  const localize = FoundryAdapter.localize;
</script>

<section>
  <h2>
    {localize('TIDY5E.Settings.Migrations.NpcDeathSaves.sectionTitle')}
  </h2>
  <ul>
    <li>{localize('DND5E.DeathSave')}</li>
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
