<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import type MigrationNotificationFormApplication from './MigrationNotificationFormApplication';
  import { SettingsProvider } from 'src/settings/settings';
  import { BulkMigrationsApplication } from '../BulkMigrationsApplication';
  import { CONSTANTS } from 'src/constants';

  const localize = FoundryAdapter.localize;

  const confirm =
    getContext<MigrationNotificationFormApplication['confirm']>('confirm');

  const migrationsConfirmedTally =
    SettingsProvider.settings.migrationsConfirmationTally.get();

  const migrations = [
    {
      label: localize(
        'TIDY5E.Settings.Migrations.BondsIdealsFlawsToSystem.sectionTitle',
      ),
      migrationTallyVersion: 5,
      onClick: () =>
        new BulkMigrationsApplication(
          CONSTANTS.TAB_MIGRATIONS_BONDS_IDEALS_FLAWS_TO_SYSTEM,
        ).render(true),
    },
    {
      label: localize(
        'TIDY5E.Settings.Migrations.FavoritesToSystem.sectionTitle',
      ),
      migrationTallyVersion: 4,
      onClick: () =>
        new BulkMigrationsApplication(
          CONSTANTS.TAB_MIGRATIONS_FAVORITES_TO_SYSTEM,
        ).render(true),
    },
    {
      label: localize('TIDY5E.Settings.Migrations.CcssToTidy.sectionTitle'),
      migrationTallyVersion: 3,
      onClick: () =>
        new BulkMigrationsApplication(
          CONSTANTS.TAB_MIGRATIONS_CCSS_TO_TIDY,
        ).render(true),
    },
    {
      label: localize('TIDY5E.Settings.Migrations.NpcDeathSaves.sectionTitle'),
      migrationTallyVersion: 2,
      onClick: () =>
        new BulkMigrationsApplication(
          CONSTANTS.TAB_MIGRATIONS_NPC_DEATH,
        ).render(true),
    },
    {
      label: localize(
        'TIDY5E.Settings.Migrations.CharacterBiography.sectionTitle',
      ),
      migrationTallyVersion: 1,
      onClick: () =>
        new BulkMigrationsApplication(
          CONSTANTS.TAB_MIGRATIONS_CHARACTER_BIOGRAPHY,
        ).render(true),
    },
  ];
</script>

<div class="flex-column">
  <p>
    {@html localize('TIDY5E.Settings.Migrations.Notification.Explanation', {
      boldStart: '<b>',
      boldEnd: '</b>',
    })}
    <i
      data-tooltip={localize(
        'TIDY5E.Settings.Migrations.Notification.Explanation2',
      )}
      class="fas fa-question-circle"
    ></i>
  </p>
  <ul>
    {#each migrations as migration}
      {@const isNew =
        migrationsConfirmedTally < migration.migrationTallyVersion}
      <li class:new={isNew} class="flex-row small-gap">
        {#if isNew}
          <i class="new-icon fas fa-star" />
        {/if}
        <button
          type="button"
          class="inline-transparent-button highlight-on-hover"
          on:click={() => migration.onClick()}
        >
          <span>{migration.label}</span>
        </button>
        {#if isNew}
          <hr />
        {/if}
      </li>
    {/each}
  </ul>

  <div class="button-bar flex-row no-gap">
    <button type="button" on:click={() => confirm()}
      >{localize(
        'TIDY5E.Settings.Migrations.Notification.Button.DoNotShowAgain',
      )}</button
    >
  </div>
</div>

<style lang="scss">
  ul {
    list-style: none;
    margin: 0;
  }

  p {
    margin: 0;
  }

  .new-icon {
    color: var(--t5e-primary-accent-color);
  }

  hr {
    background: linear-gradient(
      to right,
      var(--t5e-primary-accent-color),
      transparent
    );
    height: 0.125rem;
    border: none;
    flex: 1;
    align-self: center;
  }

  .button-bar {
    margin-top: 1rem;
  }
</style>
