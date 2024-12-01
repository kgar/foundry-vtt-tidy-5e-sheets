<script lang="ts">
  import { MigrationSelectionApplication } from '../migration-selection/MigrationSelectionApplication';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { CompendiumToMigrate } from '../migration.types';
  import { debug, error } from 'src/utils/logging';
  import { migrateSpellClassToSourceClass } from './spell-class-to-source-class';
  import type { Item5e } from 'src/types/item.types';

  let migrating = $state(false);
  let deleteFlags = $state(false);
  let overwrite = $state(false);

  const localize = FoundryAdapter.localize;

  async function migrate() {
    const actorItemsToMigrate = Array.from<any>(game.actors)
      .filter((a) => a.isOwner)
      .map((a) => ({ actor: a, unlinked: false }))
      .flatMap((value) =>
        Array.from<Item5e>(value.actor.items)
          .filter((item) => item.type === CONSTANTS.ITEM_TYPE_SPELL)
          .map((item) => ({
            item,
            unlinked: value.unlinked,
          })),
      );

    const worldItemsToMigrate = Array.from<any>(game.items).map((item) => ({
      item,
      unlinked: true,
    }));

    const itemsToMigrate = [...actorItemsToMigrate, ...worldItemsToMigrate];

    new MigrationSelectionApplication<{ item: Item5e; unlinked: boolean }>({
      onConfirm: async (selected) => {
        migrating = true;

        ui.notifications.info(
          localize('TIDY5E.Settings.Migrations.migrationBeginningMessage'),
        );

        for (let choice of selected) {
          await migrateSpellClassToSourceClass({
            item: choice.item,
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
            propPath: 'item.name',
            onClick: (target) => target.item.sheet.render(true),
          },
          name: localize('TIDY5E.Settings.Migrations.Selection.ToMigrate'),
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
        'TIDY5E.Settings.Migrations.SpellClassToSourceClass.selectionDialogTitle',
      ),
    }).render(true);
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
              if (item.type !== CONSTANTS.ITEM_TYPE_SPELL) {
                continue;
              }

              await migrateSpellClassToSourceClass({
                item: item,
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
      'TIDY5E.Settings.Migrations.SpellClassToSourceClass.sectionTitle',
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
      onclick={(ev) => migrateCompendia()}
      disabled={migrating}
      >{localize('TIDY5E.Settings.Migrations.MigrateCompendia.Title')}</button
    >
    <button type="button" onclick={(ev) => migrate()} disabled={migrating}
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
