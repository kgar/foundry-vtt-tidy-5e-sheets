<script lang="ts">
  import type { Actor5e } from 'src/types/types';
  import { MigrationSelectionApplication } from '../migration-selection/MigrationSelectionApplication';
  import { CONSTANTS } from 'src/constants';
  import { migrateBondsIdealsFlawsToSystem } from './bonds-ideals-flaws-to-system';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { CompendiumToMigrate } from '../migration.types';
  import { debug, error } from 'src/utils/logging';

  let migrating = false;
  let deleteFlags = false;
  let overwrite = false;

  const localize = FoundryAdapter.localize;

  async function migrate() {
    const actorsToMigrate = Array.from<Actor5e>(game.actors).filter(
      (a) => a.isOwner && a.type === CONSTANTS.SHEET_TYPE_NPC,
    );

    new MigrationSelectionApplication<{ item: Actor5e }>({
      onConfirm: async (selected) => {
        migrating = true;

        ui.notifications.info(
          localize('TIDY5E.Settings.Migrations.migrationBeginningMessage'),
        );

        for (let choice of selected) {
          await migrateBondsIdealsFlawsToSystem({
            npc: choice,
            clearFlagData: deleteFlags,
            overwrite: overwrite,
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
        'TIDY5E.Settings.Migrations.BondsIdealsFlawsToSystem.selectionDialogTitle',
      ),
    }).render(true);
  }

  async function migrateCompendia() {
    const compendiaForMigrating = Array.from(game.packs.values())
      .filter((c: any) => !c.locked && c.documentName === 'Actor')
      .map((c: any) => ({
        label: c.metadata.label,
        type: c.metadata.type,
        id: c.metadata.id,
        size: c.index.size,
      }));

    new MigrationSelectionApplication<CompendiumToMigrate>({
      onConfirm: async (selected) => {
        ui.notifications.info(
          localize(`TIDY5E.Settings.Migrations.migrationBeginningMessage`),
        );
        for (const compendium of selected) {
          debug(`Migrating compendium "${compendium.label}"...`);
          try {
            const actors = await game.packs.get(compendium.id).getDocuments();
            for (const actor of actors) {
              if (actor.type !== CONSTANTS.SHEET_TYPE_NPC) {
                continue;
              }

              await migrateBondsIdealsFlawsToSystem({
                npc: actor,
                overwrite: overwrite,
                clearFlagData: deleteFlags,
              });
            }
            debug(`Compendium "${compendium.label}" migration successful.`);
          } catch (e) {
            error(
              localize('TIDY5E.Settings.Migrations.migrationErrorMessage'),
              true,
            );
            error(
              `Error while migrating compendium "${compendium.label}"`,
              false,
              e,
            );
          }
        }
        ui.notifications.info(
          localize(`TIDY5E.Settings.Migrations.migrationCompleteMessage`),
        );
      },
      columns: [
        {
          cellWidth: 'primary',
          field: {
            type: 'simple',
            propPath: 'label',
            onClick: (target) => game.packs.get(target.id).render(true),
          },
          name: localize(
            'TIDY5E.Settings.Migrations.MigrateCompendia.CompendiumLabel',
          ),
        },
        {
          cellWidth: '5rem',
          field: {
            type: 'contextual',
            getText: (c) => localize(`DOCUMENT.${c.type}`),
          },
          name: localize('Type'),
        },
        {
          cellWidth: '10rem',
          field: {
            type: 'simple',
            propPath: 'size',
          },
          name: localize(
            'TIDY5E.Settings.Migrations.MigrateCompendia.TotalEntriesLabel',
          ),
        },
      ],
      documents: compendiaForMigrating,
      title: localize(
        'TIDY5E.Settings.Migrations.MigrateCompendia.SelectionDialogTitle',
      ),
    }).render(true);
  }

  function resetOptions() {
    deleteFlags = false;
    overwrite = false;
  }
</script>

<section>
  <h2>
    {localize(
      'TIDY5E.Settings.Migrations.BondsIdealsFlawsToSystem.sectionTitle',
    )}
  </h2>
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

  <footer class="flex-row extra-small-gap">
    <button
      type="button"
      on:click={(ev) => migrateCompendia()}
      disabled={migrating}
      >{localize('TIDY5E.Settings.Migrations.MigrateCompendia.Title')}</button
    >
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
