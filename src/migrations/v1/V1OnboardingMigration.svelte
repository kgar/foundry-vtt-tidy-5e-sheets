<script lang="ts">
  import { migrateOgFlagsToV1 } from 'src/migrations/v1/og-flags-to-v1';
  import { migrateOgSettingsToV1 } from 'src/migrations/v1/og-settings-to-v1';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import type { ConfirmMigrationFunction } from '../BulkMigrationsApplication';
  import { CONSTANTS } from 'src/constants';

  const localize = FoundryAdapter.localize;

  const confirm = getContext<ConfirmMigrationFunction>(
    CONSTANTS.SVELTE_CONTEXT.CONFIRM,
  );
</script>

<h2>{localize('TIDY5E.Settings.Migrations.v1.sectionTitle')}</h2>
<div class="flex-row align-items-center callout-banner">
  <div>
    <p>
      {@html localize('TIDY5E.Settings.Migrations.v1.mainExplanation1')}
    </p>
    <p>
      {@html localize('TIDY5E.Settings.Migrations.v1.mainExplanation2', {
        boldStart: '<b>',
        boldEnd: '</b>',
      })}
    </p>
  </div>
</div>
<h2 class="flex-row align-items-center">
  <i class="fas fa-scroll"></i>{@html localize(
    'TIDY5E.Settings.Migrations.v1.originalHeader',
  )}
</h2>
<p>{@html localize('TIDY5E.Settings.Migrations.v1.originalExplanation')}</p>
<div class="flex-row extra-small-gap">
  <button type="button" onclick={() => confirm(migrateOgFlagsToV1)}>
    <i class="fas fa-flag"></i>
    {@html localize(
      'TIDY5E.Settings.Migrations.migrateDocumentFlagsButtonLabel',
    )}
  </button>
  <button type="button" onclick={() => confirm(migrateOgSettingsToV1)}>
    <i class="fas fa-cog"></i>
    {@html localize('TIDY5E.Settings.Migrations.migrateGmSettingsButtonLabel')}
  </button>
</div>

<style lang="scss">
  .callout-banner {
    background: var(--t5e-faintest-color);
    margin: -0.5rem -0.5rem 1rem -0.5rem;
    padding: 0.5rem 1rem;
  }
</style>
