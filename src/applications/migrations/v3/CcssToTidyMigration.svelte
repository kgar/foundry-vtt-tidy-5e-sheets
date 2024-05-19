<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { error } from 'src/utils/logging';
  import { MigrationSelectionApplication } from '../migration-selection/MigrationSelectionApplication';
  import type { Item5e } from 'src/types/item.types';
  import {
    ccssFlagPropPath,
    getCcssSectionName,
    migrateCcssToTidyForItem,
  } from './ccss-to-tidy';
  import { isNil } from 'src/utils/data';
  import { TidyFlags } from 'src/api';

  let migrating = false;
  let overwrite = false;
  let deleteFlags = false;

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
        unlinked: false,
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
              FoundryAdapter.localize(
                'TIDY5E.Settings.Migrations.migrationCompleteMessage',
              ),
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
      ).render(true);
    } catch (e) {
      error('An error occurred while preparing a bulk migration', false, e);
    }
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
      class="green-checkbox"
      data-tooltip={localize(
        'TIDY5E.Settings.Migrations.CcssToTidy.overwriteTooltip',
      )}
    >
      <input type="checkbox" bind:checked={overwrite} disabled={migrating} />
      {localize('TIDY5E.Settings.Migrations.CcssToTidy.overwrite')}
    </label>
    <label
      class="green-checkbox"
      data-tooltip={localize(
        'TIDY5E.Settings.Migrations.CcssToTidy.deleteFlagsTooltip',
      )}
    >
      <input type="checkbox" bind:checked={deleteFlags} disabled={migrating} />

      {localize('TIDY5E.Settings.Migrations.CcssToTidy.deleteFlags')}
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

  .callout-banner {
    background: var(--t5e-faintest-color);
    margin: -0.5rem -0.5rem 1rem -0.5rem;
    padding: 0.5rem 1rem;
  }
</style>
