<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Actor5e } from 'src/types/types';
  import { error } from 'src/utils/logging';
  import { migrateBiographicalFlagsToV2Data } from '../v2/biographical-flags-to-v2';
  import { MigrationUtilities } from '../MigrationUtilities';
  import { CONSTANTS } from 'src/constants';
  import type { FigureItOut, FigureItOutOption } from '../name-me/FigureItOut';
  import { NameMeApplication } from '../name-me/NameMeApplication';

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

    // Do Bulk Migration
    try {
      const figureItOutOptions = Array.from<any>(game.actors)
        .filter((a) => a.type === CONSTANTS.SHEET_TYPE_CHARACTER)
        .map<FigureItOutOption<Actor5e>>((a) => ({
          fields: [
            {
              text: a.name,
              onClick: (target: Actor5e) => target.sheet.render(true),
            },
            {
              text: 'Test',
            },
          ],
          id: a.id,
          selected: true,
          target: a,
        }));

      new NameMeApplication(
        {
          options: figureItOutOptions,
          onConfirm: async (selected) => {
            migrating = true;
            ui.notifications.info(
              localize('TIDY5E.Settings.Migrations.migrationBeginningMessage'),
            );
            migrateActors(selected);
          },
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

<h2>{localize('DND5E.Biography')}</h2>
<div class="flex-column">
  <ul>
    <li>{localize('DND5E.Age')}</li>
    <li>{localize('DND5E.Eyes')}</li>
    <li>{localize('DND5E.Gender')}</li>
    <li>{localize('DND5E.Hair')}</li>
    <li>{localize('DND5E.Height')}</li>
    <li>{localize('DND5E.Skin')}</li>
    <li>{localize('DND5E.Weight')}</li>
  </ul>
  <div class="grid-auto-columns">
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
</div>
