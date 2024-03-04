<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import type MigrationNotificationFormApplication from './MigrationNotificationFormApplication';
  import { SettingsProvider } from 'src/settings/settings';

  const localize = FoundryAdapter.localize;

  const confirm =
    getContext<MigrationNotificationFormApplication['confirm']>('confirm');

  const migrationsConfirmedTally =
    SettingsProvider.settings.migrationsConfirmationTally.get();

  const migrations = [
    { label: localize('DND5E.Biography'), migrationTallyVersion: 1 },
  ];
</script>

<div class="flex-column">
  <p>
    {localize(
      'TIDY5E.SheetMigrations.Notification.SheetMigrationsAvailable.Explanation',
    )}
    <i
      data-tooltip={localize(
        'TIDY5E.SheetMigrations.Notification.SheetMigrationsAvailable.Explanation2',
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
        <span>{migration.label}</span>
        {#if isNew}
          <hr />
        {/if}
      </li>
    {/each}
  </ul>

  <div class="button-bar flex-row no-gap">
    <button type="button" on:click={() => confirm()}
      >{localize(
        'TIDY5E.SheetMigrations.Notification.SheetMigrationsAvailable.Button.DoNotShowAgain',
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
