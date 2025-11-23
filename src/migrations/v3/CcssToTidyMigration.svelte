<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { debug, error } from 'src/utils/logging';
  import { MigrationSelectionApplication } from '../migration-selection/MigrationSelectionApplication.svelte';
  import type { Item5e } from 'src/types/item.types';
  import {
    ccssFlagPropPath,
    getCcssSectionName,
    migrateCcssToTidyForItem,
  } from './ccss-to-tidy';
  import { isNil } from 'src/utils/data';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import type { CompendiumToMigrate } from '../migration.types';

  let migrating = $state(false);
  let overwrite = $state(false);
  let deleteFlags = $state(false);

  async function migrate() {
    try {
      const actorItemsToMigrate = Array.from<any>(game.actors)
        .filter((a) => a.isOwner)
        .map((a) => ({ actor: a, unlinked: false }))
        .flatMap((value) =>
          Array.from(value.actor.items).map((item) => ({
            item,
            unlinked: value.unlinked,
          })),
        );

      const tokenActorItemsToMigrate = Array.from(canvas?.scene?.tokens ?? [])
        .map((t: any) => ({ actor: t.actor, unlinked: true }))
        .filter(
          (a) =>
            a.actor && !a.actor.prototypeToken?.actorLink && a.actor.isOwner,
        )
        .flatMap((value) =>
          Array.from(value.actor.items).map((item) => ({
            item,
            unlinked: value.unlinked,
          })),
        );

      const worldItemsToMigrate = Array.from<any>(game.items).map((item) => ({
        item,
        unlinked: true,
      }));

      const itemsToMigrate = [
        ...tokenActorItemsToMigrate,
        ...actorItemsToMigrate,
        ...worldItemsToMigrate,
      ].filter((value) => !isNil(getCcssSectionName(value.item), ''));

      new MigrationSelectionApplication<{ item: Item5e; unlinked: boolean }>(
        {
          onConfirm: async (selected) => {
            migrating = true;
            ui.notifications.info(
              localize('TIDY5E.Settings.Migrations.migrationBeginningMessage'),
            );

            for (let choice of selected) {
              await migrateCcssToTidyForItem({
                item: choice.item,
                overwrite: overwrite,
                clearCcssFlagData: deleteFlags,
              });
            }

            migrating = false;
            ui.notifications.info(
              localize('TIDY5E.Settings.Migrations.migrationCompleteMessage'),
            );
            resetOptions();
          },
          columns: [
            {
              cellWidth: 'primary',
              field: {
                type: 'simple',
                propPath: 'item.name',
                onClick: (target) => target.item.sheet.render(true),
              },
              name: localize('TIDY5E.Settings.Migrations.Selection.ToMigrate'),
            },
            {
              cellWidth: '8rem',
              field: {
                type: 'simple',
                propPath: `item.${ccssFlagPropPath}`,
              },
              name: localize('TIDY5E.Settings.Migrations.CcssToTidy.ccss'),
            },
            {
              cellWidth: '8rem',
              field: {
                type: 'simple',
                propPath: `item.${TidyFlags.section.prop}`,
              },
              name: localize('TIDY5E.Settings.Migrations.CcssToTidy.section'),
            },
            {
              cellWidth: '10rem',
              field: {
                type: 'simple',
                propPath: `item.parent.name`,
                onClick: (target) => target.item.parent?.sheet?.render(true),
              },
              name: localize('TIDY5E.Settings.Migrations.Parent'),
            },
            {
              cellWidth: '10rem',
              name: '',
              field: {
                type: 'contextual',
                getText: ({ unlinked }) =>
                  unlinked
                    ? FoundryAdapter.localize('TIDY5E.TokenUnlinked')
                    : FoundryAdapter.localize('DOCUMENT.Actor'),
              },
            },
          ],
          documents: itemsToMigrate,
          title: FoundryAdapter.localize(
            'TIDY5E.Settings.Migrations.CcssToTidy.selectionDialogTitle',
          ),
        },
        () => {
          migrating = false;
        },
        {
          width: 960,
        },
      ).render({ force: true });
    } catch (e) {
      error('An error occurred while preparing a bulk migration', false, e);
    }
  }

  async function migrateCompendia() {
    const compendiaForMigrating = Array.from(game.packs.values())
      .filter((c: any) => !c.locked && c.documentName === 'Item')
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
            const items = await game.packs.get(compendium.id).getDocuments();
            for (const item of items) {
              await migrateCcssToTidyForItem({
                item: item,
                overwrite: overwrite,
                clearCcssFlagData: deleteFlags,
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
    overwrite = false;
    deleteFlags = false;
  }

  const localize = FoundryAdapter.localize;
</script>

<section>
  <h2>
    {localize('TIDY5E.Settings.Migrations.CcssToTidy.sectionTitle')}
  </h2>
  <div class="callout-banner">
    <p>{localize('TIDY5E.Settings.Migrations.CcssToTidy.explanation1')}</p>
  </div>
  <p>{localize('TIDY5E.Settings.Migrations.UnlinkedExplanation')}</p>
  <h3>{localize('TIDY5E.Settings.Migrations.OptionsHeader')}</h3>
  <div class="options grid-auto-columns">
    <label
      data-tooltip={localize(
        'TIDY5E.Settings.Migrations.CcssToTidy.overwriteTooltip',
      )}
    >
      <input type="checkbox" bind:checked={overwrite} disabled={migrating} />
      {localize('TIDY5E.Settings.Migrations.CcssToTidy.overwrite')}
    </label>
    <label
      data-tooltip={localize(
        'TIDY5E.Settings.Migrations.CcssToTidy.deleteFlagsTooltip',
      )}
    >
      <input type="checkbox" bind:checked={deleteFlags} disabled={migrating} />

      {localize('TIDY5E.Settings.Migrations.CcssToTidy.deleteFlags')}
    </label>
  </div>

  <footer class="flex-row extra-small-gap">
    <button
      class="flex-1"
      type="button"
      onclick={(ev) => migrateCompendia()}
      disabled={migrating}
      >{localize('TIDY5E.Settings.Migrations.MigrateCompendia.Title')}</button
    >
    <button
      class="flex-1"
      type="button"
      onclick={(ev) => migrate()}
      disabled={migrating}
      >{localize('TIDY5E.Settings.Migrations.ButtonMigration.Text')}</button
    >
  </footer>
</section>

<style lang="less">
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

  .callout-banner {
    background: var(--t5e-faintest-color);
    margin: -0.5rem -0.5rem 1rem -0.5rem;
    padding: 0.5rem 1rem;
  }

  label {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
</style>
