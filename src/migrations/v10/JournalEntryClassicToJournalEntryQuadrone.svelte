<script lang="ts">
  import { TidyFlags } from "src/foundry/TidyFlags";
  import type { Actor5e } from 'src/types/types';
  import { isNil } from 'src/utils/data';
  import { MigrationSelectionApplication } from '../migration-selection/MigrationSelectionApplication.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { migrateClassicTidyJournalsToTidyQuadrone } from './journal-entry-classic-to-journal-entry-quadrone';
  import { error } from 'src/utils/logging';

  const localize = FoundryAdapter.localize;

  let migrating = $state(false);
  let deleteFlags = $state(false);

  function eligible(actor: Actor5e) {
    return [
      !isNil(TidyFlags.notes.get(actor)?.value, '') ||
        !isNil(TidyFlags.notes1.get(actor)?.name, '') ||
        !isNil(TidyFlags.notes1.get(actor)?.value, '') ||
        !isNil(TidyFlags.notes2.get(actor)?.name, '') ||
        !isNil(TidyFlags.notes2.get(actor)?.value, '') ||
        !isNil(TidyFlags.notes3.get(actor)?.name, '') ||
        !isNil(TidyFlags.notes3.get(actor)?.value, '') ||
        !isNil(TidyFlags.notes4.get(actor)?.name, '') ||
        !isNil(TidyFlags.notes4.get(actor)?.value, ''),
    ].some((x) => x);
  }

  async function migrate() {
    try {
      const actorsToMigrate = Array.from<any>(game.actors).filter(
        (a) => a.isOwner && eligible(a),
      );

      new MigrationSelectionApplication<{ actor: Actor5e }>(
        {
          onConfirm: async (selected) => {
            migrating = true;
            ui.notifications.info(
              localize('TIDY5E.Settings.Migrations.migrationBeginningMessage'),
            );

            for (let choice of selected) {
              await migrateClassicTidyJournalsToTidyQuadrone(
                choice.actor,
                deleteFlags,
              );
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
                propPath: 'actor.name',
                onClick: (target) => target.actor.sheet.render({ force: true }),
              },
              name: localize('Actor'),
            },
          ],
          documents: actorsToMigrate.map((a) => ({
            actor: a,
          })),
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

  function resetOptions() {
    deleteFlags = false;
  }
</script>

<section>
  <h2>
    {localize('Journal')}
  </h2>
  <div class="callout-banner">
    <p>
      {localize('TIDY5E.Settings.Migrations.Journal.explanation1')}
    </p>
  </div>

  <h3>{localize('TIDY5E.Settings.Migrations.OptionsHeader')}</h3>
  <div class="options grid-auto-columns">
    <label>
      <input type="checkbox" bind:checked={deleteFlags} disabled={migrating} />

      {localize('TIDY5E.Settings.Migrations.OptionDeleteFlags.Text')}
    </label>
  </div>
  <footer class="flex-row extra-small-gap">
    <button
      class="flex-1"
      type="button"
      onclick={(ev) => migrate()}
      disabled={migrating}
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
