<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Actor5e } from 'src/types/types';
  import { error } from 'src/utils/logging';
  import { migrateBiographicalFlagsToV2Data } from '../migrations/v2/biographical-flags-to-v2';
  import { MigrationUtilities } from '../migrations/MigrationUtilities';

  export let actor: Actor5e | undefined;
  let migrating = false;
  let overwrite = false;
  let applyAll = false;
  let deleteFlags = false;

  const localize = FoundryAdapter.localize;

  async function migrate() {
    MigrationUtilities.confirmMigration(async () => {
      try {
        migrating = true;
        ui.notifications.info(
          localize('TIDY5E.Settings.Migrations.migrationBeginningMessage'),
        );
        const actorsToMigrate = applyAll
          ? Array.from(game.actors).filter(
              (a: Actor5e) => a.type === CONSTANTS.SHEET_TYPE_CHARACTER,
            )
          : [actor];
        for (let actor of actorsToMigrate) {
          migrateActor(actor);
        }
      } finally {
        migrating = false;
        ui.notifications.info(
          FoundryAdapter.localize(
            'TIDY5E.Settings.Migrations.migrationCompleteMessage',
          ),
        );
        overwrite = false;
        applyAll = false;
        deleteFlags = false;
      }
    });
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

    {#if FoundryAdapter.userIsGm()}
      <label
        class="green-checkbox"
        data-tooltip={localize('TIDY5E.SheetMigrations.OptionApplyAll.Tooltip')}
      >
        <input type="checkbox" bind:checked={applyAll} disabled={migrating} />
        {localize('TIDY5E.GMOnly.Message', {
          message: localize('TIDY5E.SheetMigrations.OptionApplyAll.Text'),
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
