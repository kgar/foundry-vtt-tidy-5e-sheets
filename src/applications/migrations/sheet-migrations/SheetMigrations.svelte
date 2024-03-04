<script lang="ts">
  import Notice from 'src/components/notice/Notice.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Actor5e } from 'src/types/types';
  import SheetMigrationBiography from './SheetMigrationBiography.svelte';
  import { CONSTANTS } from 'src/constants';
  import type { ComponentType } from 'svelte';

  export let actor: Actor5e | undefined;

  let migrations: {
    component: ComponentType;
    props?: Record<string, unknown>;
  }[] = [];
  $: {
    if (actor?.type === CONSTANTS.SHEET_TYPE_CHARACTER) {
      migrations.push({
        component: SheetMigrationBiography,
        props: { actor },
      });
    }
  }

  const localize = FoundryAdapter.localize;
</script>

<div class="flex-column migrations">
  {#if migrations.length && FoundryAdapter.userIsGm()}
    <Notice>
      {localize('TIDY5E.ReminderToBackUp')}
    </Notice>
  {/if}
  {#each migrations as migration}
    <div class="migration-panel">
      <svelte:component this={migration.component} {...migration.props} />
    </div>
  {:else}
    <p>{localize('TIDY5E.SheetMigrations.NoMigrations')}</p>
  {/each}
</div>

<style lang="scss">
  .migrations {
    --grid-auto-columns-min-width: 15rem;
  }
  .migration-panel {
    padding: 0.25rem 0.5rem;
    background: var(--t5e-header-background);
  }
</style>
