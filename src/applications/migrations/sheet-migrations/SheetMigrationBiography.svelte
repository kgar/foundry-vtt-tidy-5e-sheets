<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Actor5e } from 'src/types/types';
  import { error } from 'src/utils/logging';
  import { migrateBiographicalFlagsToV2Data } from '../v2/biographical-flags-to-v2';
  import { MigrationUtilities } from '../MigrationUtilities';
  import { CONSTANTS } from 'src/constants';

  import { MigrationSelectionApplication } from '../migration-selection/MigrationSelectionApplication';

  /** Optionally target a single actor. Else, present as a bulk migration. */
  export let actor: Actor5e | null = null;

  $: applyAllDefault = actor !== null ? false : true;

  let migrating = false;
  let overwrite = false;
  let applyAll = false;
  $: applyAll = applyAllDefault;
  let deleteFlags = false;

  const localize = FoundryAdapter.localize;

  async function migrate() {
    if (!applyAll) {
      MigrationUtilities.confirmMigration(async () => {
        try {
          migrating = true;
          ui.notifications.info(
            localize('TIDY5E.Settings.Migrations.migrationBeginningMessage'),
          );
          migrateActor(actor);
        } finally {
          migrating = false;
          ui.notifications.info(
            FoundryAdapter.localize(
              'TIDY5E.Settings.Migrations.migrationCompleteMessage',
            ),
          );
          overwrite = false;
          applyAll = applyAllDefault;
          deleteFlags = false;
        }
      });
      return;
    }

    promptBulkMigration();
  }

  function promptBulkMigration() {
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
                propPath: 'name',
                onClick: (target: Actor5e) => target.sheet.render(true),
              },
              name: localize(
                'TIDY5E.MigrationSelectionDialog.SelectColumnText',
              ),
            },
          ],
          documents: actorsToMigrate,
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
    applyAll = applyAllDefault;
    deleteFlags = false;
  }

  async function migrateActor(actor: Actor5e) {
    try {
      migrateBiographicalFlagsToV2Data({
        document: actor,
        clearBiographicalFlagData: deleteFlags,
        overwrite: overwrite,
      });
    } catch (e) {
      error('An error occurred while migrating biographical data', false, e);
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
  <h2>{localize('TIDY5E.SheetMigrations.CharacterBiography.sectionTitle')}</h2>
  <ul>
    <li>{localize('DND5E.Age')}</li>
    <li>{localize('DND5E.Eyes')}</li>
    <li>{localize('DND5E.Gender')}</li>
    <li>{localize('DND5E.Hair')}</li>
    <li>{localize('DND5E.Height')}</li>
    <li>{localize('DND5E.Skin')}</li>
    <li>{localize('DND5E.Weight')}</li>
  </ul>
  <h3>{localize('TIDY5E.SheetMigrations.OptionsHeader')}</h3>
  <div class="options grid-auto-columns">
    <label
      class="green-checkbox"
      data-tooltip={localize('TIDY5E.SheetMigrations.OptionOverwrite.Tooltip')}
    >
      <input type="checkbox" bind:checked={overwrite} disabled={migrating} />
      {localize('TIDY5E.SheetMigrations.OptionOverwrite.Text')}
    </label>

    {#if FoundryAdapter.userIsGm() && actor}
      <label
        class="green-checkbox"
        data-tooltip={localize(
          'TIDY5E.SheetMigrations.OptionApplyMultiple.Tooltip',
        )}
      >
        <input
          type="checkbox"
          bind:checked={applyAll}
          disabled={migrating || !actor}
        />
        {localize('TIDY5E.GMOnly.Message', {
          message: localize('TIDY5E.SheetMigrations.OptionApplyMultiple.Text'),
        })}
      </label>
    {/if}

    <label
      class="green-checkbox"
      data-tooltip={localize(
        'TIDY5E.SheetMigrations.OptionDeleteFlags.Tooltip',
      )}
    >
      <input type="checkbox" bind:checked={deleteFlags} disabled={migrating} />

      {localize('TIDY5E.SheetMigrations.OptionDeleteFlags.Text')}
    </label>
  </div>

  <button type="button" on:click={(ev) => migrate()} disabled={migrating}
    >{localize('TIDY5E.SheetMigrations.ButtonMigration.Text')}</button
  >
</section>

<style lang="scss">
  section {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  ul {
    // flex: 1;
  }

  .options {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  button {
    margin-top: auto;
  }
</style>
