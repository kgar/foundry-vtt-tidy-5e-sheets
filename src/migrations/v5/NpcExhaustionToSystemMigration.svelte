<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Actor5e } from 'src/types/types';
  import { debug, error } from 'src/utils/logging';

  import { MigrationSelectionApplication } from '../migration-selection/MigrationSelectionApplication.svelte';
  import { CONSTANTS } from 'src/constants';
  import { migrateNpcExhaustionToSystem } from './npc-exhaustion-to-system';

  let migrating = $state(false);
  let deleteFlags = $state(false);

  async function migrate() {
    try {
      const actorsToMigrate = Array.from<any>(game.actors)
        .filter((a) => a.type === CONSTANTS.SHEET_TYPE_NPC && a.isOwner)
        .map((a) => ({ actor: a, unlinked: false }));
      const tokenActors = Array.from(canvas?.scene?.tokens ?? [])
        .filter(
          (t: any) =>
            t.actor?.type === CONSTANTS.SHEET_TYPE_NPC &&
            !t.actor.prototypeToken?.actorLink &&
            t.actor.isOwner,
        )
        .map((t: any) => ({ actor: t.actor, unlinked: true }));
      actorsToMigrate.push(...tokenActors);
      new MigrationSelectionApplication<{ actor: Actor5e; unlinked: boolean }>(
        {
          onConfirm: async (selected) => {
            migrating = true;
            ui.notifications.info(
              localize('TIDY5E.Settings.Migrations.migrationBeginningMessage'),
            );
            migrateActors(selected.map((s) => s.actor));
          },
          columns: [
            {
              cellWidth: 'primary',
              field: {
                type: 'simple',
                propPath: 'actor.name',
                onClick: (target) => target.actor.sheet.render(true),
              },
              name: localize('TIDY5E.Settings.Migrations.Selection.ToMigrate'),
            },
            {
              cellWidth: '5rem',
              field: {
                type: 'simple',
                propPath: `actor.flags.${CONSTANTS.MODULE_ID}.exhaustion`,
              },
              name: localize('DND5E.Exhaustion'),
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
          documents: actorsToMigrate,
          title: FoundryAdapter.localize(
            'TIDY5E.Settings.Migrations.NpcExhaustion.selectionDialogTitle',
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
    deleteFlags = false;
  }

  async function migrateActor(actor: Actor5e) {
    try {
      debug(`Migrating actor ${actor?.name}...`);
      migrateNpcExhaustionToSystem({
        npc: actor,
        clearFlagData: deleteFlags,
      });
      debug(`Actor ${actor?.name} migration successful!`);
    } catch (e) {
      error(
        `An error occurred while migrating NPC exhaustion data for ${actor?.name}`,
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
    {localize('TIDY5E.Settings.Migrations.NpcExhaustion.sectionTitle')}
  </h2>
  <p>{localize('TIDY5E.Settings.Migrations.UnlinkedExplanation')}</p>
  <h3>{localize('TIDY5E.Settings.Migrations.OptionsHeader')}</h3>
  <div class="options grid-auto-columns">
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

  <button type="button" onclick={(ev) => migrate()} disabled={migrating}
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
