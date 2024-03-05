<script lang="ts">
  import { migrateAlphaFlagsToV1 } from 'src/applications/migrations/v1/alpha-flags-to-v1';
  import { migrateAlphaSettingsToV1 } from 'src/applications/migrations/v1/alpha-settings-to-v1';
  import { migrateOgFlagsToV1 } from 'src/applications/migrations/v1/og-flags-to-v1';
  import { migrateOgSettingsToV1 } from 'src/applications/migrations/v1/og-settings-to-v1';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import type { ConfirmMigrationFunction } from './BulkMigrationsApplication';
  import Accordion from 'src/components/accordion/Accordion.svelte';
  import AccordionItem from 'src/components/accordion/AccordionItem.svelte';
  import SheetMigrationBiography from './sheet-migrations/SheetMigrationBiography.svelte';

  const confirm = getContext<ConfirmMigrationFunction>('confirm');
  const localize = FoundryAdapter.localize;
</script>

<Accordion multiple={true}>
  <AccordionItem open={true}>
    <svelte:fragment slot="header">
      {localize('DND5E.Biography')}
    </svelte:fragment>
    <SheetMigrationBiography actor={undefined} />
  </AccordionItem>
  <AccordionItem>
    <svelte:fragment slot="header">
      {localize('TIDY5E.Settings.Migrations.v1.sectionTitle')}
    </svelte:fragment>
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
      <button type="button" on:click={() => confirm(migrateOgFlagsToV1)}>
        <i class="fas fa-flag"></i>
        {@html localize(
          'TIDY5E.Settings.Migrations.migrateDocumentFlagsButtonLabel',
        )}
      </button>
      <button type="button" on:click={() => confirm(migrateOgSettingsToV1)}>
        <i class="fas fa-cog"></i>
        {@html localize(
          'TIDY5E.Settings.Migrations.migrateGmSettingsButtonLabel',
        )}
      </button>
    </div>

    <h2 class="flex-row align-items-center">
      <i class="fas fa-flask"></i>{@html localize(
        'TIDY5E.Settings.Migrations.v1.alphaHeader',
      )}
    </h2>
    <p>
      {@html localize('TIDY5E.Settings.Migrations.v1.alphaExplanation1')}
    </p>
    <p>
      {@html localize('TIDY5E.Settings.Migrations.v1.alphaExplanation2', {
        boldStart: '<b>',
        boldEnd: '</b>',
      })}
    </p>
    <div class="flex-row extra-small-gap">
      <button type="button" on:click={() => confirm(migrateAlphaFlagsToV1)}>
        <i class="fas fa-flag"></i>
        {@html localize(
          'TIDY5E.Settings.Migrations.migrateDocumentFlagsButtonLabel',
        )}
      </button>
      <button type="button" on:click={() => confirm(migrateAlphaSettingsToV1)}>
        <i class="fas fa-cog"></i>
        {@html localize(
          'TIDY5E.Settings.Migrations.migrateGmSettingsButtonLabel',
        )}
      </button>
    </div>
  </AccordionItem>
</Accordion>

<style lang="scss">
  .callout-banner {
    background: var(--t5e-faintest-color);
    margin: -0.5rem -0.5rem 1rem -0.5rem;
    padding: 0.5rem 1rem;
  }
</style>
