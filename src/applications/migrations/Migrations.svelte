<script lang="ts">
  import { migrateAlphaFlagsToV1 } from 'src/applications/migrations/v1/alpha-flags-to-v1';
  import { migrateAlphaSettingsToV1 } from 'src/applications/migrations/v1/alpha-settings-to-v1';
  import { migrateOgFlagsToV1 } from 'src/applications/migrations/v1/og-flags-to-v1';
  import { migrateOgSettingsToV1 } from 'src/applications/migrations/v1/og-settings-to-v1';
  import { getContext } from 'svelte';

  const confirm = getContext<(onYes: () => void) => void>('confirm');
</script>

<h2>Migrating from Original Tidy5e Sheet</h2>

Remember to localize all this...

<button type="button" on:click={() => confirm(migrateOgFlagsToV1)}
  >Migrate Document Flags</button
>
<button type="button" on:click={() => confirm(migrateOgSettingsToV1)}
  >Migrate GM Settings</button
>

<h2>Migrating from Tidy 5e Sheets Alpha</h2>

Remember to localize all this...

<button type="button" on:click={() => confirm(migrateAlphaFlagsToV1)}
  >Migrate Document Flags</button
>
<button type="button" on:click={() => confirm(migrateAlphaSettingsToV1)}
  >Migrate GM Settings</button
>

<style lang="scss">
</style>
